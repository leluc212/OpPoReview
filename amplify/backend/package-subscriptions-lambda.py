import json
import boto3
import os
from datetime import datetime, timedelta
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME', 'PackageSubscriptions')
table = dynamodb.Table(table_name)

# Helper function to convert Decimal to int/float for JSON serialization
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    """
    Main Lambda handler for PackageSubscriptions API
    """
    print(f"Event: {json.dumps(event)}")
    
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'application/json; charset=utf-8'
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
    
    print(f"HTTP Method: {http_method}, Path: {path}")
    
    # Handle OPTIONS request for CORS
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Route requests
        if http_method == 'POST' and path == '/subscriptions':
            return create_subscription(body, headers)
        
        elif http_method == 'GET' and path == '/subscriptions':
            return get_all_subscriptions(headers)
        
        elif http_method == 'GET' and '/subscriptions/employer/' in path:
            employer_id = path_parameters.get('employerId')
            return get_employer_subscriptions(employer_id, headers)
        
        elif http_method == 'GET' and '/subscriptions/' in path:
            subscription_id = path_parameters.get('subscriptionId')
            return get_subscription(subscription_id, headers)
        
        elif http_method == 'PUT' and '/subscriptions/' in path:
            subscription_id = path_parameters.get('subscriptionId')
            return update_subscription(body, subscription_id, headers)
        
        elif http_method == 'DELETE' and '/subscriptions/' in path:
            subscription_id = path_parameters.get('subscriptionId')
            return delete_subscription(subscription_id, headers)
        
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Endpoint not found'
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

def generate_subscription_id():
    """Generate unique subscription ID"""
    from datetime import datetime
    import random
    import string
    
    date_str = datetime.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"SUB-{date_str}-{random_str}"

def calculate_expiry_date(duration):
    """Calculate expiry date based on duration"""
    now = datetime.now()
    
    if '24h' in duration or '24 h' in duration:
        expiry = now + timedelta(days=1)
    elif '7' in duration:
        expiry = now + timedelta(days=7)
    elif '30' in duration or 'tháng' in duration or 'month' in duration:
        expiry = now + timedelta(days=30)
    else:
        # Default to 7 days
        expiry = now + timedelta(days=7)
    
    return expiry.strftime('%Y-%m-%d')

def get_package_price(package_name, duration):
    """Get package price based on name and duration"""
    prices = {
        'Quick Boost': {'24h': 29000, '7 ngày': 145000, '7 days': 145000},
        'Hot Search': {'24h': 49000, '7 ngày': 245000, '7 days': 245000},
        'Spotlight Banner': {'24h': 99000, '7 ngày': 495000, '7 days': 495000},
        'Top Spotlight': {'24h': 149000, '7 ngày': 745000, '7 days': 745000}
    }
    
    return prices.get(package_name, {}).get(duration, 0)

def create_subscription(body_str, headers):
    """Create new subscription request"""
    try:
        body = json.loads(body_str) if isinstance(body_str, str) else body_str
        
        print(f"Creating subscription with body: {json.dumps(body)}")
        
        # Validate required fields
        required_fields = ['employerId', 'companyName', 'packageName', 'duration']
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
        
        # Generate subscription ID
        subscription_id = generate_subscription_id()
        
        # Calculate price
        price = get_package_price(body['packageName'], body['duration'])
        
        # Calculate expiry date
        expiry_date = calculate_expiry_date(body['duration'])
        
        # Create item
        item = {
            'subscriptionId': subscription_id,
            'employerId': body['employerId'],
            'companyName': body['companyName'],
            'packageName': body['packageName'],
            'duration': body['duration'],
            'price': Decimal(str(price)),
            'purchaseDate': datetime.now().strftime('%Y-%m-%d'),
            'expiryDate': expiry_date,
            'status': 'pending',  # pending, active, expired
            'approvalStatus': 'pending',  # pending, approved, rejected
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        # Put item in DynamoDB
        table.put_item(Item=item)
        
        print(f"✅ Subscription created: {subscription_id}")
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Subscription request created successfully',
                'data': item
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error creating subscription: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error creating subscription: {str(e)}'
            })
        }

def get_all_subscriptions(headers):
    """Get all subscriptions"""
    try:
        response = table.scan()
        items = response.get('Items', [])
        
        print(f"✅ Found {len(items)} subscriptions")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(items, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error getting subscriptions: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error getting subscriptions: {str(e)}'
            })
        }

def get_employer_subscriptions(employer_id, headers):
    """Get all subscriptions for an employer"""
    try:
        response = table.query(
            IndexName='EmployerIndex',
            KeyConditionExpression='employerId = :eid',
            ExpressionAttributeValues={
                ':eid': employer_id
            }
        )
        
        items = response.get('Items', [])
        print(f"✅ Found {len(items)} subscriptions for employer {employer_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': items
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error getting employer subscriptions: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error getting subscriptions: {str(e)}'
            })
        }

def get_subscription(subscription_id, headers):
    """Get single subscription by ID"""
    try:
        response = table.get_item(Key={'subscriptionId': subscription_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Subscription not found'
                })
            }
        
        item = response['Item']
        print(f"✅ Subscription found: {subscription_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'data': item
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error getting subscription: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error getting subscription: {str(e)}'
            })
        }

def update_subscription(body_str, subscription_id, headers):
    """Update subscription (for admin approval)"""
    try:
        # First, get the existing subscription
        response = table.get_item(Key={'subscriptionId': subscription_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Subscription not found'
                })
            }
        
        # Parse update data
        body = json.loads(body_str) if isinstance(body_str, str) else body_str
        
        # Build update expression
        update_expr = "SET updatedAt = :updatedAt"
        expr_values = {':updatedAt': datetime.now().isoformat()}
        expr_names = {}
        
        # Add fields to update
        updatable_fields = ['status', 'approvalStatus', 'purchaseDate', 'expiryDate']
        
        for field in updatable_fields:
            if field in body:
                value = body[field]
                
                if field == 'status':
                    update_expr += f", #status = :status"
                    expr_names['#status'] = 'status'
                    expr_values[':status'] = value
                else:
                    update_expr += f", {field} = :{field}"
                    expr_values[f':{field}'] = value
        
        # If approving, set dates
        if body.get('approvalStatus') == 'approved' or body.get('status') == 'active':
            if 'purchaseDate' not in body:
                update_expr += ", purchaseDate = :purchaseDate"
                expr_values[':purchaseDate'] = datetime.now().strftime('%Y-%m-%d')
            
            if 'expiryDate' not in body:
                # Get duration from existing item
                existing_item = response['Item']
                duration = existing_item.get('duration', '7 ngày')
                expiry_date = calculate_expiry_date(duration)
                update_expr += ", expiryDate = :expiryDate"
                expr_values[':expiryDate'] = expiry_date
        
        # Update item
        update_params = {
            'Key': {'subscriptionId': subscription_id},
            'UpdateExpression': update_expr,
            'ExpressionAttributeValues': expr_values,
            'ReturnValues': 'ALL_NEW'
        }
        
        if expr_names:
            update_params['ExpressionAttributeNames'] = expr_names
        
        response = table.update_item(**update_params)
        
        updated_item = response['Attributes']
        print(f"✅ Subscription updated: {subscription_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Subscription updated successfully',
                'data': updated_item
            }, default=decimal_default)
        }
    
    except Exception as e:
        print(f"Error updating subscription: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error updating subscription: {str(e)}'
            })
        }

def delete_subscription(subscription_id, headers):
    """Delete subscription"""
    try:
        table.delete_item(Key={'subscriptionId': subscription_id})
        
        print(f"✅ Subscription deleted: {subscription_id}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Subscription deleted successfully'
            })
        }
    
    except Exception as e:
        print(f"Error deleting subscription: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Error deleting subscription: {str(e)}'
            })
        }
