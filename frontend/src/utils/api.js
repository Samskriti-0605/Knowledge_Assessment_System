import axios from 'axios';

// v1.1.0 - Smart URL Detection
const rawBaseURL = (import.meta.env.VITE_API_URL || '').trim() || 
                  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') 
                   ? 'https://knowledge-assessment-backend.onrender.com' 
                   : 'http://localhost:8000');

console.log('API Base URL:', rawBaseURL);

const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL.replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
