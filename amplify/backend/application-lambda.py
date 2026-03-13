import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
applications_table = dynamodb.Table('StandardApplications')
jobs_table = dynamodb.Table('PostStandardJob')
quick_jobs_table = dynamodb.Table('PostQuickJob')

def lambda_handler(event, context):
    print(f"📥 Received event: {json.dumps(event)}")
    
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
    
    # Handle OPTIONS request FIRST (before auth check)
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method')
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'OK'})
        }
    
    try:
        # Extract user info from Cognito authorizer
        authorizer = event.get('requestContext', {}).get('authorizer', {})
        claims = authorizer.get('claims', {}) or authorizer.get('jwt', {}).get('claims', {})
        candidate_id = claims.get('sub')
        candidate_email = claims.get('email')
        
        if not candidate_id:
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'error': 'Unauthorized - No user ID'})
            }
        
        path = event.get('path', '') or event.get('rawPath', '')
        
        # POST /applications - Submit application
        if http_method == 'POST' and path == '/applications':
            return submit_application(event, candidate_id, candidate_email, headers)
        
        # GET /applications/candidate/{candidateId} - Get candidate's applications
        elif http_method == 'GET' and '/applications/candidate/' in path:
            return get_candidate_applications(candidate_id, headers)
        
        # GET /applications/job/{jobId} - Get applications for a job (employer only)
        elif http_method == 'GET' and '/applications/job/' in path:
            job_id = path.split('/')[-1]
            return get_job_applications(job_id, candidate_id, headers)
        
        # PUT /applications/{applicationId}/status - Update application status (employer only)
        elif http_method == 'PUT' and '/status' in path:
            application_id = path.split('/')[-2]
            return update_application_status(event, application_id, candidate_id, headers)
        
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Not found'})
            }
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def submit_application(event, candidate_id, candidate_email, headers):
    """Submit a new job application"""
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Required fields
        job_id = body.get('jobId')
        cv_url = body.get('cvUrl')
        cv_filename = body.get('cvFilename')
        
        # Convert jobId to string to ensure consistency
        if job_id is not None:
            job_id = str(job_id)
        
        # Optional fields from frontend (if job not in DB)
        job_title_from_request = body.get('jobTitle')
        employer_id_from_request = body.get('employerId')
        employer_email_from_request = body.get('employerEmail')
        
        if not job_id or not cv_url:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Missing required fields: jobId, cvUrl'})
            }
        
        # ANTI-SPAM: Check if user already applied to this job
        try:
            existing_response = applications_table.query(
                IndexName='CandidateIndex',
                KeyConditionExpression='candidateId = :cid',
                FilterExpression='jobId = :jid',
                ExpressionAttributeValues={
                    ':cid': candidate_id,
                    ':jid': job_id
                }
            )
            
            if existing_response.get('Items'):
                return {
                    'statusCode': 409,  # Conflict
                    'headers': headers,
                    'body': json.dumps({
                        'error': 'You have already applied to this job',
                        'code': 'ALREADY_APPLIED'
                    })
                }
        except Exception as e:
            print(f"Warning: Could not check existing applications: {e}")
        
        # ANTI-SPAM: Rate limiting - check recent applications from this user
        try:
            from datetime import datetime, timedelta
            
            # Check applications in last 30 seconds
            thirty_seconds_ago = (datetime.now() - timedelta(seconds=30)).isoformat()
            
            recent_response = applications_table.query(
                IndexName='CandidateIndex',
                KeyConditionExpression='candidateId = :cid',
                FilterExpression='appliedAt > :time',
                ExpressionAttributeValues={
                    ':cid': candidate_id,
                    ':time': thirty_seconds_ago
                }
            )
            
            if len(recent_response.get('Items', [])) >= 1:  # Max 1 application per 30 seconds
                return {
                    'statusCode': 429,  # Too Many Requests
                    'headers': headers,
                    'body': json.dumps({
                        'error': 'Rate limit exceeded. Please wait 30 seconds between applications.',
                        'code': 'RATE_LIMITED'
                    })
                }
        except Exception as e:
            print(f"Warning: Could not check rate limit: {e}")
        
        # Get job details to get employer info
        job = None
        employer_id = None
        employer_email = None
        job_title = None
        job_type = 'standard'
        
        # Try standard jobs first
        try:
            response = jobs_table.get_item(Key={'idJob': job_id})
            if 'Item' in response:
                job = response['Item']
                employer_id = job.get('employerId')
                employer_email = job.get('employerEmail')
                job_title = job.get('title')
                job_type = 'standard'
        except Exception as e:
            print(f"Not found in PostStandardJob: {e}")
        
        # Try quick jobs if not found
        if not job:
            try:
                response = quick_jobs_table.get_item(Key={'idJob': job_id})
                if 'Item' in response:
                    job = response['Item']
                    employer_id = job.get('employerId')
                    employer_email = job.get('employerEmail')
                    job_title = job.get('title')
                    job_type = 'quick'
            except Exception as e:
                print(f"Not found in PostQuickJob: {e}")
        
        # If job not found in DB, use info from request (for demo/mock jobs)
        if not job:
            print(f"⚠️ Job {job_id} not found in DB, using request data")
            employer_id = employer_id_from_request or 'DEMO-EMPLOYER'
            employer_email = employer_email_from_request or 'demo@example.com'
            job_title = job_title_from_request or 'Unknown Job'
            job_type = 'demo'
        
        # Generate application ID
        application_id = f"APP-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Create application record
        application = {
            'applicationId': application_id,
            'jobId': job_id,
            'jobTitle': job_title,
            'jobType': job_type,
            'candidateId': candidate_id,
            'candidateEmail': candidate_email,
            'employerId': employer_id,
            'employerEmail': employer_email,
            'cvUrl': cv_url,
            'cvFilename': cv_filename or 'CV.pdf',
            'status': 'pending',
            'appliedAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        # Save to DynamoDB
        applications_table.put_item(Item=application)
        
        # Update job applicants count
        if job_type == 'standard':
            jobs_table.update_item(
                Key={'idJob': job_id},
                UpdateExpression='SET applicants = if_not_exists(applicants, :zero) + :inc, updatedAt = :now',
                ExpressionAttributeValues={
                    ':inc': 1,
                    ':zero': 0,
                    ':now': datetime.now().isoformat()
                }
            )
        else:
            quick_jobs_table.update_item(
                Key={'idJob': job_id},
                UpdateExpression='SET applicants = if_not_exists(applicants, :zero) + :inc, updatedAt = :now',
                ExpressionAttributeValues={
                    ':inc': 1,
                    ':zero': 0,
                    ':now': datetime.now().isoformat()
                }
            )
        
        print(f"✅ Application created: {application_id}")
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'message': 'Application submitted successfully',
                'applicationId': application_id,
                'application': application
            }, default=str)
        }
    
    except Exception as e:
        print(f"❌ Error submitting application: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def get_candidate_applications(candidate_id, headers):
    """Get all applications for a candidate"""
    try:
        response = applications_table.query(
            IndexName='CandidateIndex',
            KeyConditionExpression='candidateId = :cid',
            ExpressionAttributeValues={':cid': candidate_id}
        )
        
        applications = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'applications': applications,
                'count': len(applications)
            }, default=str)
        }
    
    except Exception as e:
        print(f"❌ Error getting candidate applications: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def get_job_applications(job_id, user_id, headers):
    """Get all applications for a job (employer only)"""
    try:
        # Verify user is the employer for this job
        job = None
        try:
            response = jobs_table.get_item(Key={'idJob': job_id})
            if 'Item' in response:
                job = response['Item']
        except:
            pass
        
        if not job:
            try:
                response = quick_jobs_table.get_item(Key={'idJob': job_id})
                if 'Item' in response:
                    job = response['Item']
            except:
                pass
        
        if not job:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Job not found'})
            }
        
        if job.get('employerId') != user_id:
            return {
                'statusCode': 403,
                'headers': headers,
                'body': json.dumps({'error': 'Forbidden - Not your job'})
            }
        
        # Get applications
        response = applications_table.query(
            IndexName='JobIndex',
            KeyConditionExpression='jobId = :jid',
            ExpressionAttributeValues={':jid': job_id}
        )
        
        applications = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'applications': applications,
                'count': len(applications)
            }, default=str)
        }
    
    except Exception as e:
        print(f"❌ Error getting job applications: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def update_application_status(event, application_id, user_id, headers):
    """Update application status (employer only)"""
    try:
        body = json.loads(event.get('body', '{}'))
        new_status = body.get('status')
        
        if not new_status:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Missing status'})
            }
        
        # Get application
        response = applications_table.get_item(Key={'applicationId': application_id})
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Application not found'})
            }
        
        application = response['Item']
        
        # Verify user is the employer
        if application.get('employerId') != user_id:
            return {
                'statusCode': 403,
                'headers': headers,
                'body': json.dumps({'error': 'Forbidden - Not your application'})
            }
        
        # Update status
        applications_table.update_item(
            Key={'applicationId': application_id},
            UpdateExpression='SET #status = :status, updatedAt = :now',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':status': new_status,
                ':now': datetime.now().isoformat()
            }
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Status updated successfully',
                'applicationId': application_id,
                'status': new_status
            })
        }
    
    except Exception as e:
        print(f"❌ Error updating application status: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
