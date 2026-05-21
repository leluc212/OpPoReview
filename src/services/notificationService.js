// Notification Service for Package Subscriptions

const API_ENDPOINT = import.meta.env.VITE_NOTIFICATIONS_API;
const USE_API = true; // API is now working!
const NOTIFICATIONS_KEY = 'app_notifications';

// Debug: Log API endpoint on module load
console.log('🔧 notificationService.js loaded');
console.log('🔧 API_ENDPOINT:', API_ENDPOINT);
console.log('🔧 import.meta.env:', import.meta.env);

// ===== LocalStorage Functions (Fallback) =====

const getFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return [];
  }
};

const saveToLocalStorage = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// ===== API Functions =====

/**
 * Get all notifications from API
 */
export const getAllNotifications = async () => {
  if (!USE_API) {
    return getFromLocalStorage();
  }
  
  try {
    const response = await fetch(`${API_ENDPOINT}/notifications`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error getting notifications from API, using localStorage:', error);
    return getFromLocalStorage();
  }
};

/**
 * Get notifications for a specific user
 * @param {string} userId - User ID
 * @param {string} role - 'admin' or 'employer'
 */
export const getNotifications = async (userId, role) => {
  if (!USE_API) {
    const allNotifications = getFromLocalStorage();
    return allNotifications.filter(n => {
      if (role === 'admin') {
        return (n.recipientId === 'admin' || n.recipientId === userId) && n.recipientRole === 'admin' && !n.deleted;
      }
      return n.recipientId === userId && n.recipientRole === role && !n.deleted;
    });
  }
  
  try {
    const response = await fetch(`${API_ENDPOINT}/notifications?recipientId=${userId}&recipientRole=${role}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error getting notifications from API, using localStorage:', error);
    const allNotifications = getFromLocalStorage();
    return allNotifications.filter(n => {
      if (role === 'admin') {
        return (n.recipientId === 'admin' || n.recipientId === userId) && n.recipientRole === 'admin' && !n.deleted;
      }
      return n.recipientId === userId && n.recipientRole === role && !n.deleted;
    });
  }
};

/**
 * Get unread count for a user
 */
export const getUnreadCount = async (userId, role) => {
  try {
    const notifications = await getNotifications(userId, role);
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Create notification when employer requests package purchase
 * @param {object} subscription - Subscription data
 */
export const createPackagePurchaseRequestNotification = async (subscription) => {
  console.log('📝 Creating package purchase notification with data:', subscription);
  
  const notification = {
    type: 'package_purchase_request',
    title: 'Yêu cầu mua gói dịch vụ mới',
    titleEn: 'New Package Purchase Request',
    message: `${subscription.companyName} yêu cầu mua gói ${subscription.packageName} (${subscription.duration}) - Giá: ${subscription.price.toLocaleString('vi-VN')} VND`,
    messageEn: `${subscription.companyName} requested to purchase ${subscription.packageName} package (${subscription.duration}) - Price: ${subscription.price.toLocaleString('vi-VN')} VND`,
    recipientId: 'admin',
    recipientRole: 'admin',
    senderId: subscription.employerId,
    senderName: subscription.companyName,
    data: {
      subscriptionId: subscription.subscriptionId,
      packageName: subscription.packageName,
      duration: subscription.duration,
      price: subscription.price,
      employerId: subscription.employerId,
      companyName: subscription.companyName
    },
    icon: 'package',
    color: '#3b82f6',
    actionUrl: '/admin/packages',
    actionText: 'Xem chi tiết',
    actionTextEn: 'View Details'
  };

  console.log('📤 Sending notification to API with UTF-8 encoding:');
  console.log('   API Endpoint:', API_ENDPOINT);
  console.log('   Notification data:', JSON.stringify(notification, null, 2));
  console.log('   ⚠️ CRITICAL: recipientId =', notification.recipientId, '(must be "admin")');
  console.log('   ⚠️ CRITICAL: recipientRole =', notification.recipientRole, '(must be "admin")');
  
  const result = await saveNotification(notification);
  console.log('✅ Notification API response:', result);
  
  // Verify notification was created
  if (result && result.success) {
    console.log('✅ Notification created successfully with ID:', result.data?.notificationId);
  } else {
    console.error('❌ Notification creation may have failed:', result);
  }
  
  return result;
};

/**
 * Create notification when admin approves package
 * @param {object} subscription - Subscription data
 * @param {string} employerId - Employer ID
 */
export const createPackageApprovedNotification = async (subscription, employerId) => {
  console.log('📝 Creating package approved notification');
  console.log('   Subscription data:', subscription);
  console.log('   Employer ID:', employerId);
  console.log('   Employer ID type:', typeof employerId);
  
  if (!employerId) {
    const error = new Error('❌ CRITICAL: employerId is required but was not provided!');
    console.error(error);
    throw error;
  }
  
  const notification = {
    type: 'package_approved',
    title: 'Gói dịch vụ đã được kích hoạt',
    titleEn: 'Package Activated',
    message: `Gói ${subscription.packageName} (${subscription.duration}) của bạn đã được admin phê duyệt và kích hoạt thành công!`,
    messageEn: `Your ${subscription.packageName} package (${subscription.duration}) has been approved and activated!`,
    recipientId: employerId,
    recipientRole: 'employer',
    senderId: 'admin',
    senderName: 'Admin',
    data: {
      subscriptionId: subscription.subscriptionId,
      packageName: subscription.packageName,
      duration: subscription.duration,
      expiryDate: subscription.expiryDate
    },
    icon: 'check-circle',
    color: '#10b981',
    actionUrl: '/employer/subscription',
    actionText: 'Xem gói của tôi',
    actionTextEn: 'View My Packages'
  };

  console.log('📤 Sending package approved notification to API:');
  console.log('   API Endpoint:', API_ENDPOINT);
  console.log('   Notification data:', JSON.stringify(notification, null, 2));
  console.log('   ⚠️ CRITICAL: recipientId =', notification.recipientId, '(must be employerId)');
  console.log('   ⚠️ CRITICAL: recipientRole =', notification.recipientRole, '(must be "employer")');
  
  const result = await saveNotification(notification);
  console.log('✅ Package approved notification API response:', result);
  
  // Verify notification was created
  if (result && result.success) {
    console.log('✅ Package approved notification created successfully with ID:', result.data?.notificationId);
    console.log('✅ Employer will see this notification in their navbar');
  } else {
    console.error('❌ Package approved notification creation may have failed:', result);
  }
  
  return result;
};

/**
 * Save notification to API
 */
const saveNotification = async (notification) => {
  try {
    console.log('💾 Saving notification to API...');
    console.log('API Endpoint:', API_ENDPOINT);
    console.log('API Endpoint type:', typeof API_ENDPOINT);
    console.log('API Endpoint value:', API_ENDPOINT ? 'EXISTS' : 'UNDEFINED');
    
    if (!API_ENDPOINT) {
      const error = new Error('❌ CRITICAL: API_ENDPOINT is undefined! Check .env file.');
      console.error(error);
      throw error;
    }
    
    // Ensure all string fields are properly encoded
    const notificationToSend = {
      ...notification,
      title: notification.title || '',
      titleEn: notification.titleEn || notification.title || '',
      message: notification.message || '',
      messageEn: notification.messageEn || notification.message || '',
      recipientId: notification.recipientId || '',
      recipientRole: notification.recipientRole || '',
      senderId: notification.senderId || 'system',
      senderName: notification.senderName || 'System',
      icon: notification.icon || 'bell',
      color: notification.color || '#3b82f6',
      actionUrl: notification.actionUrl || '',
      actionText: notification.actionText || '',
      actionTextEn: notification.actionTextEn || ''
    };
    
    console.log('Notification object to send:', notificationToSend);
    console.log('Stringifying notification with UTF-8...');
    const notificationJson = JSON.stringify(notificationToSend);
    console.log('Notification JSON length:', notificationJson.length, 'bytes');
    console.log('Notification JSON preview:', notificationJson.substring(0, 200) + '...');
    
    const url = `${API_ENDPOINT}/notifications`;
    console.log('🌐 Full URL:', url);
    console.log('📤 Making POST request with UTF-8 encoding...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      body: notificationJson
    });
    
    console.log('✅ Response received!');
    console.log('API Response status:', response.status);
    console.log('API Response statusText:', response.statusText);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('API Response text length:', responseText.length);
    console.log('API Response text:', responseText);
    
    if (!response.ok) {
      const errorMsg = `Failed to save notification: ${response.status} ${response.statusText} - ${responseText}`;
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError);
      console.error('Response text was:', responseText);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
    
    console.log('✅ Notification saved successfully!');
    console.log('Response data:', data);
    
    if (data.success && data.data) {
      console.log('✅ Notification ID:', data.data.notificationId);
      console.log('✅ Recipient:', data.data.recipientId, '/', data.data.recipientRole);
      console.log('✅ Title:', data.data.title);
      console.log('✅ Message:', data.data.message);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error saving notification:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Re-throw to let caller handle it
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/notifications/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ read: true })
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId, role) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipientId: userId, recipientRole: role })
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark all as read');
    }
    
    return true;
  } catch (error) {
    console.error('Error marking all as read:', error);
    return false;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/notifications/${notificationId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Clear all notifications for a user
 */
export const clearAllNotifications = async (userId, role) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/notifications/clear-all`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipientId: userId, recipientRole: role })
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear notifications');
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
};

export default {
  getAllNotifications,
  getNotifications,
  getUnreadCount,
  createPackagePurchaseRequestNotification,
  createPackageApprovedNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
};
