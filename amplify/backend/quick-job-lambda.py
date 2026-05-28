import json
import boto3
import os
from datetime import datetime
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'PostQuickJob')
table = dynamodb.Table(table_name)

# Helper function to convert Decimal to int/float for JSON serialization
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    Main Lambda handler for PostQuickJob API
    """
    print(f"Event: {json.dumps(event)}")
    
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'application/json'
    }
    
    # Check if this is API Gateway v2 format (HTTP API)
    is_v2 = 'requestContext' in event and 'http' in event.get('requestContext', {})
    
    if is_v2:
        # API Gateway v2 format
        http_method = event.get('requestContext', {}).get('http', {}).get('method')
        path = event.get('rawPath', '')
        path_parameters = event.get('pathParameters') or {}
        body = event.get('body', '{}')
    else:
        # API Gateway v1 format (fallback)
        http_method = event.get('httpMethod')
        path = event.get('path', '')
        path_parameters = event.get('pathParameters') or {}
        body = event.get('body', '{}')
    
    print(f"DEBUG: http_method={http_method}, path={path}")

    # --- PATH NORMALIZATION (SỬA LỖI 404/500 KHI CÓ STAGE PHÍ GI TIEP) ---
    # Tự động loại bỏ /prod hoặc /test nếu có để việc so khớp route luôn đúng
    normalized_path = path
    path_segments = [s for s in path.split('/') if s]
    if path_segments and (path_segments[0] == 'prod' or path_segments[0] == 'test'):
        normalized_path = '/' + '/'.join(path_segments[1:])
    
    print(f"DEBUG: normalized_path={normalized_path}")
    
    # Handle OPTIONS request for CORS
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Extract user ID from Cognito authorizer
        authorizer = event.get('requestContext', {}).get('authorizer', {})
        claims = authorizer.get('claims', {})
        user_id = claims.get('sub')
        
        # If no authorizer, try to get userId from request body (for testing)
        if not user_id:
            try:
                body_data = json.loads(body) if isinstance(body, str) else body
                user_id = body_data.get('employerId') or body_data.get('userId')
            except:
                pass
        
        # For GET requests without auth, allow public access
        if not user_id and http_method == 'GET':
            user_id = 'anonymous'
        
        print(f"User ID: {user_id}")
        
        # --- ROUTING LOGIC (ƯU TIÊN ROUTE TĨNH ĐỂ KHÔNG BỊ NHẦM VỚI {idJob}) ---
        
        # 1. POST /quick-jobs (Tạo công việc)
        if http_method == 'POST' and normalized_path == '/quick-jobs':
            return create_quick_job(body, user_id, headers)
            
        # 2. GET /quick-jobs (Admin lấy toàn bộ danh sách - FIX 404)
        elif http_method == 'GET' and normalized_path == '/quick-jobs':
            return get_all_quick_jobs(headers)
        
        # 3. GET /quick-jobs/active (Lấy các công việc đang hoạt động - FIX 500)
        elif http_method == 'GET' and normalized_path == '/quick-jobs/active':
            return get_active_quick_jobs(headers)
            
        # 4. GET /quick-jobs/employer/ (Dành cho nhà tuyển dụng)
        elif http_method == 'GET' and '/quick-jobs/employer/' in normalized_path:
            employer_id = path_parameters.get('employerId')
            return get_employer_quick_jobs(employer_id, headers)
            
        # 5. POST /views (Tăng lượt xem)
        elif http_method == 'POST' and '/views' in normalized_path:
            job_id = path_parameters.get('idJob')
            return increment_views(job_id, headers)
        
        # 6. Các route dựa trên idJob (PHẢI ĐỂ CUỐI CÙNG ĐỂ KHÔNG NUỐT MẤT /active)
        elif '/quick-jobs/' in normalized_path:
            job_id = path_parameters.get('idJob')
            
            # Bảo vệ thêm: nếu idJob là 'active', ta đã đi nhầm route
            if job_id == 'active' or normalized_path.endswith('/active'):
                return get_active_quick_jobs(headers)
                
            if http_method == 'GET':
                return get_quick_job(job_id, headers)
            elif http_method == 'PUT':
                return update_quick_job(body, job_id, user_id, headers)
            elif http_method == 'DELETE':
                return delete_quick_job(job_id, user_id, headers)
        
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': f'Endpoint not found: {normalized_path}'
                })
            }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Internal server error: {str(e)}'
            })
        }

def create_quick_job(body_str, user_id, headers):
    """Create new quick job post"""
    try:
        body = json.loads(body_str) if isinstance(body_str, str) else body_str
        
        print(f"Creating quick job with body: {json.dumps(body)}")
        
        # Validate required fields
        required_fields = ['idJob', 'title', 'location', 'hourlyRate', 'startTime', 'endTime', 'description']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    })
                }
        
        # Use employerId from body if user_id is anonymous
        employer_id = body.get('employerId', user_id)
        
        # Convert numeric fields safely
        def to_decimal(val, default='0'):
            try: return Decimal(str(val)) if val is not None else Decimal(default)
            except: return Decimal(default)

        # Create item
        item = {
            'jobID': body['idJob'],
            'employerId': employer_id,
            'employerEmail': body.get('employerEmail', ''),
            'companyName': body.get('companyName', ''),
            'title': body['title'],
            'location': body['location'],
            'latitude': to_decimal(body.get('latitude'), None) if body.get('latitude') else None,
            'longitude': to_decimal(body.get('longitude'), None) if body.get('longitude') else None,
            'jobType': body.get('jobType', 'part-time'),
            'hourlyRate': to_decimal(body.get('hourlyRate')),
            'startTime': body['startTime'],
            'endTime': body['endTime'],
            'totalHours': to_decimal(body.get('totalHours')),
            'totalSalary': to_decimal(body.get('totalSalary')),
            'description': body['description'],
            'requirements': body.get('requirements', ''),
            'status': body.get('status', 'pending'),
            'category': 'quick-jobs',
            'applicants': 0,
            'views': 0,
            'workDate': body.get('workDate', ''),
            'createdAt': body.get('createdAt', datetime.utcnow().isoformat() + 'Z'),
            'updatedAt': body.get('updatedAt', datetime.utcnow().isoformat() + 'Z')
        }
        
        # Put item in DynamoDB
        table.put_item(Item=item)
        
        print(f"✅ Quick job created: {item['jobID']}")
        
        # Return with idJob for API consistency
        item['idJob'] = item['jobID']
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Quick job created successfully',
                'data': item
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error creating quick job: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error creating quick job: {str(e)}'
            })
        }

def get_all_quick_jobs(headers):
    """Admin route to list ALL non-deleted jobs"""
    try:
        response = table.scan()
        items = [i for i in response.get('Items', []) if i.get('status') != 'deleted']
        print(f"✅ Found {len(items)} total quick jobs (Scan)")
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': items
            }, default=decimal_default)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': str(e)
            })
        }

def get_employer_quick_jobs(employer_id, headers):
    """Get all quick jobs for an employer"""
    try:
        response = table.query(
            IndexName='EmployerIndex',
            KeyConditionExpression='employerId = :eid',
            ExpressionAttributeValues={
                ':eid': employer_id
            },
            ScanIndexForward=False
        )
        
        items = [item for item in response.get('Items', []) if item.get('status') != 'deleted']
        print(f"✅ Found {len(items)} quick jobs for employer {employer_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': items
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error getting employer quick jobs: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error getting quick jobs: {str(e)}'
            })
        }

def get_active_quick_jobs(headers):
    """Get all active quick job posts"""
    try:
        response = table.query(
            IndexName='StatusIndex',
            KeyConditionExpression='#status = :status',
            ExpressionAttributeNames={
                '#status': 'status'
            },
            ExpressionAttributeValues={
                ':status': 'active'
            },
            ScanIndexForward=False
        )
        
        items = response.get('Items', [])
        print(f"✅ Found {len(items)} active quick jobs")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': items
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error getting active quick jobs: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error getting active quick jobs: {str(e)}'
            })
        }

def get_quick_job(job_id, headers):
    """Get single quick job by ID"""
    try:
        response = table.get_item(Key={'jobID': job_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Quick job not found'
                })
            }
        
        item = response['Item']
        print(f"✅ Quick job found: {job_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': item
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error getting quick job: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error getting quick job: {str(e)}'
            })
        }

def update_quick_job(body_str, job_id, user_id, headers):
    """Update quick job"""
    try:
        response = table.get_item(Key={'jobID': job_id})
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Quick job not found'
                })
            }
        
        existing_job = response['Item']
        if user_id and user_id != 'anonymous' and existing_job.get('employerId') != user_id:
            return {
                'statusCode': 403,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Forbidden'
                })
            }
        
        body = json.loads(body_str) if isinstance(body_str, str) else body_str
        update_expr = "SET updatedAt = :updatedAt"
        expr_values = {':updatedAt': datetime.utcnow().isoformat() + 'Z'}
        expr_names = {}
        
        updatable_fields = ['title', 'location', 'latitude', 'longitude', 'jobType', 'hourlyRate', 'startTime', 'endTime',
                           'totalHours', 'totalSalary', 'description', 'requirements', 'status', 'workDate']
        
        reserved_keywords = ['location', 'status']
        
        for field in updatable_fields:
            if field in body:
                value = body[field]
                if field in ['latitude', 'longitude', 'hourlyRate', 'totalHours', 'totalSalary'] and value is not None:
                    value = Decimal(str(value))
                
                if field in reserved_keywords:
                    update_expr += f", #{field} = :{field}"
                    expr_names[f'#{field}'] = field
                    expr_values[f':{field}'] = value
                else:
                    update_expr += f", {field} = :{field}"
                    expr_values[f':{field}'] = value
        
        update_params = {
            'Key': {'jobID': job_id},
            'UpdateExpression': update_expr,
            'ExpressionAttributeValues': expr_values,
            'ReturnValues': 'ALL_NEW'
        }
        if expr_names:
            update_params['ExpressionAttributeNames'] = expr_names
        
        response = table.update_item(**update_params)
        print(f"✅ Quick job updated: {job_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': response['Attributes']
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error updating quick job: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error updating quick job: {str(e)}'
            })
        }

def delete_quick_job(job_id, user_id, headers):
    """Delete quick job (soft delete)"""
    try:
        table.update_item(
            Key={'jobID': job_id},
            UpdateExpression='SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': 'deleted',
                ':updatedAt': datetime.utcnow().isoformat() + 'Z'
            }
        )
        print(f"✅ Quick job deleted: {job_id}")
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Quick job deleted successfully'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': str(e)
            })
        }

def increment_views(job_id, headers):
    """Increment view count for a quick job"""
    try:
        response = table.get_item(Key={'jobID': job_id})
        if 'Item' not in response:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'success': False})}

        item = response['Item']
        new_views = int(item.get('views', 0) or 0) + 1
        
        table.update_item(
            Key={'jobID': job_id},
            UpdateExpression='SET views = :v, updatedAt = :u',
            ExpressionAttributeValues={
                ':v': new_views,
                ':u': datetime.utcnow().isoformat() + 'Z'
            }
        )
        print(f"✅ View count incremented for quick job: {job_id}")
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'View count incremented'
            })
        }
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'success': False})}
