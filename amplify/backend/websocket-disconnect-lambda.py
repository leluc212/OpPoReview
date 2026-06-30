"""
Lambda handler cho WebSocket $disconnect route.
Xoá connectionId khỏi bảng AdminWebSocketConnections.

Trigger: API Gateway WebSocket $disconnect
"""

import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
connections_table = dynamodb.Table(os.environ.get('CONNECTIONS_TABLE', 'AdminWebSocketConnections'))

def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    
    try:
        connections_table.delete_item(Key={'connectionId': connection_id})
        print(f"✅ Admin ngắt kết nối WebSocket: {connection_id}")
        return {'statusCode': 200, 'body': 'Đã ngắt kết nối'}
    except Exception as e:
        print(f"❌ Lỗi xoá connectionId {connection_id}: {e}")
        return {'statusCode': 500, 'body': str(e)}
