import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'
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
export const exportCSV = () => `${api.defaults.baseURL}/users/export`;

export default api;
