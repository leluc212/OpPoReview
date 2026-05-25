import json
import boto3
import os
from datetime import datetime
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'PostStandardJob')
table = dynamodb.Table(table_name)

# Helper function to convert Decimal to int/float for JSON serialization
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    ULTRA-ROBUST Lambda handler for PostStandardJob
    Supports all path variations, stage names, and trailing slashes.
    """
    print(f"Event Trace: {json.dumps(event)}")
    
    # --- 1. CORE CORS HEADERS (Must be first) ---
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json'
    }
    
    http_method = event.get('httpMethod')
    path = event.get('path', '')
    path_parameters = event.get('pathParameters') or {}
    
    # --- 2. PREFLIGHT OPTIONS HANDLER ---
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # --- 3. PATH NORMALIZATION (The 403/404 Killer) ---
        # Tự động xử lý: /prod/jobs/ -> /jobs
        normalized_path = path.rstrip('/')
        path_segments = [s for s in normalized_path.split('/') if s]
        
        # Strip stage name
        if path_segments and path_segments[0] in ['prod', 'test', 'dev']:
            normalized_path = '/' + '/'.join(path_segments[1:])
        else:
            normalized_path = '/' + '/'.join(path_segments) if path_segments else '/'
            
        print(f"DEBUG: {http_method} {path} normalized to {normalized_path}")
        
        # --- 4. AUTH EXTRACTION ---
        authorizer = event.get('requestContext', {}).get('authorizer', {})
        claims = authorizer.get('claims', {})
        user_id = claims.get('sub')
        
        if not user_id:
            try:
                body = json.loads(event.get('body', '{}'))
                user_id = body.get('employerId') or body.get('userId')
            except: pass
        
        if not user_id and http_method == 'GET':
            user_id = 'anonymous'

        # --- 5. SECURE ROUTING ---
        
        # A. GET /jobs HOẶC / (Lấy toàn bộ cho Admin)
        if http_method == 'GET' and (normalized_path == '/jobs' or normalized_path == '/' or not normalized_path):
            response = table.scan()
            items = [item for item in response.get('Items', []) if item.get('status') != 'deleted']
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': items}, default=decimal_default)}
            
        # B. GET /jobs/active
        elif http_method == 'GET' and normalized_path == '/jobs/active':
            response = table.scan(FilterExpression='#s = :s', ExpressionAttributeNames={'#s': 'status'}, ExpressionAttributeValues={':s': 'active'})
            items = response.get('Items', [])
            items.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': items}, default=decimal_default)}

        # C. GET /jobs/employer/{employerId}
        elif http_method == 'GET' and '/employer/' in normalized_path:
            emp_id = path_parameters.get('employerId') or (path_segments[-1] if path_segments else None)
            response = table.query(IndexName='EmployerIndex', KeyConditionExpression='employerId = :e', ExpressionAttributeValues={':e': emp_id})
            items = [item for item in response.get('Items', []) if item.get('status') != 'deleted']
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': items}, default=decimal_default)}

        # D. POST /jobs (Create)
        elif http_method == 'POST' and normalized_path == '/jobs':
            body = json.loads(event.get('body', '{}'))
            # Simple fallback for missing fields in demo
            item = {
                'idJob': body.get('idJob', f"JOB-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"),
                'employerId': body.get('employerId', user_id),
                'title': body.get('title', 'Untitled Job'),
                'status': 'active',
                'createdAt': datetime.utcnow().isoformat() + 'Z',
                'updatedAt': datetime.utcnow().isoformat() + 'Z'
            }
            # Add all other body fields
            for k, v in body.items():
                if k not in item: item[k] = v
            table.put_item(Item=item)
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'success': True, 'data': item}, default=decimal_default)}

        # E. GET /jobs/{idJob}
        elif '/jobs/' in normalized_path:
            jid = path_parameters.get('idJob') or (path_segments[-1] if path_segments else None)
            if jid == 'active': # Safety catch
                 return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': []})} # Handled above
            
            res = table.get_item(Key={'idJob': jid})
            if 'Item' not in res:
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'success': False, 'message': 'Job not found'})}
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'data': res['Item']}, default=decimal_default)}

        # F. FALLBACK
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'success': False, 'message': f'Route not found: {normalized_path}'})
        }

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'success': False, 'message': f'Internal Server Error: {str(e)}'})
        }
