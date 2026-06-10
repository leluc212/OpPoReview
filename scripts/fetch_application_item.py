#!/usr/bin/env python3
import sys
import json
from decimal import Decimal
import boto3
from botocore.exceptions import ClientError

if len(sys.argv) < 2:
    print("Usage: fetch_application_item.py <APPLICATION_ID>")
    sys.exit(2)

application_id = sys.argv[1]
region = 'ap-southeast-1'

dynamodb = boto3.resource('dynamodb', region_name=region)
table = dynamodb.Table('StandardApplications')

try:
    resp = table.get_item(Key={'applicationId': application_id})
    item = resp.get('Item')
    if not item:
        print(f"No item found for applicationId={application_id}")
        sys.exit(0)
    def convert_decimals(obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        if isinstance(obj, list):
            return [convert_decimals(i) for i in obj]
        if isinstance(obj, dict):
            return {k: convert_decimals(v) for k, v in obj.items()}
        return obj

    safe_item = convert_decimals(item)
    print(json.dumps(safe_item, ensure_ascii=False, indent=2))
except ClientError as e:
    print('ClientError:', e.response.get('Error', {}).get('Message'))
    sys.exit(1)
except Exception as e:
    print('Error:', str(e))
    sys.exit(1)
