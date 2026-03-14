import json
import boto3
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PackageSubscriptions')

# Package pricing and duration mapping
PACKAGES = {
    'Quick Boost': {
        '24h': 29000,
        '7 ngày': 145000
    },
    'Hot Search': {
        '24h': 49000,
        '7 ngày': 245000
    },
    'Spotlight Banner': {
        '24h': 99000,
        '7 ngày': 495000
    },
    'Top Spotlight': {
        '24h': 149000,
        '7 ngày': 745000
    }
}

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def calculate_expiry_date(purchase_date, duration):
    """Calculate expiry date based on duration"""
    purchase_dt = datetime.fromisoformat(purchase_date)
    
    if duration == '24h':
        expiry_dt = purchase_dt + timedelta(days=1)
    elif duration == '7 ngày':
        expiry_dt = purchase_dt + timedelta(days=7)
    else:
        expiry_dt = purchase_dt + timedelta(days=7)  # Default
    
    return expiry_dt.isoformat().split('T')[0]

def lambda_handler(event, context):
    print(f"Event: {json.dumps(event)}")
    
    http_method = event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method'))
    path = event.get('path', event.get('rawPath', ''))
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json'
    }
    
    try:
        # Handle OPTIONS request
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'OK'})
            }
        
        # GET all subscriptions
        if http_method == 'GET' and path == '/subscriptions':
            response = table.scan()
            items = response.get('Items', [])
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(items, default=decimal_default)
            }
        
        # GET subscriptions by employer
        if http_method == 'GET' and '/subscriptions/employer/' in path:
            employer_id = path.split('/')[-1]
            
            response = table.query(
                IndexName='EmployerIndex',
                KeyConditionExpression='employerId = :eid',
                ExpressionAttributeValues={':eid': employer_id}
            )
            
            items = response.get('Items', [])
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(items, default=decimal_default)
            }
        
        # POST - Create new subscription
        if http_method == 'POST' and path == '/subscriptions':
            body = json.loads(event.get('body', '{}'))
            
            # Validate required fields
            required_fields = ['employerId', 'companyName', 'packageName', 'duration']
            for field in required_fields:
                if field not in body:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': f'Missing required field: {field}'})
                    }
            
            package_name = body['packageName']
            duration = body['duration']
            
            # Validate package and duration
            if package_name not in PACKAGES:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': f'Invalid package name: {package_name}'})
                }
            
            if duration not in PACKAGES[package_name]:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': f'Invalid duration for package {package_name}: {duration}'})
                }
            
            # Get price
            price = PACKAGES[package_name][duration]
            
            # Create subscription
            subscription_id = str(uuid.uuid4())
            purchase_date = datetime.now().isoformat().split('T')[0]
            expiry_date = calculate_expiry_date(purchase_date, duration)
            
            item = {
                'subscriptionId': subscription_id,
                'employerId': body['employerId'],
                'companyName': body['companyName'],
                'packageName': package_name,
                'duration': duration,
                'price': Decimal(str(price)),
                'purchaseDate': purchase_date,
                'expiryDate': expiry_date,
                'status': body.get('status', 'pending'),
                'approvalStatus': body.get('approvalStatus', 'pending'),
                'createdAt': datetime.now().isoformat(),
                'updatedAt': datetime.now().isoformat()
            }
            
            table.put_item(Item=item)
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(item, default=decimal_default)
            }
        
        # PUT - Update subscription (approve/reject)
        if http_method == 'PUT' and '/subscriptions/' in path:
            subscription_id = path.split('/')[-1]
            body = json.loads(event.get('body', '{}'))
            
            # Get existing item
            response = table.get_item(Key={'subscriptionId': subscription_id})
            
            if 'Item' not in response:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Subscription not found'})
                }
            
            # Update fields
            update_expression = 'SET updatedAt = :updated'
            expression_values = {':updated': datetime.now().isoformat()}
            
            if 'status' in body:
                update_expression += ', #status = :status'
                expression_values[':status'] = body['status']
            
            if 'approvalStatus' in body:
                update_expression += ', approvalStatus = :approval'
                expression_values[':approval'] = body['approvalStatus']
                
                # If approving, recalculate dates
                if body['approvalStatus'] == 'approved':
                    purchase_date = datetime.now().isoformat().split('T')[0]
                    item = response['Item']
                    expiry_date = calculate_expiry_date(purchase_date, item['duration'])
                    
                    update_expression += ', purchaseDate = :purchase, expiryDate = :expiry'
                    expression_values[':purchase'] = purchase_date
                    expression_values[':expiry'] = expiry_date
            
            # Perform update
            response = table.update_item(
                Key={'subscriptionId': subscription_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames={'#status': 'status'} if 'status' in body else None,
                ExpressionAttributeValues=expression_values,
                ReturnValues='ALL_NEW'
            )
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(response['Attributes'], default=decimal_default)
            }
        
        # DELETE subscription
        if http_method == 'DELETE' and '/subscriptions/' in path:
            subscription_id = path.split('/')[-1]
            
            table.delete_item(Key={'subscriptionId': subscription_id})
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Subscription deleted successfully'})
            }
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Route not found'})
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
