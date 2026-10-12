import React, { useEffect } from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TaskDetailModal({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div 
        className="modal-container task-detail-modal" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="detail-task-title"
      >
        <div className="modal-header">
          <div className="detail-header-left">
            <span className="task-id">#{task.id}</span>
            <div className="detail-badges">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close task details"
          >
            ✕
          </button>
        </div>

        <div className="detail-body">
          <h2 id="detail-task-title" className="detail-title">{task.title}</h2>

          <div className="detail-section">
            <h4 className="detail-section-heading">Description</h4>
            {task.description ? (
              <p className="detail-description">{task.description}</p>
            ) : (
              <p className="detail-description text-muted">No description provided for this task.</p>
            )}
          </div>

          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <span className="meta-label">📅 Due Date</span>
              <span className="meta-value">{task.due_date || 'No deadline'}</span>
            </div>
            <div className="detail-meta-item">
              <span className="meta-label">🕒 Created</span>
              <span className="meta-value">{task.created_at || 'N/A'}</span>
            </div>
            <div className="detail-meta-item">
              <span className="meta-label">✏️ Last Updated</span>
              <span className="meta-value">{task.updated_at || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions detail-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            🗑️ Delete Task
          </button>
          <div className="actions-right">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              ✏️ Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
