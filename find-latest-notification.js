// Helper script to find the latest notification
// Paste this into browser console after creating a notification

async function findLatestNotification(recipientId, recipientRole) {
  const API_ENDPOINT = 'https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod';
  
  try {
    console.log(`🔍 Fetching notifications for ${recipientRole}: ${recipientId}...`);
    
    const response = await fetch(`${API_ENDPOINT}/notifications?recipientId=${recipientId}&recipientRole=${recipientRole}`);
    const notifications = await response.json();
    
    console.log(`📥 Found ${notifications.length} notifications`);
    
    if (notifications.length === 0) {
      console.log('❌ No notifications found!');
      return;
    }
    
    // Sort by createdAt descending (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const latest = notifications[0];
    const createdAt = new Date(latest.createdAt);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('📋 LATEST NOTIFICATION');
    console.log('═══════════════════════════════════════════════');
    console.log('ID:', latest.notificationId);
    console.log('Title:', latest.title);
    console.log('Message:', latest.message);
    console.log('');
    console.log('⏰ TIMESTAMPS:');
    console.log('Created (UTC):', latest.createdAt);
    console.log('Created (Local):', createdAt.toLocaleString('vi-VN'));
    console.log('Now (Local):', now.toLocaleString('vi-VN'));
    console.log('');
    console.log('⏱️ TIME AGO:');
    console.log(`${diffSeconds} seconds ago`);
    console.log(`${diffMinutes} minutes ago`);
    console.log(`${diffHours} hours ago`);
    console.log('');
    console.log('📱 UI SHOULD SHOW:');
    
    if (diffSeconds < 10) {
      console.log('✅ "Vừa xong" (Just now)');
    } else if (diffSeconds < 60) {
      console.log(`✅ "${diffSeconds} giây trước" (${diffSeconds} seconds ago)`);
    } else if (diffMinutes < 60) {
      console.log(`✅ "${diffMinutes} phút trước" (${diffMinutes} minutes ago)`);
    } else if (diffHours < 24) {
      console.log(`✅ "${diffHours} giờ trước" (${diffHours} hours ago)`);
    } else {
      const diffDays = Math.floor(diffMs / 86400000);
      console.log(`✅ "${diffDays} ngày trước" (${diffDays} days ago)`);
    }
    
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('💡 TIP: Look for this notification ID in the UI!');
    console.log(`   ID: ${latest.notificationId}`);
    
    return latest;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Example usage:
console.log('📝 Usage examples:');
console.log('');
console.log('// For admin notifications:');
console.log('findLatestNotification("admin", "admin");');
console.log('');
console.log('// For employer notifications (replace with your employer ID):');
console.log('findLatestNotification("YOUR_EMPLOYER_ID", "employer");');
console.log('');
console.log('// For candidate notifications (replace with your candidate ID):');
console.log('findLatestNotification("YOUR_CANDIDATE_ID", "candidate");');
