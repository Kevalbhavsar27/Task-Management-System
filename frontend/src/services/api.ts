import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('taskflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !String(error.config?.url || '').includes('/auth/login')) {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') window.location.href = '/login';
  }
  return Promise.reject(error);
});
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message || 'Something went wrong.';
  return error instanceof Error ? error.message : 'Something went wrong.';
}
export default api;
