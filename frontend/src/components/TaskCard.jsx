import React from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const isOverdue = task.due_date && task.status !== 'Completed' && new Date(task.due_date) < new Date(new Date().toDateString());

  const handleNextStatus = () => {
    const cycle = {
      'Pending': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Pending'
    };
    const nextStatus = cycle[task.status] || 'Pending';
    onStatusChange(task.id, nextStatus);
  };

  return (
    <article className={`task-card ${task.status === 'Completed' ? 'task-card-completed' : ''}`}>
      <div className="task-card-top">
        <span className="task-id">#{task.id}</span>
        <div className="task-badges">
          <PriorityBadge priority={task.priority} />
          <button 
            type="button" 
            className="status-badge-btn" 
            onClick={handleNextStatus} 
            title={`Current: ${task.status}. Click to cycle status.`}
          >
            <StatusBadge status={task.status} />
          </button>
        </div>
      </div>

      <div className="task-card-content">
        <h3 className="task-title" onClick={() => onView(task)} title="Click to view details">
          {task.title}
        </h3>
        {task.description ? (
          <p className="task-desc-preview">
            {task.description.length > 120 
              ? `${task.description.substring(0, 120)}...` 
              : task.description}
          </p>
        ) : (
          <p className="task-desc-empty">No description provided</p>
        )}
      </div>

      <div className="task-card-meta">
        {task.due_date ? (
          <div className={`task-due-date ${isOverdue ? 'due-overdue' : ''}`}>
            <span className="meta-icon">📅</span>
            <span>Due: {task.due_date}</span>
            {isOverdue && <span className="overdue-tag">Overdue</span>}
          </div>
        ) : (
          <div className="task-due-date text-muted">
            <span className="meta-icon">📅</span>
            <span>No due date</span>
          </div>
        )}
      </div>

      <div className="task-card-actions">
        <button
          type="button"
          className="btn-action btn-action-view"
          onClick={() => onView(task)}
          title="View full task details"
          aria-label={`View details for ${task.title}`}
        >
          👁️ Details
        </button>
        <button
          type="button"
          className="btn-action btn-action-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit ${task.title}`}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn-action btn-action-delete"
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label={`Delete ${task.title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}
