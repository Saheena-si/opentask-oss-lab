import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import FilterControls from './components/FilterControls';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetailModal from './components/TaskDetailModal';
import ConfirmDialog from './components/ConfirmDialog';
import Notification from './components/Notification';
import {
  getHealthStatus,
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from './services/api';

export default function App() {
  // State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [notification, setNotification] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals & Dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show notification helper
  const notify = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Check backend health
  const checkHealth = useCallback(async () => {
    try {
      await getHealthStatus();
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  }, []);

  // Fetch tasks with filters
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks({
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter
      });
      setTasks(data);
      setBackendStatus('online');
    } catch (err) {
      notify(err.message || 'Failed to load tasks', 'error');
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, priorityFilter]);

  // Initial load & health polling
  useEffect(() => {
    checkHealth();
    loadTasks();
  }, [checkHealth, loadTasks]);

  // Handle Form Submission (Create or Edit)
  const handleFormSubmit = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        notify(`Task #${updated.id} updated successfully.`);
        if (viewingTask && viewingTask.id === updated.id) {
          setViewingTask(updated);
        }
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
        notify(`Task #${created.id} created successfully.`);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      notify(err.message || 'Failed to save task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Change from TaskCard
  const handleQuickStatusChange = async (id, nextStatus) => {
    try {
      const updated = await updateTask(id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      notify(`Task #${id} status changed to ${nextStatus}.`);
      if (viewingTask && viewingTask.id === id) {
        setViewingTask(updated);
      }
    } catch (err) {
      notify(err.message || 'Failed to update task status', 'error');
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      notify(`Task #${deletingTask.id} deleted successfully.`);
      setDeletingTask(null);
      if (viewingTask && viewingTask.id === deletingTask.id) {
        setViewingTask(null);
      }
    } catch (err) {
      notify(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all search and filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  const isFiltered = Boolean(searchQuery.trim() || statusFilter !== 'All' || priorityFilter !== 'All');

  return (
    <div className="app-layout">
      <Navbar
        onOpenCreate={() => {
          setEditingTask(null);
          setIsFormOpen(true);
        }}
        backendStatus={backendStatus}
      />

      {backendStatus === 'offline' && (
        <div className="offline-banner" role="alert">
          <span>⚠️ <strong>Backend Disconnected:</strong> Could not reach the Express API on port 5000. Ensure the backend server is running (`npm start` inside backend/).</span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadTasks}>
            🔄 Retry Connection
          </button>
        </div>
      )}

      <main className="main-content">
        <Dashboard
          tasks={tasks}
          currentStatusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <section className="tasks-section" aria-label="Task Management List">
          <div className="tasks-controls-header">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
            <FilterControls
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              isFiltered={isFiltered}
              onResetFilters={handleResetFilters}
              resultCount={tasks.length}
            />
          </div>

          <TaskList
            tasks={tasks}
            loading={loading}
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenCreate={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            onView={(task) => setViewingTask(task)}
            onEdit={(task) => {
              setEditingTask(task);
              setIsFormOpen(true);
            }}
            onDelete={(task) => setDeletingTask(task)}
            onStatusChange={handleQuickStatusChange}
          />
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>OpenTask</strong> — Open Source Software (OSS) Lab Mini Project.
          </p>
          <p className="footer-credits">
            Built with React, Express, and SQLite. Distributed under the MIT License.
          </p>
        </div>
      </footer>

      {/* Task Create / Edit Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        isSubmitting={isSubmitting}
      />

      {/* Single Task Details Modal */}
      <TaskDetailModal
        isOpen={Boolean(viewingTask)}
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={(task) => {
          setEditingTask(task);
          setIsFormOpen(true);
        }}
        onDelete={(task) => setDeletingTask(task)}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        title="Confirm Task Deletion"
        message={
          deletingTask
            ? `Are you sure you want to permanently delete task #${deletingTask.id} ("${deletingTask.title}")? This action cannot be reversed.`
            : ''
        }
        confirmLabel="Delete Task"
        cancelLabel="Keep Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isProcessing={isDeleting}
      />

      {/* Toast Notification */}
      <Notification
        notification={notification}
        onDismiss={() => setNotification(null)}
      />
    </div>
  );
}
