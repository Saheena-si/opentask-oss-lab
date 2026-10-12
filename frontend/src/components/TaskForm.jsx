import React, { useState, useEffect, useRef } from 'react';

export default function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}) {
  const isEditing = Boolean(initialData && initialData.id);
  const titleInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    due_date: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          priority: initialData.priority || 'Medium',
          status: initialData.status || 'Pending',
          due_date: initialData.due_date || ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          status: 'Pending',
          due_date: ''
        });
      }
      setValidationError('');
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen, initialData]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      setValidationError('Task title is required.');
      if (titleInputRef.current) titleInputRef.current.focus();
      return;
    }

    if (formData.title.trim().length > 200) {
      setValidationError('Task title cannot exceed 200 characters.');
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      due_date: formData.due_date || null
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="task-form-title"
      >
        <div className="modal-header">
          <h2 id="task-form-title" className="modal-title">
            {isEditing ? `Edit Task #${initialData.id}` : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {validationError && (
            <div className="form-alert form-alert-error" role="alert">
              <span>⚠️ {validationError}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="text-required">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              name="title"
              type="text"
              className={`form-input ${validationError ? 'input-error' : ''}`}
              placeholder="e.g., Set up database backups"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Description <span className="text-optional">(optional)</span>
            </label>
            <textarea
              id="task-description"
              name="description"
              rows={4}
              className="form-textarea"
              placeholder="Provide context, acceptance criteria, or relevant links..."
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group form-col">
              <label htmlFor="task-status" className="form-label">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">
              Due Date <span className="text-optional">(optional)</span>
            </label>
            <input
              id="task-due-date"
              name="due_date"
              type="date"
              className="form-input"
              value={formData.due_date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span> Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
