const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const authService = {
  register: async (data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  login: async (data) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: headers() });
    return res.json();
  },
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`, { headers: headers() });
    return res.json();
  },
};

export const complaintService = {
  create: async (data) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getAll: async (params = '') => {
    const res = await fetch(`${API_BASE}/complaints${params}`, { headers: headers() });
    return res.json();
  },
  getAssigned: async () => {
    const res = await fetch(`${API_BASE}/complaints/assigned`, { headers: headers() });
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`, { headers: headers() });
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateStatus: async (id, data) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  assign: async (id, officerId) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ officer_id: officerId }),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    return res.json();
  },
};

export const dashboardService = {
  getStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: headers() });
    return res.json();
  },
  getByStatus: async () => {
    const res = await fetch(`${API_BASE}/dashboard/by-status`, { headers: headers() });
    return res.json();
  },
  getByCategory: async () => {
    const res = await fetch(`${API_BASE}/dashboard/by-category`, { headers: headers() });
    return res.json();
  },
  getByPriority: async () => {
    const res = await fetch(`${API_BASE}/dashboard/by-priority`, { headers: headers() });
    return res.json();
  },
  getRecent: async () => {
    const res = await fetch(`${API_BASE}/dashboard/recent`, { headers: headers() });
    return res.json();
  },
  getAging: async () => {
    const res = await fetch(`${API_BASE}/dashboard/aging`, { headers: headers() });
    return res.json();
  },
};
