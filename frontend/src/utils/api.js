import axios from 'axios';

// Ensure the API URL ends with /api for backend routing
const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL.replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default api;
