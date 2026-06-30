"""
Lambda handler — trigger bởi DynamoDB Streams trên bảng Applications.
Khi có yêu cầu huỷ ca mới (INSERT với status=pending_change) hoặc được cập nhật
(MODIFY với changeRequestStatus thay đổi), broadcast tới tất cả admin đang kết nối
qua API Gateway WebSocket Management API.

Cấu hình trigger:
  - Source: DynamoDB Stream của bảng Applications
  - Batch size: 10 (hoặc tuỳ chỉnh)
  - Starting position: LATEST
  - Filter pattern (JSON):
    {
      "dynamodb": {
        "NewImage": {
          "status": { "S": ["pending_change"] }
        }
      }
    }
    Hoặc bỏ filter để xử lý tất cả và tự lọc trong code (như implementation dưới đây).

Environment variables:
  CONNECTIONS_TABLE   : tên bảng DynamoDB lưu connectionId (mặc định: AdminWebSocketConnections)
  WS_API_ENDPOINT     : endpoint API Gateway WebSocket dạng https://xxx.execute-api.region.amazonaws.com/prod
"""

import json
import boto3
import os
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
connections_table = dynamodb.Table(os.environ.get('CONNECTIONS_TABLE', 'AdminWebSocketConnections'))
WS_API_ENDPOINT = os.environ.get('WS_API_ENDPOINT', '')


class DecimalEncoder(json.JSONEncoder):
    """Chuyển Decimal sang float/int để serialize JSON."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super().default(obj)


def unmarshal_value(ddb_val):
    """Chuyển DynamoDB typed value về Python native."""
    if 'S' in ddb_val:
        return ddb_val['S']
    if 'N' in ddb_val:
        v = ddb_val['N']
        return int(v) if '.' not in v else float(v)
    if 'BOOL' in ddb_val:
        return ddb_val['BOOL']
    if 'NULL' in ddb_val:
        return None
    if 'M' in ddb_val:
        return {k: unmarshal_value(v) for k, v in ddb_val['M'].items()}
    if 'L' in ddb_val:
        return [unmarshal_value(i) for i in ddb_val['L']]
    return str(ddb_val)


def unmarshal_image(image):
    """Chuyển DynamoDB NewImage / OldImage về dict Python."""
    return {k: unmarshal_value(v) for k, v in image.items()} if image else {}


def get_all_admin_connections():
    """Lấy tất cả connectionId có role=admin từ bảng connections."""
    try:
        resp = connections_table.scan(
            FilterExpression='#r = :admin',
            ExpressionAttributeNames={'#r': 'role'},
            ExpressionAttributeValues={':admin': 'admin'}
        )
        items = resp.get('Items', [])
        while 'LastEvaluatedKey' in resp:
            resp = connections_table.scan(
                FilterExpression='#r = :admin',
                ExpressionAttributeNames={'#r': 'role'},
                ExpressionAttributeValues={':admin': 'admin'},
                ExclusiveStartKey=resp['LastEvaluatedKey']
            )
            items.extend(resp.get('Items', []))
        return items
    except Exception as e:
        print(f"❌ Lỗi lấy danh sách connections: {e}")
        return []


def broadcast_to_admins(payload_dict):
    """Gửi message JSON tới tất cả admin connections.
    Tự động xoá connectionId lỗi (đã disconnect nhưng chưa kịp xoá).
    """
    if not WS_API_ENDPOINT:
        print("⚠️ WS_API_ENDPOINT chưa được cấu hình — bỏ qua broadcast")
        return

    connections = get_all_admin_connections()
    if not connections:
        print("ℹ️ Không có admin nào đang kết nối")
        return

    apigw = boto3.client(
        'apigatewaymanagementapi',
        endpoint_url=WS_API_ENDPOINT
    )
    message_bytes = json.dumps(payload_dict, cls=DecimalEncoder, ensure_ascii=False).encode('utf-8')
    stale_connections = []

    for conn in connections:
        connection_id = conn.get('connectionId')
        if not connection_id:
            continue
        try:
            apigw.post_to_connection(
                ConnectionId=connection_id,
                Data=message_bytes
            )
            print(f"✅ Gửi tới {connection_id}")
        except apigw.exceptions.GoneException:
            print(f"⚠️ Connection {connection_id} đã hết hạn — đánh dấu để xoá")
            stale_connections.append(connection_id)
        except Exception as e:
            print(f"⚠️ Lỗi gửi tới {connection_id}: {e}")

    # Dọn dẹp stale connections
    for connection_id in stale_connections:
        try:
            connections_table.delete_item(Key={'connectionId': connection_id})
            print(f"🗑️ Đã xoá stale connection: {connection_id}")
        except Exception as e:
            print(f"❌ Lỗi xoá stale connection {connection_id}: {e}")


def lambda_handler(event, context):
    for record in event.get('Records', []):
        event_name = record.get('eventName', '')  # INSERT | MODIFY | REMOVE
        ddb = record.get('dynamodb', {})
        new_image = unmarshal_image(ddb.get('NewImage', {}))
        old_image = unmarshal_image(ddb.get('OldImage', {}))

        status = new_image.get('status', '')
        application_id = new_image.get('applicationId', '')

        if event_name == 'INSERT' and status == 'pending_change':
            # Yêu cầu huỷ ca mới
            cr = new_image.get('changeRequest') or {}
            if isinstance(cr, str):
                try:
                    cr = json.loads(cr)
                except Exception:
                    cr = {}

            payload = {
                'type': 'NEW_REQUEST',
                'data': {
                    'applicationId': application_id,
                    'jobId': new_image.get('jobId', ''),
                    'candidateId': new_image.get('candidateId', ''),
                    'candidateName': new_image.get('candidateName', ''),
                    'employerId': new_image.get('employerId', ''),
                    'employerName': new_image.get('employerName', '') or new_image.get('companyName', ''),
                    'jobTitle': new_image.get('jobTitle', '') or new_image.get('_jobTitle', ''),
                    'jobLocation': new_image.get('jobLocation', '') or new_image.get('_jobLocation', ''),
                    'status': status,
                    'changeRequest': cr,
                    'reasonType': cr.get('reasonType', '') if isinstance(cr, dict) else '',
                    'reasonDetail': (cr.get('reasonDetail') or cr.get('reason', '')) if isinstance(cr, dict) else '',
                    'createdAt': new_image.get('createdAt', ''),
                    'updatedAt': new_image.get('updatedAt', ''),
                }
            }
            print(f"📢 Broadcast NEW_REQUEST: applicationId={application_id}")
            broadcast_to_admins(payload)

        elif event_name == 'MODIFY':
            old_status = old_image.get('status', '')
            new_status = status
            old_cr_status = old_image.get('changeRequestStatus', '')
            new_cr_status = new_image.get('changeRequestStatus', '')

            # Phát sự kiện khi status hoặc changeRequestStatus thay đổi
            if old_status != new_status or old_cr_status != new_cr_status:
                payload = {
                    'type': 'REQUEST_UPDATED',
                    'data': {
                        'applicationId': application_id,
                        'jobId': new_image.get('jobId', ''),
                        'candidateId': new_image.get('candidateId', ''),
                        'status': new_status,
                        'changeRequestStatus': new_cr_status,
                        'updatedAt': new_image.get('updatedAt', ''),
                    }
                }
                print(f"📢 Broadcast REQUEST_UPDATED: applicationId={application_id}, status={new_status}, crStatus={new_cr_status}")
                broadcast_to_admins(payload)

    return {'statusCode': 200, 'body': 'OK'}
