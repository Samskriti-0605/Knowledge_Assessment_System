import axios from 'axios';

// Professional API Configuration - Uses Vercel/Render Environment Variables
// Professional API Configuration - Handles Render hostnames and local development
let rawURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').trim();

// If the URL is just a hostname (e.g. knowledge-backend.onrender.com), add https://
if (!rawURL.startsWith('http')) {
    rawURL = `https://${rawURL}`;
}

// Render Blueprint 'host' property only gives internal hostname. 
// If missing the domain, append .onrender.com
if (!rawURL.includes('.') && !rawURL.includes('localhost')) {
    rawURL = `${rawURL}.onrender.com`;
}

// Ensure it ends with /api for backend routing
if (!rawURL.endsWith('/api') && !rawURL.includes('/api/')) {
    rawURL = rawURL.endsWith('/') ? `${rawURL}api` : `${rawURL}/api`;
}

const baseURL = rawURL;

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
