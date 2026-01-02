import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔗 API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ Log pour debug
    console.log('📡 API Request:', {
      method: config.method,
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth APIs
export const authAPI = {
  register: (data) => {
    console.log('📤 authAPI.register called with:', data);
    return api.post('/auth/register', data);
  },
  login: (data) => {
    console.log('📤 authAPI.login called with:', data);
    return api.post('/auth/login', data);
  },
  getMe: () => api.get('/auth/me'),
};

// Job APIs
export const jobAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/employer/my-jobs'),
  getEmployerStats: () => api.get('/jobs/employer/stats'),
};

// Application APIs
export const applicationAPI = {
  submitApplication: (formData) =>
    api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyApplications: () => api.get('/applications/my-applications'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  getAllApplications: () => api.get('/applications/employer/all'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getApplicationStats: () => api.get('/applications/employer/stats'),
};

export default api;