// PASTE THIS INTO BROWSER CONSOLE (F12)
// This will debug the timestamp issue

(async function() {
    console.clear();
    console.log('🔍 NOTIFICATION TIMESTAMP DEBUGGER');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const API_ENDPOINT = 'https://rvvvqxqhq3.execute-api.ap-southeast-1.amazonaws.com/prod';
    
    try {
        // Fetch notifications
        console.log('📥 Fetching notifications...');
        const response = await fetch(`${API_ENDPOINT}/notifications?recipientId=admin&recipientRole=admin`);
        const notifications = await response.json();
        
        // Sort by newest first
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const latest = notifications[0];
        const createdAt = new Date(latest.createdAt);
        const now = new Date();
        const ageMs = now - createdAt;
        const ageMinutes = Math.floor(ageMs / 60000);
        const ageHours = Math.floor(ageMinutes / 60);
        
        console.log('\n📋 LATEST NOTIFICATION:');
        console.log('   ID:', latest.notificationId);
        console.log('   Title:', latest.title);
        console.log('   CreatedAt:', latest.createdAt);
        
        console.log('\n⏰ TIMESTAMP ANALYSIS:');
        console.log('   Created (UTC):', createdAt.toISOString());
        console.log('   Created (Local):', createdAt.toLocaleString('vi-VN'));
        console.log('   Now (UTC):', now.toISOString());
        console.log('   Now (Local):', now.toLocaleString('vi-VN'));
        console.log('   Age:', ageMinutes, 'minutes (', ageHours, 'hours )');
        
        console.log('\n📱 EXPECTED UI DISPLAY:');
        let expectedDisplay;
        if (ageMinutes < 1) {
            expectedDisplay = 'Vừa xong / Just now';
        } else if (ageMinutes < 60) {
            expectedDisplay = `${ageMinutes} phút trước / ${ageMinutes} minutes ago`;
        } else {
            expectedDisplay = `${ageHours} giờ trước / ${ageHours} hours ago`;
        }
        console.log('   Should show:', expectedDisplay);
        
        console.log('\n🔍 DIAGNOSIS:');
        if (ageHours >= 6) {
            console.log('%c   ❌ PROBLEM FOUND!', 'color: red; font-weight: bold');
            console.log('   Notification is', ageHours, 'hours old!');
            console.log('   This means:');
            console.log('   1. Lambda is NOT creating new timestamps, OR');
            console.log('   2. Lambda server clock is wrong, OR');
            console.log('   3. You are looking at an OLD notification');
        } else {
            console.log('%c   ✅ TIMESTAMP IS CORRECT!', 'color: green; font-weight: bold');
            console.log('   Notification is only', ageHours, 'hours old');
            console.log('   If UI shows "7 giờ trước", you are looking at a DIFFERENT notification!');
            console.log('   Find notification with ID:', latest.notificationId);
        }
        
        console.log('\n📊 ALL NOTIFICATIONS (Top 10):');
        notifications.slice(0, 10).forEach((n, i) => {
            const age = Math.floor((now - new Date(n.createdAt)) / 60000);
            console.log(`   ${i+1}. ${n.notificationId}`);
            console.log(`      Title: ${n.title}`);
            console.log(`      Age: ${age} minutes (${Math.floor(age/60)} hours)`);
        });
        
        console.log('\n═══════════════════════════════════════════════════════');
        
    } catch (error) {
        console.error('❌ ERROR:', error);
    }
})();
