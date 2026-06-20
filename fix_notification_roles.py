"""
Fix notifications with uppercase recipientRole (e.g. 'CANDIDATE' -> 'candidate', 'EMPLOYER' -> 'employer')
DynamoDB GSI keys are case-sensitive, so we need consistent lowercase values.
"""
import boto3

REGION = 'ap-southeast-1'
TABLE_NAME = 'Notifications'

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

print("=== Fixing uppercase recipientRole values ===\n")

# Scan all items
items = []
last_key = None
while True:
    scan_kwargs = {}
    if last_key:
        scan_kwargs['ExclusiveStartKey'] = last_key
    response = table.scan(**scan_kwargs)
    items.extend(response.get('Items', []))
    last_key = response.get('LastEvaluatedKey')
    if not last_key:
        break

print(f"Total items scanned: {len(items)}")

# Find items with uppercase recipientRole
to_fix = [item for item in items if item.get('recipientRole', '') != item.get('recipientRole', '').lower()]

print(f"Items with uppercase recipientRole: {len(to_fix)}")

for item in to_fix:
    old_role = item['recipientRole']
    new_role = old_role.lower()
    notif_id = item['notificationId']
    print(f"  Fixing {notif_id}: '{old_role}' -> '{new_role}' | title: {item.get('title', '')[:50]}")
    
    table.update_item(
        Key={'notificationId': notif_id},
        UpdateExpression='SET recipientRole = :role',
        ExpressionAttributeValues={':role': new_role}
    )

print(f"\n✅ Fixed {len(to_fix)} items")
