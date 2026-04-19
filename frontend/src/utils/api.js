import axios from 'axios';

// PRODUCTION-FIRST URL CONFIGURATION
const API_PRODUCTION = 'https://knowledge-assessment-backend.onrender.com/api';
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const baseURL = isLocal ? 'http://localhost:8000/api' : API_PRODUCTION;

console.log('--- System V2.0 Connectivity ---');
console.log('Target Environment:', isLocal ? 'LOCAL' : 'PRODUCTION');
console.log('API Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cache Buster: Appends a unique timestamp to every GET request
api.interceptors.request.use((config) => {
    if (config.method === 'get') {
        config.params = { ...config.params, _cb: Date.now() };
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
