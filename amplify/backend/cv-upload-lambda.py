import json
import boto3
import base64
import uuid
from datetime import datetime
from decimal import Decimal

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CandidateProfiles')

BUCKET_NAME = 'opporeview-cv-storage'
ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def lambda_handler(event, context):
    print(f"Event: {json.dumps(event)}")
    
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
    
    # Handle OPTIONS request (though API Gateway should handle this)
    http_method = event.get('requestContext', {}).get('http', {}).get('method')
    if not http_method:
        # Fallback for API Gateway REST API format
        http_method = event.get('httpMethod')
    
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Parse request
        path = event.get('rawPath', event.get('path', ''))
        
        print(f"HTTP Method: {http_method}, Path: {path}")
        
        # GET /cv/{userId} - Get CV info
        if http_method == 'GET' and '/cv/' in path:
            user_id = path.split('/cv/')[-1].replace('/prod', '').strip('/')
            return get_cv_info(user_id, headers)
        
        # POST /cv/upload - Upload CV
        elif http_method == 'POST' and path.endswith('/upload'):
            body = json.loads(event.get('body', '{}'))
            return upload_cv(body, headers)
        
        # DELETE /cv/{userId} - Delete CV
        elif http_method == 'DELETE' and '/cv/' in path:
            user_id = path.split('/cv/')[-1].replace('/prod', '').strip('/')
            return delete_cv(user_id, headers)
        
        else:
            print(f"No matching route for {http_method} {path}")
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Not found'})
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def upload_cv(body, headers):
    """Upload CV to S3 and update DynamoDB"""
    user_id = body.get('userId')
    file_name = body.get('fileName')
    file_content = body.get('fileContent')  # base64 encoded
    file_type = body.get('fileType', 'application/pdf')
    
    if not all([user_id, file_name, file_content]):
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Missing required fields: userId, fileName, fileContent'})
        }
    
    # Validate file extension
    file_ext = '.' + file_name.split('.')[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'})
        }
    
    # Decode base64 content
    try:
        file_data = base64.b64decode(file_content)
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid base64 content'})
        }
    
    # Check file size
    if len(file_data) > MAX_FILE_SIZE:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': f'File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB'})
        }
    
    # Generate unique file name
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    s3_key = f"cvs/{user_id}/{timestamp}_{unique_id}_{file_name}"
    
    # Upload to S3
    try:
        # Convert filename to ASCII-safe format for metadata
        import unicodedata
        safe_filename = unicodedata.normalize('NFKD', file_name).encode('ascii', 'ignore').decode('ascii')
        if not safe_filename:
            safe_filename = 'cv_file' + file_ext
        
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=file_data,
            ContentType=file_type,
            ContentDisposition=f'inline; filename="{file_name}"',  # Preserve original name for download
            Metadata={
                'userId': user_id,
                'originalFileName': safe_filename,  # ASCII-safe version
                'uploadDate': datetime.now().isoformat()
            }
        )
        
        # Generate presigned URL (valid for 7 days) - use inline for viewing
        cv_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': BUCKET_NAME, 
                'Key': s3_key,
                'ResponseContentDisposition': f'inline; filename="{file_name}"'  # Changed to inline for viewing
            },
            ExpiresIn=604800  # 7 days
        )
        
        # Update DynamoDB with CV info
        response = table.update_item(
            Key={'userId': user_id},
            UpdateExpression='SET cvUrl = :url, cvFileName = :name, cvS3Key = :key, cvUploadDate = :date, updatedAt = :updated',
            ExpressionAttributeValues={
                ':url': cv_url,
                ':name': file_name,
                ':key': s3_key,
                ':date': datetime.now().isoformat(),
                ':updated': datetime.now().isoformat()
            },
            ReturnValues='ALL_NEW'
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'CV uploaded successfully',
                'cvUrl': cv_url,
                'cvFileName': file_name,
                's3Key': s3_key,
                'profile': convert_decimals(response.get('Attributes', {}))
            })
        }
        
    except Exception as e:
        print(f"S3 upload error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Failed to upload CV: {str(e)}'})
        }

def get_cv_info(user_id, headers):
    """Get CV information for a user"""
    try:
        response = table.get_item(Key={'userId': user_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'User not found'})
            }
        
        item = response['Item']
        cv_info = {
            'cvUrl': item.get('cvUrl'),
            'cvFileName': item.get('cvFileName'),
            'cvUploadDate': item.get('cvUploadDate'),
            's3Key': item.get('cvS3Key')
        }
        
        # If CV exists and URL is expired, generate new presigned URL
        if cv_info.get('s3Key'):
            try:
                # Get original filename from DynamoDB
                original_filename = item.get('cvFileName', 'cv_file.pdf')
                
                new_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': BUCKET_NAME, 
                        'Key': cv_info['s3Key'],
                        'ResponseContentDisposition': f'inline; filename="{original_filename}"'  # Changed to inline for viewing
                    },
                    ExpiresIn=604800  # 7 days
                )
                cv_info['cvUrl'] = new_url
                
                # Update DynamoDB with new URL
                table.update_item(
                    Key={'userId': user_id},
                    UpdateExpression='SET cvUrl = :url',
                    ExpressionAttributeValues={':url': new_url}
                )
            except Exception as e:
                print(f"Error generating presigned URL: {str(e)}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(cv_info)
        }
        
    except Exception as e:
        print(f"Error getting CV info: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def delete_cv(user_id, headers):
    """Delete CV from S3 and DynamoDB"""
    try:
        # Get current CV info
        response = table.get_item(Key={'userId': user_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'User not found'})
            }
        
        item = response['Item']
        s3_key = item.get('cvS3Key')
        
        # Delete from S3 if exists
        if s3_key:
            try:
                s3_client.delete_object(Bucket=BUCKET_NAME, Key=s3_key)
            except Exception as e:
                print(f"Error deleting from S3: {str(e)}")
        
        # Remove CV info from DynamoDB
        table.update_item(
            Key={'userId': user_id},
            UpdateExpression='REMOVE cvUrl, cvFileName, cvS3Key, cvUploadDate SET updatedAt = :updated',
            ExpressionAttributeValues={
                ':updated': datetime.now().isoformat()
            }
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CV deleted successfully'})
        }
        
    except Exception as e:
        print(f"Error deleting CV: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def convert_decimals(obj):
    """Convert Decimal objects to int/float for JSON serialization"""
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    else:
        return obj
