import json
import boto3
from decimal import Decimal
from datetime import datetime, timedelta
import collections

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-1')
candidates_table = dynamodb.Table('CandidateProfiles')
standard_jobs_table = dynamodb.Table('PostStandardJob')
quick_jobs_table = dynamodb.Table('PostQuickJob')
applications_table = dynamodb.Table('StandardApplications')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super(DecimalEncoder, self).default(obj)

def get_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json'
    }

def lambda_handler(event, context):
    try:
        http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')
        path = event.get('path') or event.get('rawPath', '')
        
        headers = get_cors_headers()

        if http_method == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': ''}

        # Route requests
        if path == '/applicants' or path == '/applicants/' or path == '/candidates' or path == '/candidates/':
            return get_applicants(headers)
        elif path == '/applicants/stats':
            return get_applicants_stats(headers)
        elif path == '/applicants/charts':
            return get_applicants_charts(headers)
        elif path == '/jobs/stats':
            return get_jobs_stats(headers)
        elif path == '/admin/applications' or path == '/admin/applications/':
            return get_all_applications_admin(headers)
        else:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': f'Route not found: {path}'})
            }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def get_applicants(headers):
    # Scan CandidateProfiles for list view
    response = candidates_table.scan()
    items = response.get('Items', [])
    
    while 'LastEvaluatedKey' in response:
        response = candidates_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))
    
    # Sort by createdAt descending
    items.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(items, cls=DecimalEncoder)
    }

def get_applicants_stats(headers):
    # Get all items to compute stats
    response = candidates_table.scan(ProjectionExpression='createdAt, kycCompleted, ekycStatus')
    items = response.get('Items', [])
    
    while 'LastEvaluatedKey' in response:
        response = candidates_table.scan(ProjectionExpression='createdAt, kycCompleted, ekycStatus', ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))
    
    now = datetime.now()
    this_month_str = now.strftime('%Y-%m')
    
    total = len(items)
    this_month = sum(1 for item in items if item.get('createdAt', '').startswith(this_month_str))
    
    # Verification stats
    verified = sum(1 for item in items if item.get('kycCompleted') == True or item.get('ekycStatus') == 'verified')
    response_rate = int(round((verified / total) * 100)) if total > 0 else 0
    
    # Previous month for trend
    prev_month_date = now.replace(day=1) - timedelta(days=1)
    prev_month_str = prev_month_date.strftime('%Y-%m')
    prev_month = sum(1 for item in items if item.get('createdAt', '').startswith(prev_month_str))
    
    trend = "0%"
    if prev_month > 0:
        growth = ((this_month - prev_month) / prev_month) * 100
        trend = f"{'+' if growth >= 0 else ''}{growth:.1f}%"
    elif this_month > 0:
        trend = "+100%"
        
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'total': total,
            'thisMonth': this_month,
            'verified': verified,
            'responseRate': response_rate,
            'trend': trend
        })
    }

def get_applicants_charts(headers):
    # Get applicant growth over last 6 months
    response = candidates_table.scan(ProjectionExpression='createdAt')
    items = response.get('Items', [])
    
    while 'LastEvaluatedKey' in response:
        response = candidates_table.scan(ProjectionExpression='createdAt', ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response.get('Items', []))
        
    # Group by month
    month_counts = collections.Counter()
    for item in items:
        dt_str = item.get('createdAt', '')
        if dt_str:
            month_counts[dt_str[:7]] += 1
            
    # Generate last 6 months list
    now = datetime.now()
    chart_data = []
    # Using 6 months window
    for i in range(5, -1, -1):
        # Calculate date for each month
        # This handle year transitions correctly
        first_of_this_month = now.replace(day=1)
        target_month_date = first_of_this_month
        for _ in range(i):
            target_month_date = (target_month_date - timedelta(days=1)).replace(day=1)
            
        month_str = target_month_date.strftime('%Y-%m')
        chart_data.append({
            'label': f"T{target_month_date.month}",
            'month': month_str,
            'count': month_counts[month_str]
        })
        
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(chart_data)
    }

def get_jobs_stats(headers):
    # Aggregate data from both job tables
    def get_all_items(table):
        resp = table.scan(ProjectionExpression='createdAt, jobType, category')
        items = resp.get('Items', [])
        while 'LastEvaluatedKey' in resp:
            resp = table.scan(ProjectionExpression='createdAt, jobType, category', ExclusiveStartKey=resp['LastEvaluatedKey'])
            items.extend(resp.get('Items', []))
        return items

    standard_items = get_all_items(standard_jobs_table)
    quick_items = get_all_items(quick_jobs_table)
    
    all_jobs = standard_items + quick_items
    
    # Process for last 6 months
    now = datetime.now()
    chart_data = []
    for i in range(5, -1, -1):
        first_of_this_month = now.replace(day=1)
        target_month_date = first_of_this_month
        for _ in range(i):
            target_month_date = (target_month_date - timedelta(days=1)).replace(day=1)
            
        month_str = target_month_date.strftime('%Y-%m')
        
        month_jobs = [j for j in all_jobs if j.get('createdAt', '').startswith(month_str)]
        regular = sum(1 for j in month_jobs if j.get('category', '') != 'urgent' and j.get('jobType', '') != 'urgent')
        # Urgent jobs include both category/jobType='urgent' and any from quick jobs table
        # We also look for labels in quick jobs
        urgent = len(month_jobs) - regular
        
        chart_data.append({
            'label': f"T{target_month_date.month}",
            'month': month_str,
            'regularJobs': regular,
            'urgentJobs': urgent
        })
        
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(chart_data)
    }

def get_all_applications_admin(headers):
    """Scan all applications for Admin Dashboard"""
    try:
        response = applications_table.scan()
        items = response.get('Items', [])
        
        while 'LastEvaluatedKey' in response:
            response = applications_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))
        
        # Add success wrapper to match expected frontend format
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'applications': items,
                'count': len(items)
            }, cls=DecimalEncoder)
        }
    except Exception as e:
        print(f"Error scanning applications: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
