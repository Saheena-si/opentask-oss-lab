import React from 'react';

export default function SummaryCard({ title, count, icon, colorClass, subtitle, onClick, isActive }) {
  return (
    <div 
      className={`summary-card ${colorClass} ${isActive ? 'summary-card-active' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="summary-card-header">
        <span className="summary-card-title">{title}</span>
        <div className="summary-card-icon">{icon}</div>
      </div>
      <div className="summary-card-body">
        <span className="summary-card-count">{count}</span>
        {subtitle && <span className="summary-card-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
