import json
import os
from datetime import datetime

import boto3

cognito = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table(os.environ.get('USERS_TABLE_NAME', 'Users'))


def get_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json'
    }


def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': get_headers(),
        'body': json.dumps(body)
    }


def normalize_path(path):
    path = path or ''
    path = path.rstrip('/')
    segments = [s for s in path.split('/') if s]
    if segments and segments[0] in ['prod', 'dev', 'test']:
        segments = segments[1:]
    return '/' + '/'.join(segments)


def get_claims(event):
    auth = event.get('requestContext', {}).get('authorizer', {})
    return auth.get('claims') or auth.get('jwt', {}).get('claims') or {}


def resolve_user_pool_id(claims):
    if os.environ.get('USER_POOL_ID'):
        return os.environ['USER_POOL_ID']

    issuer = claims.get('iss', '')
    if issuer:
        return issuer.rstrip('/').split('/')[-1]
    return None


def update_groups(user_pool_id, username, role):
    if not user_pool_id:
        raise ValueError('Cannot resolve Cognito user pool id')

    target_group = 'Employer' if role == 'employer' else 'Candidate'
    other_group = 'Candidate' if target_group == 'Employer' else 'Employer'

    # Remove from opposite group if exists.
    try:
        cognito.admin_remove_user_from_group(
            UserPoolId=user_pool_id,
            Username=username,
            GroupName=other_group,
        )
    except cognito.exceptions.UserNotFoundException:
        pass
    except Exception:
        # Ignore removal failures for idempotency.
        pass

    cognito.admin_add_user_to_group(
        UserPoolId=user_pool_id,
        Username=username,
        GroupName=target_group,
    )


def upsert_user(user_id, email, role):
    now = datetime.utcnow().isoformat() + 'Z'
    users_table.update_item(
        Key={'userId': user_id},
        UpdateExpression='SET #role = :role, #email = if_not_exists(#email, :email), #updatedAt = :updatedAt, #createdAt = if_not_exists(#createdAt, :createdAt)',
        ExpressionAttributeNames={
            '#role': 'role',
            '#email': 'email',
            '#updatedAt': 'updatedAt',
            '#createdAt': 'createdAt',
        },
        ExpressionAttributeValues={
            ':role': role,
            ':email': email or '',
            ':updatedAt': now,
            ':createdAt': now,
        },
    )


def lambda_handler(event, context):
    method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')
    path = normalize_path(event.get('path') or event.get('rawPath'))

    if method == 'OPTIONS':
        return response(200, {'message': 'OK'})

    if method != 'POST' or path not in ['/users/me/role', '/users/role', '/role']:
        return response(404, {'message': f'Route not found: {method} {path}'})

    claims = get_claims(event)
    user_id = claims.get('sub')
    username = claims.get('cognito:username') or claims.get('username') or user_id
    email = claims.get('email')

    if not user_id:
        return response(401, {'message': 'Unauthorized'})

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return response(400, {'message': 'Invalid JSON body'})

    role = (body.get('role') or '').strip().lower()
    if role not in ['candidate', 'employer']:
        return response(400, {'message': 'Invalid role. Must be candidate or employer.'})

    try:
        user_pool_id = resolve_user_pool_id(claims)
        update_groups(user_pool_id, username, role)
        upsert_user(user_id, email, role)
        return response(200, {'success': True, 'role': role, 'userId': user_id})
    except Exception as err:
        print('Role update error:', err)
        return response(500, {'message': str(err)})
