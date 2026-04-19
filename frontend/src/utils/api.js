import axios from 'axios';

// Professional API Configuration - Uses Vercel/Render Environment Variables
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').trim();

console.log('API Connectivity:', {
    environment: import.meta.env.MODE,
    target: baseURL
});

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
