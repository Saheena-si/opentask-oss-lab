import React from 'react';

export default function FilterControls({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  isFiltered,
  onResetFilters,
  resultCount
}) {
  return (
    <div className="filter-controls-container">
      <div className="filter-group">
        <label htmlFor="status-filter" className="filter-label">
          Status:
        </label>
        <select
          id="status-filter"
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter" className="filter-label">
          Priority:
        </label>
        <select
          id="priority-filter"
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {isFiltered && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onResetFilters}
          title="Reset search and filters"
        >
          🔄 Reset Filters
        </button>
      )}

      <div className="filter-results-info">
        <span>Showing <strong>{resultCount}</strong> {resultCount === 1 ? 'task' : 'tasks'}</span>
      </div>
    </div>
  );
}
