"""
backfill-payment-recipient.py
─────────────────────────────
Migration: Backfill paymentRecipientId cho tất cả application đã tồn tại
trước khi thêm field này.

Logic:
- Nếu application ĐÃ có paymentRecipientId → bỏ qua (không ghi đè)
- Nếu CHƯA có paymentRecipientId → set = candidateId hiện tại
- Đảm bảo tại 1 thời điểm chỉ có đúng 1 paymentRecipientId active cho mỗi job

Cách chạy (local với AWS credentials đã config):
  python backfill-payment-recipient.py

Hoặc trên Lambda (gắn vào một hàm tạm thời), chạy 1 lần rồi xoá.

Có thể set DRY_RUN = True để preview trước khi ghi thật.
"""

import boto3
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────────
TABLE_NAME = 'StandardApplications'
DRY_RUN = False          # Đặt True để xem sẽ update bao nhiêu record mà không ghi DB
REGION = 'ap-southeast-1'
# ──────────────────────────────────────────────────────────────────────────────

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)


def scan_all():
    """Quét toàn bộ bảng StandardApplications với pagination."""
    items = []
    resp = table.scan()
    items.extend(resp.get('Items', []))
    while 'LastEvaluatedKey' in resp:
        resp = table.scan(ExclusiveStartKey=resp['LastEvaluatedKey'])
        items.extend(resp.get('Items', []))
    return items


def run_backfill():
    print(f"{'[DRY RUN] ' if DRY_RUN else ''}Bắt đầu backfill paymentRecipientId — bảng: {TABLE_NAME}")
    print("─" * 60)

    all_items = scan_all()
    print(f"Tổng số records: {len(all_items)}")

    needs_backfill = [
        item for item in all_items
        if not item.get('paymentRecipientId') and item.get('candidateId')
    ]

    print(f"Cần backfill:   {len(needs_backfill)} records (chưa có paymentRecipientId)")
    already_set = len(all_items) - len(needs_backfill)
    print(f"Đã có sẵn:      {already_set} records (không cần cập nhật)")
    print("─" * 60)

    if not needs_backfill:
        print("✅ Không có gì cần backfill.")
        return

    updated = 0
    errors = 0
    now_iso = datetime.utcnow().isoformat() + 'Z'

    for item in needs_backfill:
        app_id = item.get('applicationId')
        candidate_id = item.get('candidateId')
        status = item.get('status', 'unknown')

        if not app_id or not candidate_id:
            print(f"  ⚠️  Bỏ qua record thiếu applicationId hoặc candidateId: {item}")
            continue

        print(f"  → {app_id} | status={status} | candidateId={candidate_id}")

        if DRY_RUN:
            updated += 1
            continue

        try:
            table.update_item(
                Key={'applicationId': app_id},
                UpdateExpression='SET paymentRecipientId = :pr, updatedAt = :now',
                # Chỉ update nếu field CHƯA tồn tại (double-safety)
                ConditionExpression='attribute_not_exists(paymentRecipientId)',
                ExpressionAttributeValues={
                    ':pr': candidate_id,
                    ':now': now_iso
                }
            )
            updated += 1
        except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
            # Field đã được tạo bởi một process khác chạy song song → bỏ qua
            print(f"     ℹ️  {app_id}: đã có paymentRecipientId (race condition) — bỏ qua")
        except Exception as e:
            print(f"     ❌  {app_id}: lỗi — {e}")
            errors += 1

    print("─" * 60)
    action = "Sẽ cập nhật" if DRY_RUN else "Đã cập nhật"
    print(f"{action}: {updated} records")
    if errors:
        print(f"Lỗi:      {errors} records")
    print(f"✅ Backfill hoàn tất{'  [DRY RUN — không có thay đổi thực sự]' if DRY_RUN else ''}.")


if __name__ == '__main__':
    run_backfill()
