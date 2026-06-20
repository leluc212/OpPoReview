/**
 * Backfill candidate notifications from existing applications.
 * Run with: node backfill-candidate-notifications.js
 * Requires: AWS credentials configured, aws-sdk
 */

const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { randomUUID } = require('crypto');

const REGION = 'ap-southeast-1';
const APP_TABLE = 'StandardApplications';
const NOTIF_TABLE = 'Notifications';

const client = new DynamoDBClient({ region: REGION });

async function scanAllApplications() {
  const items = [];
  let lastKey = undefined;

  do {
    const params = {
      TableName: APP_TABLE,
      ProjectionExpression: 'candidateId, #s, jobTitle, employerName, jobId, jobType, createdAt, appliedAt, acceptedAt, rejectedAt, completedAt, updatedAt, employerId',
      ExpressionAttributeNames: { '#s': 'status' }
    };
    if (lastKey) params.ExclusiveStartKey = lastKey;

    const response = await client.send(new ScanCommand(params));
    items.push(...(response.Items || []));
    lastKey = response.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

async function createNotification(notif) {
  const notifId = `NOTIF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${randomUUID().slice(0,8)}`;
  
  const item = {
    notificationId: { S: notifId },
    type: { S: notif.type },
    title: { S: notif.title },
    titleEn: { S: notif.titleEn },
    message: { S: notif.message },
    messageEn: { S: notif.messageEn },
    recipientId: { S: notif.recipientId },
    recipientRole: { S: 'candidate' },
    senderId: { S: notif.senderId || 'system' },
    senderName: { S: notif.senderName || 'Ốp Pờ' },
    data: { M: {
      jobId: { S: notif.jobId || '' },
      jobTitle: { S: notif.jobTitle || '' },
      companyName: { S: notif.companyName || '' },
      isQuickJob: { BOOL: notif.isQuickJob || false }
    }},
    icon: { S: notif.icon },
    color: { S: notif.color },
    actionUrl: { S: notif.actionUrl },
    actionText: { S: notif.actionText },
    actionTextEn: { S: notif.actionTextEn },
    read: { BOOL: true },
    deleted: { BOOL: false },
    createdAt: { S: notif.createdAt }
  };

  await client.send(new PutItemCommand({ TableName: NOTIF_TABLE, Item: item }));
}

async function main() {
  console.log('========================================');
  console.log('BACKFILL CANDIDATE NOTIFICATIONS');
  console.log('========================================\n');

  console.log('[1/3] Scanning applications...');
  const applications = await scanAllApplications();
  console.log(`  Found ${applications.length} applications\n`);

  console.log('[2/3] Creating notifications...');
  let created = 0;
  let skipped = 0;

  for (const app of applications) {
    const candidateId = app.candidateId?.S;
    if (!candidateId || candidateId === 'anonymous') {
      skipped++;
      continue;
    }

    const status = app.status?.S || 'pending';
    const jobTitle = app.jobTitle?.S || 'Công việc';
    const companyName = app.employerName?.S || 'Nhà tuyển dụng';
    const jobId = app.jobId?.S || '';
    const jobType = app.jobType?.S || 'standard';
    const isQuickJob = jobType === 'quick';
    const createdAt = app.createdAt?.S || app.appliedAt?.S || '2026-01-01T00:00:00Z';
    const employerId = app.employerId?.S || 'employer';
    const actionUrl = isQuickJob ? '/candidate/jobs?tab=shift' : '/candidate/jobs?tab=standard';

    // 1. Application submitted notification
    try {
      await createNotification({
        type: 'system',
        title: 'Ứng tuyển thành công',
        titleEn: 'Application submitted',
        message: `Bạn đã ứng tuyển thành công vào vị trí ${jobTitle} tại ${companyName}.`,
        messageEn: `You applied for ${jobTitle} at ${companyName}.`,
        recipientId: candidateId,
        senderId: 'system',
        senderName: 'Ốp Pờ',
        jobId, jobTitle, companyName, isQuickJob,
        icon: 'briefcase',
        color: '#3b82f6',
        actionUrl,
        actionText: 'Xem việc đã ứng tuyển',
        actionTextEn: 'View applied jobs',
        createdAt
      });
      created++;
    } catch (e) {
      console.error(`  ❌ Error: ${e.message}`);
    }

    // 2. Status-based notification
    if (status === 'accepted') {
      const acceptedAt = app.acceptedAt?.S || app.updatedAt?.S || createdAt;
      try {
        await createNotification({
          type: 'success',
          title: 'CV của bạn đã được chấp nhận',
          titleEn: 'Your CV has been accepted',
          message: `CV của bạn đã được ${companyName} chấp nhận cho vị trí ${jobTitle}.`,
          messageEn: `Your CV was accepted by ${companyName} for ${jobTitle}.`,
          recipientId: candidateId,
          senderId: employerId,
          senderName: companyName,
          jobId, jobTitle, companyName, isQuickJob,
          icon: 'check-circle',
          color: '#10b981',
          actionUrl,
          actionText: 'Xem việc làm',
          actionTextEn: 'View jobs',
          createdAt: acceptedAt
        });
        created++;
      } catch (e) {
        console.error(`  ❌ Error: ${e.message}`);
      }
    } else if (status === 'rejected') {
      const rejectedAt = app.rejectedAt?.S || app.updatedAt?.S || createdAt;
      try {
        await createNotification({
          type: 'system',
          title: 'CV của bạn chưa được chấp nhận',
          titleEn: 'Your CV was not accepted',
          message: `CV của bạn cho vị trí ${jobTitle} tại ${companyName} chưa được chấp nhận.`,
          messageEn: `Your CV for ${jobTitle} at ${companyName} was not accepted.`,
          recipientId: candidateId,
          senderId: employerId,
          senderName: companyName,
          jobId, jobTitle, companyName, isQuickJob,
          icon: 'alert-circle',
          color: '#ef4444',
          actionUrl,
          actionText: 'Xem việc làm khác',
          actionTextEn: 'Browse other jobs',
          createdAt: rejectedAt
        });
        created++;
      } catch (e) {
        console.error(`  ❌ Error: ${e.message}`);
      }
    } else if (status === 'completed') {
      const completedAt = app.completedAt?.S || app.updatedAt?.S || createdAt;
      try {
        await createNotification({
          type: 'success',
          title: 'Công việc đã hoàn thành',
          titleEn: 'Job completed',
          message: `Bạn đã hoàn thành công việc ${jobTitle} tại ${companyName}. Cảm ơn bạn!`,
          messageEn: `You completed ${jobTitle} at ${companyName}. Thank you!`,
          recipientId: candidateId,
          senderId: employerId,
          senderName: companyName,
          jobId, jobTitle, companyName, isQuickJob,
          icon: 'check-circle',
          color: '#10b981',
          actionUrl,
          actionText: 'Xem lịch sử',
          actionTextEn: 'View history',
          createdAt: completedAt
        });
        created++;
      } catch (e) {
        console.error(`  ❌ Error: ${e.message}`);
      }
    }

    if (created % 10 === 0 && created > 0) {
      process.stdout.write(`  ... ${created} created\r`);
    }
  }

  console.log(`\n\n[3/3] Summary:`);
  console.log(`  ✅ Created: ${created} notifications`);
  console.log(`  ⚠️  Skipped: ${skipped} (no candidateId)`);
  console.log('\n========================================');
  console.log('BACKFILL COMPLETE!');
  console.log('========================================');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
