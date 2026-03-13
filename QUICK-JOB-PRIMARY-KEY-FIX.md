# Quick Job Primary Key Fix

## Vấn đề

Khi ứng viên nhấn "Gửi CV ngay" cho Quick Job, gặp lỗi:
```
POST https://l1636ie205.execute-api.ap-southeast-1.amazonaws.com/applications
500 (Internal Server Error)

ValidationException: The provided key element does not match the schema
```

## Nguyên nhân

**PostQuickJob table sử dụng `jobID` (chữ D viết hoa) làm primary key, không phải `idJob`!**

```bash
aws dynamodb describe-table --table-name PostQuickJob --region ap-southeast-1 --query "Table.KeySchema"

[
    {
        "AttributeName": "jobID",  ← Chữ D viết HOA
        "KeyType": "HASH"
    }
]
```

Trong khi đó, `application-lambda.py` đang dùng sai key:

```python
# SAI ❌
quick_jobs_table.get_item(Key={'idJob': job_id})
quick_jobs_table.update_item(Key={'idJob': job_id}, ...)

# ĐÚNG ✅
quick_jobs_table.get_item(Key={'jobID': job_id})
quick_jobs_table.update_item(Key={'jobID': job_id}, ...)
```

## Giải pháp

### 1. Sửa `application-lambda.py`

**Dòng 181-189: Get Quick Job details**
```python
# Try quick jobs if not found
if not job:
    try:
        # PostQuickJob uses 'jobID' as primary key (capital D)
        response = quick_jobs_table.get_item(Key={'jobID': job_id})
        if 'Item' in response:
            job = response['Item']
            employer_id = job.get('employerId')
            employer_email = job.get('employerEmail')
            job_title = job.get('title')
            job_type = 'quick'
    except Exception as e:
        print(f"Not found in PostQuickJob: {e}")
```

**Dòng 227-244: Update applicants count**
```python
# Update job applicants count
if job_type == 'standard':
    jobs_table.update_item(
        Key={'idJob': job_id},
        UpdateExpression='SET applicants = if_not_exists(applicants, :zero) + :inc, updatedAt = :now',
        ExpressionAttributeValues={
            ':inc': 1,
            ':zero': 0,
            ':now': datetime.now().isoformat()
        }
    )
elif job_type == 'quick':
    # PostQuickJob uses 'jobID' as primary key (capital D)
    quick_jobs_table.update_item(
        Key={'jobID': job_id},
        UpdateExpression='SET applicants = if_not_exists(applicants, :zero) + :inc, updatedAt = :now',
        ExpressionAttributeValues={
            ':inc': 1,
            ':zero': 0,
            ':now': datetime.now().isoformat()
        }
    )
```

**Dòng 307-313: Get job for authorization check**
```python
if not job:
    try:
        # PostQuickJob uses 'jobID' as primary key (capital D)
        response = quick_jobs_table.get_item(Key={'jobID': job_id})
        if 'Item' in response:
            job = response['Item']
    except:
        pass
```

### 2. Deploy Lambda

```powershell
cd amplify/backend
Compress-Archive -Path application-lambda.py -DestinationPath application-lambda.zip -Force
aws lambda update-function-code --function-name ApplicationLambda --zip-file fileb://application-lambda.zip --region ap-southeast-1
```

## So sánh Primary Keys

| Table | Primary Key | Note |
|-------|-------------|------|
| PostStandardJob | `idJob` | Chữ d thường |
| PostQuickJob | `jobID` | Chữ D HOA |
| StandardApplications | `applicationId` | Chữ I HOA |

## Testing

### 1. Test Quick Job Application

```bash
# 1. Ứng viên apply Quick Job
# 2. Check CloudWatch Logs
aws logs tail /aws/lambda/ApplicationLambda --follow --region ap-southeast-1

# 3. Verify application created
aws dynamodb scan --table-name StandardApplications \
  --filter-expression "jobType = :type" \
  --expression-attribute-values '{":type":{"S":"quick"}}' \
  --region ap-southeast-1

# 4. Verify applicants count updated
aws dynamodb get-item --table-name PostQuickJob \
  --key '{"jobID":{"S":"QJOB-20260313-XXXXX"}}' \
  --region ap-southeast-1
```

### 2. Expected Results

✅ Application created successfully
✅ `jobType: 'quick'` in StandardApplications
✅ `applicants` count increased in PostQuickJob
✅ No ValidationException errors

## Lưu ý

### Tại sao có sự khác biệt này?

- `PostStandardJob` được tạo trước, dùng naming convention `idJob`
- `PostQuickJob` được tạo sau, có thể do typo hoặc convention khác → dùng `jobID`
- Cần thống nhất naming convention trong tương lai

### Cách tránh lỗi tương tự

1. **Document schema**: Ghi rõ primary key trong DYNAMODB-SCHEMA.md
2. **Use constants**: Định nghĩa key names trong constants
3. **Type checking**: Sử dụng TypeScript hoặc Pydantic
4. **Integration tests**: Test với real DynamoDB tables

## Tài liệu liên quan

- [APPLICATION-SYSTEM-SETUP.md](./APPLICATION-SYSTEM-SETUP.md)
- [QUICK-JOB-APPLICATION-COMPLETE.md](./QUICK-JOB-APPLICATION-COMPLETE.md)
- [DYNAMODB-SCHEMA.md](./DYNAMODB-SCHEMA.md)

## Summary

✅ Fixed primary key mismatch: `idJob` → `jobID`
✅ Updated 3 locations in application-lambda.py
✅ Deployed Lambda function
✅ Quick Job applications now work correctly

Vấn đề đã được giải quyết! 🎉
