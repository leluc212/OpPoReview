import { useState, useEffect } from 'react';

/**
 * Custom hook to display relative time that auto-updates
 * @param {string} timestamp - ISO timestamp string
 * @param {string} language - 'vi' or 'en'
 * @returns {string} Formatted relative time string
 */
export const useRelativeTime = (timestamp, language = 'vi') => {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    if (!timestamp) {
      setRelativeTime('');
      return;
    }

    const updateRelativeTime = () => {
      const now = new Date();
      const created = new Date(timestamp);
      const diffMs = now - created;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffWeeks = Math.floor(diffMs / 604800000);
      const diffMonths = Math.floor(diffMs / 2592000000);
      const diffYears = Math.floor(diffMs / 31536000000);

      let formatted = '';

      if (diffSeconds < 10) {
        formatted = language === 'vi' ? 'Vừa xong' : 'Just now';
      } else if (diffSeconds < 60) {
        formatted = language === 'vi' ? `${diffSeconds} giây trước` : `${diffSeconds} seconds ago`;
      } else if (diffMins < 60) {
        formatted = language === 'vi' ? `${diffMins} phút trước` : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        formatted = language === 'vi' ? `${diffHours} giờ trước` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        formatted = language === 'vi' ? `${diffDays} ngày trước` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffWeeks < 4) {
        formatted = language === 'vi' ? `${diffWeeks} tuần trước` : `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
      } else if (diffMonths < 12) {
        formatted = language === 'vi' ? `${diffMonths} tháng trước` : `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
      } else {
        formatted = language === 'vi' ? `${diffYears} năm trước` : `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
      }

      setRelativeTime(formatted);
    };

    // Update immediately
    updateRelativeTime();

    // Determine update interval based on how old the timestamp is
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);

    let interval;
    if (diffMins < 1) {
      // Update every 5 seconds for very recent notifications
      interval = setInterval(updateRelativeTime, 5000);
    } else if (diffMins < 60) {
      // Update every 30 seconds for notifications less than 1 hour old
      interval = setInterval(updateRelativeTime, 30000);
    } else {
      // Update every minute for older notifications
      interval = setInterval(updateRelativeTime, 60000);
    }

    return () => clearInterval(interval);
  }, [timestamp, language]);

  return relativeTime;
};

/**
 * Format a timestamp to relative time (one-time, no auto-update)
 * @param {string} timestamp - ISO timestamp string
 * @param {string} language - 'vi' or 'en'
 * @returns {string} Formatted relative time string
 */
export const formatRelativeTime = (timestamp, language = 'vi') => {
  if (!timestamp) return '';

  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now - created;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);
  const diffYears = Math.floor(diffMs / 31536000000);

  if (diffSeconds < 10) {
    return language === 'vi' ? 'Vừa xong' : 'Just now';
  } else if (diffSeconds < 60) {
    return language === 'vi' ? `${diffSeconds} giây trước` : `${diffSeconds} seconds ago`;
  } else if (diffMins < 60) {
    return language === 'vi' ? `${diffMins} phút trước` : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return language === 'vi' ? `${diffHours} giờ trước` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return language === 'vi' ? `${diffDays} ngày trước` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffWeeks < 4) {
    return language === 'vi' ? `${diffWeeks} tuần trước` : `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  } else if (diffMonths < 12) {
    return language === 'vi' ? `${diffMonths} tháng trước` : `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else {
    return language === 'vi' ? `${diffYears} năm trước` : `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
};

export default useRelativeTime;
