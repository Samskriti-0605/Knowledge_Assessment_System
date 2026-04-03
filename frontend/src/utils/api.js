import axios from 'axios';

// Automatically detect the API URL or use the environment variable
// If we are on Vercel, we default to the live Render backend
const rawBaseURL = import.meta.env.VITE_API_URL || 
                  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') 
                   ? 'https://knowledge-assessment-backend.onrender.com' 
                   : 'http://localhost:8000');

const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL.replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
