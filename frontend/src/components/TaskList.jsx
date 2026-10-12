import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({
  tasks,
  loading,
  isFiltered,
  onResetFilters,
  onOpenCreate,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) {
  if (loading) {
    return (
      <div className="tasks-loading-container" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading tasks from database...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    if (isFiltered) {
      return (
        <div className="empty-state-card" role="status">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No matching tasks found</h3>
          <p className="empty-state-desc">
            We couldn't find any tasks matching your current search or filter criteria.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onResetFilters}
          >
            Clear Search & Filters
          </button>
        </div>
      );
    }

    return (
      <div className="empty-state-card" role="status">
        <div className="empty-state-icon">📝</div>
        <h3 className="empty-state-title">No tasks in your workspace yet</h3>
        <p className="empty-state-desc">
          Get started by creating your very first task to track work items, priorities, and deadlines.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenCreate}
        >
          ➕ Create First Task
        </button>
      </div>
    );
  }

  return (
    <div className="task-grid" aria-label="Task list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
