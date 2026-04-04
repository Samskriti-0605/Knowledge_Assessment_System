import axios from 'axios';

const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const rawBaseURL = isVercel 
    ? 'https://knowledge-assessment-backend.onrender.com/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').trim();

// Clean up just in case
let baseURL = rawBaseURL;
if (baseURL.includes('https://') && baseURL.lastIndexOf('https://') > 0) {
    baseURL = baseURL.substring(baseURL.lastIndexOf('https://'));
}
if (!baseURL.endsWith('/api')) {
    baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

console.log('API Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
