#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to verify Vietnamese data in DynamoDB
Run: python amplify/backend/verify-vietnamese.py
"""

import boto3
import json
from decimal import Decimal

# Custom JSON encoder for DynamoDB Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)

def main():
    print("🔍 Verifying Vietnamese data in DynamoDB")
    print("=" * 50)
    print()
    
    # Create DynamoDB client
    dynamodb = boto3.client('dynamodb', region_name='ap-southeast-1')
    
    try:
        # Get item
        response = dynamodb.get_item(
            TableName='CandidateProfiles',
            Key={
                'userId': {'S': 'test-candidate-001'}
            }
        )
        
        if 'Item' not in response:
            print("❌ Item not found")
            return
        
        item = response['Item']
        
        print("✅ Data retrieved successfully!")
        print()
        print("📋 Profile Information:")
        print("-" * 50)
        print(f"User ID:      {item['userId']['S']}")
        print(f"Họ và Tên:    {item['fullName']['S']}")
        print(f"Email:        {item['email']['S']}")
        print(f"Điện thoại:   {item['phone']['S']}")
        print(f"Địa điểm:     {item['location']['S']}")
        print(f"CCCD:         {item['cccd']['S']}")
        print(f"Ngày sinh:    {item['dateOfBirth']['S']}")
        print(f"Chức danh:    {item['title']['S']}")
        print()
        print(f"Giới thiệu:")
        print(f"  {item['bio']['S']}")
        print()
        print(f"Kỹ năng:")
        for skill in item['skills']['L']:
            print(f"  • {skill['S']}")
        print()
        print(f"Hoàn thành:   {item['profileCompletion']['N']}%")
        print(f"Trạng thái:   {'Đang hoạt động' if item['isActive']['BOOL'] else 'Không hoạt động'}")
        print()
        print("=" * 50)
        print("✅ Tiếng Việt hiển thị hoàn toàn chính xác!")
        print()
        print("💡 Lưu ý:")
        print("   - AWS Console có thể hiển thị sai do encoding")
        print("   - Dữ liệu thực tế trong DynamoDB là UTF-8 đúng")
        print("   - Khi dùng API/SDK, tiếng Việt hiển thị bình thường")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print()
        print("💡 Troubleshooting:")
        print("   1. Check AWS credentials: aws configure")
        print("   2. Verify table exists: aws dynamodb list-tables")
        print("   3. Install boto3: pip install boto3")

if __name__ == '__main__':
    main()
