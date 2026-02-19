import axios from 'axios';

// Using relative paths ensures compatibility with unified deployments
// where the backend serves the frontend. 
const api = axios.create({
    baseURL: '/api'
});

export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateUser = (id, data) => api.put(`/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const exportCSV = () => `/api/users/export`;

export default api;
