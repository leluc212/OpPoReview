"""
Backfill notifications for candidates based on existing applications.
Creates notifications for:
- Application submitted successfully
- CV accepted by employer
- CV rejected by employer

Run with: python backfill-candidate-notifications.py
Requires: boto3, AWS credentials configured
"""

import boto3
import json
import uuid
from datetime import datetime, timezone

REGION = 'ap-southeast-1'

dynamodb = boto3.resource('dynamodb', region_name=REGION)
applications_table = dynamodb.Table('StandardApplications')
notifications_table = dynamodb.Table('Notifications')

def scan_all_applications():
    """Scan all applications from DynamoDB with pagination"""
    items = []
    last_key = None
    
    while True:
        scan_kwargs = {}
        if last_key:
            scan_kwargs['ExclusiveStartKey'] = last_key
        
        response = applications_table.scan(**scan_kwargs)
        items.extend(response.get('Items', []))
        
        last_key = response.get('LastEvaluatedKey')
        if not last_key:
            break
    
    return items

def create_notification(notification):
    """Create a notification in DynamoDB"""
    notification_id = f"NOTIF-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:8]}"
    
    item = {
        'notificationId': notification_id,
        'type': notification['type'],
        'title': notification['title'],
        'titleEn': notification.get('titleEn', notification['title']),
        'message': notification['message'],
        'messageEn': notification.get('messageEn', notification['message']),
        'recipientId': notification['recipientId'],
        'recipientRole': notification['recipientRole'],
        'senderId': notification.get('senderId', 'system'),
        'senderName': notification.get('senderName', 'Ốp Pờ'),
        'data': notification.get('data', {}),
        'icon': notification.get('icon', 'bell'),
        'color': notification.get('color', '#3b82f6'),
        'actionUrl': notification.get('actionUrl', ''),
        'actionText': notification.get('actionText', ''),
        'actionTextEn': notification.get('actionTextEn', ''),
        'read': True,  # Mark as read since these are old
        'deleted': False,
        'createdAt': notification['createdAt']
    }
    
    notifications_table.put_item(Item=item)
    return notification_id

def backfill():
    print("=" * 60)
    print("BACKFILL CANDIDATE NOTIFICATIONS")
    print("=" * 60)
    
    # Get all applications
    print("\n[1/3] Scanning all applications...")
    applications = scan_all_applications()
    print(f"  Found {len(applications)} applications total")
    
    # Group by candidate
    candidate_apps = {}
    for app in applications:
        candidate_id = app.get('candidateId')
        if not candidate_id or candidate_id == 'anonymous':
            continue
        if candidate_id not in candidate_apps:
            candidate_apps[candidate_id] = []
        candidate_apps[candidate_id].append(app)
    
    print(f"  Found {len(candidate_apps)} unique candidates")
    
    # Create notifications
    print("\n[2/3] Creating notifications...")
    created_count = 0
    skipped_count = 0
    
    for candidate_id, apps in candidate_apps.items():
        for app in apps:
            status = app.get('status', 'pending')
            job_title = app.get('jobTitle', 'Công việc')
            company_name = app.get('employerName', app.get('companyName', 'Nhà tuyển dụng'))
            job_id = app.get('jobId')
            job_type = app.get('jobType', 'standard')
            is_quick_job = job_type == 'quick'
            created_at = app.get('createdAt', app.get('appliedAt', datetime.now(timezone.utc).isoformat()))
            
            # 1. Application submitted notification
            try:
                create_notification({
                    'type': 'system',
                    'title': 'Ứng tuyển thành công',
                    'titleEn': 'Application submitted successfully',
                    'message': f'Bạn đã ứng tuyển thành công vào vị trí {job_title} tại {company_name}. Nhà tuyển dụng sẽ xem xét hồ sơ của bạn sớm nhất có thể.',
                    'messageEn': f'You have successfully applied for the {job_title} position at {company_name}. The employer will review your profile as soon as possible.',
                    'recipientId': candidate_id,
                    'recipientRole': 'candidate',
                    'senderId': 'system',
                    'senderName': 'Ốp Pờ',
                    'data': {
                        'jobId': job_id,
                        'jobTitle': job_title,
                        'companyName': company_name,
                        'isQuickJob': is_quick_job
                    },
                    'icon': 'briefcase',
                    'color': '#3b82f6',
                    'actionUrl': '/candidate/jobs?tab=shift' if is_quick_job else '/candidate/jobs?tab=standard',
                    'actionText': 'Xem việc đã ứng tuyển',
                    'actionTextEn': 'View applied jobs',
                    'createdAt': created_at
                })
                created_count += 1
            except Exception as e:
                print(f"  ❌ Error creating submitted notification: {e}")
                skipped_count += 1
            
            # 2. If accepted - create acceptance notification
            if status == 'accepted':
                accepted_at = app.get('acceptedAt', app.get('updatedAt', created_at))
                try:
                    create_notification({
                        'type': 'success',
                        'title': 'CV của bạn đã được chấp nhận',
                        'titleEn': 'Your CV has been accepted',
                        'message': f'CV của bạn đã được {company_name} chấp nhận cho vị trí {job_title}. Bạn có thể nhắn tin cho Nhà tuyển dụng ngay ở phần bong bóng chat bên phải dưới màn hình.',
                        'messageEn': f'Your CV was accepted by {company_name} for the {job_title} position. You can message the employer using the chat bubble at the bottom right of the screen.',
                        'recipientId': candidate_id,
                        'recipientRole': 'candidate',
                        'senderId': app.get('employerId', 'employer'),
                        'senderName': company_name,
                        'data': {
                            'jobId': job_id,
                            'jobTitle': job_title,
                            'companyName': company_name,
                            'isQuickJob': is_quick_job
                        },
                        'icon': 'check-circle',
                        'color': '#10b981',
                        'actionUrl': '/candidate/jobs?tab=shift' if is_quick_job else '/candidate/jobs?tab=standard',
                        'actionText': 'Xem việc làm',
                        'actionTextEn': 'View jobs',
                        'createdAt': accepted_at
                    })
                    created_count += 1
                except Exception as e:
                    print(f"  ❌ Error creating accepted notification: {e}")
                    skipped_count += 1
            
            # 3. If rejected - create rejection notification
            elif status == 'rejected':
                rejected_at = app.get('rejectedAt', app.get('updatedAt', created_at))
                try:
                    create_notification({
                        'type': 'system',
                        'title': 'CV của bạn chưa được chấp nhận',
                        'titleEn': 'Your CV was not accepted',
                        'message': f'CV của bạn cho vị trí {job_title} tại {company_name} chưa được chấp nhận. Bạn có thể cập nhật hồ sơ và tiếp tục ứng tuyển các công việc phù hợp khác.',
                        'messageEn': f'Your CV for the {job_title} position at {company_name} was not accepted. You can update your profile and apply for other suitable jobs.',
                        'recipientId': candidate_id,
                        'recipientRole': 'candidate',
                        'senderId': app.get('employerId', 'employer'),
                        'senderName': company_name,
                        'data': {
                            'jobId': job_id,
                            'jobTitle': job_title,
                            'companyName': company_name,
                            'isQuickJob': is_quick_job
                        },
                        'icon': 'alert-circle',
                        'color': '#ef4444',
                        'actionUrl': '/candidate/jobs?tab=shift' if is_quick_job else '/candidate/jobs?tab=standard',
                        'actionText': 'Xem việc làm khác',
                        'actionTextEn': 'Browse other jobs',
                        'createdAt': rejected_at
                    })
                    created_count += 1
                except Exception as e:
                    print(f"  ❌ Error creating rejected notification: {e}")
                    skipped_count += 1
            
            # 4. If completed - create completion notification
            elif status == 'completed':
                completed_at = app.get('completedAt', app.get('updatedAt', created_at))
                try:
                    create_notification({
                        'type': 'success',
                        'title': 'Công việc đã hoàn thành',
                        'titleEn': 'Job completed',
                        'message': f'Bạn đã hoàn thành công việc {job_title} tại {company_name}. Cảm ơn bạn đã tham gia!',
                        'messageEn': f'You have completed the {job_title} job at {company_name}. Thank you for participating!',
                        'recipientId': candidate_id,
                        'recipientRole': 'candidate',
                        'senderId': app.get('employerId', 'employer'),
                        'senderName': company_name,
                        'data': {
                            'jobId': job_id,
                            'jobTitle': job_title,
                            'companyName': company_name,
                            'isQuickJob': is_quick_job
                        },
                        'icon': 'check-circle',
                        'color': '#10b981',
                        'actionUrl': '/candidate/jobs?tab=shift' if is_quick_job else '/candidate/jobs?tab=standard',
                        'actionText': 'Xem lịch sử',
                        'actionTextEn': 'View history',
                        'createdAt': completed_at
                    })
                    created_count += 1
                except Exception as e:
                    print(f"  ❌ Error creating completed notification: {e}")
                    skipped_count += 1
    
    print(f"\n[3/3] Summary:")
    print(f"  ✅ Created: {created_count} notifications")
    print(f"  ⚠️  Skipped: {skipped_count} notifications")
    print(f"\n{'=' * 60}")
    print("BACKFILL COMPLETE!")
    print("=" * 60)

if __name__ == '__main__':
    backfill()
