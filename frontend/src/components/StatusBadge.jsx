import React from 'react';

export default function StatusBadge({ status }) {
  const getBadgeClass = (s) => {
    switch (s) {
      case 'Completed':
        return 'badge-status-completed';
      case 'In Progress':
        return 'badge-status-inprogress';
      case 'Pending':
      default:
        return 'badge-status-pending';
    }
  };

  const getIcon = (s) => {
    switch (s) {
      case 'Completed':
        return '✓';
      case 'In Progress':
        return '⚡';
      case 'Pending':
      default:
        return '⏳';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      <span className="badge-icon">{getIcon(status)}</span>
      <span>{status || 'Pending'}</span>
    </span>
  );
}
