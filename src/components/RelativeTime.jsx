import React from 'react';
import { useRelativeTime } from '../hooks/useRelativeTime';

/**
 * Component to display relative time that auto-updates
 * @param {string} timestamp - ISO timestamp string
 * @param {string} language - 'vi' or 'en'
 * @param {string} className - Optional CSS class
 * @param {object} style - Optional inline styles
 */
const RelativeTime = ({ timestamp, language = 'vi', className, style, ...props }) => {
  const relativeTime = useRelativeTime(timestamp, language);

  return (
    <span className={className} style={style} {...props} title={new Date(timestamp).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}>
      {relativeTime}
    </span>
  );
};

export default RelativeTime;
