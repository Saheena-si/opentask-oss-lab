import React, { useEffect } from 'react';

export default function Notification({ notification, onDismiss }) {
  useEffect(() => {
    if (notification && notification.message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification || !notification.message) return null;

  const isError = notification.type === 'error';

  return (
    <div className={`notification-toast ${isError ? 'toast-error' : 'toast-success'}`} role="status">
      <div className="toast-icon">
        {isError ? '❌' : '✅'}
      </div>
      <div className="toast-content">
        <span className="toast-message">{notification.message}</span>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onDismiss}
        aria-label="Dismiss message"
      >
        ✕
      </button>
    </div>
  );
}
