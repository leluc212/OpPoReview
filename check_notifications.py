import boto3
import json

REGION = 'ap-southeast-1'
TABLE_NAME = 'Notifications'
USER_ID = '192a75cc-30c1-70a0-cbc6-5e351462418b'

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

print(f"=== Checking notifications for user: {USER_ID} ===\n")

# 1. Query using GSI RecipientIndex with role=candidate
print("[1] Query GSI RecipientIndex (recipientId + recipientRole=candidate):")
try:
    response = table.query(
        IndexName='RecipientIndex',
        KeyConditionExpression='recipientId = :uid AND recipientRole = :role',
        ExpressionAttributeValues={
            ':uid': USER_ID,
            ':role': 'candidate'
        }
    )
    items = response.get('Items', [])
    print(f"   Found: {len(items)} notifications")
    for item in items[:5]:
        print(f"   - [{item.get('type')}] {item.get('title')} | read={item.get('read')} | deleted={item.get('deleted')} | {item.get('createdAt')}")
except Exception as e:
    print(f"   ERROR: {e}")

# 2. Scan for ANY notification with this recipientId (any role)
print(f"\n[2] Scan for ANY notification with recipientId={USER_ID} (any role):")
try:
    response = table.scan(
        FilterExpression='recipientId = :uid',
        ExpressionAttributeValues={':uid': USER_ID}
    )
    items = response.get('Items', [])
    print(f"   Found: {len(items)} notifications")
    for item in items[:5]:
        print(f"   - [{item.get('recipientRole')}] [{item.get('type')}] {item.get('title')} | deleted={item.get('deleted')}")
except Exception as e:
    print(f"   ERROR: {e}")

# 3. Check total count in table
print(f"\n[3] Total items in Notifications table:")
try:
    response = table.scan(Select='COUNT')
    print(f"   Total: {response.get('Count', 0)} items")
except Exception as e:
    print(f"   ERROR: {e}")

# 4. Show a sample of candidate notifications (any user)
print(f"\n[4] Sample candidate notifications (any user, first 5):")
try:
    response = table.scan(
        FilterExpression='recipientRole = :role',
        ExpressionAttributeValues={':role': 'candidate'},
        Limit=100
    )
    items = response.get('Items', [])
    candidate_items = items[:5]
    print(f"   Found {len(items)} candidate notifications in first scan page")
    for item in candidate_items:
        print(f"   - recipientId={item.get('recipientId')[:20]}... | [{item.get('type')}] {item.get('title')}")
except Exception as e:
    print(f"   ERROR: {e}")
