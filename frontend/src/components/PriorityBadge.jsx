import React from 'react';

export default function PriorityBadge({ priority }) {
  const getBadgeClass = (p) => {
    switch (p) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
      default:
        return 'badge-priority-low';
    }
  };

  const getIcon = (p) => {
    switch (p) {
      case 'High':
        return '▲';
      case 'Medium':
        return '■';
      case 'Low':
      default:
        return '▼';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(priority)}`}>
      <span className="badge-icon">{getIcon(priority)}</span>
      <span>{priority || 'Medium'}</span>
    </span>
  );
}
