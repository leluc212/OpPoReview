#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import boto3
import sys

# Set UTF-8 encoding for output
sys.stdout.reconfigure(encoding='utf-8')

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-1')
table = dynamodb.Table('Notifications')

print("=== DELETE OLD NOTIFICATIONS ===\n")

# Scan all notifications
print("Scanning Notifications table...")
response = table.scan()
items = response.get('Items', [])

print(f"Found {len(items)} notifications\n")

if len(items) == 0:
    print("No notifications to delete")
    sys.exit(0)

# Delete each notification
print("Deleting notifications...")
deleted = 0

for item in items:
    notif_id = item.get('notificationId')
    try:
        table.delete_item(Key={'notificationId': notif_id})
        deleted += 1
        print(f"  ✅ Deleted: {notif_id}")
    except Exception as e:
        print(f"  ❌ Failed to delete {notif_id}: {e}")

print(f"\n=== DONE ===")
print(f"Deleted {deleted} out of {len(items)} notifications")
print("\nNext steps:")
print("1. Employer mua gói mới → Tạo notification với UTF-8 đúng")
print("2. Admin duyệt gói → Tạo notification với UTF-8 đúng")
print("3. Kiểm tra Navbar bell → Xem notifications hiển thị đúng")
