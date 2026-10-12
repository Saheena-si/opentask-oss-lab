/**
 * API Service for OpenTask
 * Centralizes all HTTP requests between the React frontend and Express backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

/**
 * Helper to handle fetch responses and standardize errors
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.error || (data.errors && data.errors[0]) || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data.errors || null;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the OpenTask backend server. Please verify the backend is running.');
    }
    throw err;
  }
}

/**
 * Health check
 */
export async function getHealthStatus() {
  return request('/health');
}

/**
 * Fetch all tasks with optional query filters
 * @param {Object} filters - { search, status, priority }
 */
export async function getTasks(filters = {}) {
  const queryParams = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    queryParams.append('search', filters.search.trim());
  }

  if (filters.status && filters.status !== 'All') {
    queryParams.append('status', filters.status);
  }

  if (filters.priority && filters.priority !== 'All') {
    queryParams.append('priority', filters.priority);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

  const res = await request(endpoint);
  return res.data || [];
}

/**
 * Fetch a single task by ID
 */
export async function getTaskById(id) {
  const res = await request(`/tasks/${id}`);
  return res.data;
}

/**
 * Create a new task
 */
export async function createTask(taskData) {
  const res = await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
  return res.data;
}

/**
 * Update an existing task
 */
export async function updateTask(id, taskData) {
  const res = await request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
  return res.data;
}

/**
 * Delete a task
 */
export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE'
  });
}
