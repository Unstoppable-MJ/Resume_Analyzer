import axios from 'axios';

const api = axios.create({
    // Use environment variable for production, fallback for development
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8006/api/v1/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
