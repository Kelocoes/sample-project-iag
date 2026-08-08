const API_BASE = 'http://localhost:3000/api';

export const api = {
  // Auth
  login: async (email: string, password?: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  // Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },
  createUser: async (data: any) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getUserById: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/users/${id}`);
    return res.json();
  },

  // Organizations
  getOrganizations: async () => {
    const res = await fetch(`${API_BASE}/organizations`);
    return res.json();
  },
  createOrganization: async (data: any) => {
    const res = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteOrganization: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/organizations/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  getProjectById: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    return res.json();
  },
  createProject: async (data: any) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteProject: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Tasks
  getTasks: async () => {
    const res = await fetch(`${API_BASE}/tasks`);
    return res.json();
  },
  getTaskById: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`);
    return res.json();
  },
  createTask: async (data: any) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateTask: async (id: number | string, data: any) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteTask: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Metrics
  getDashboardMetrics: async () => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    return res.json();
  },
};
