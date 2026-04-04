import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password });
            const response = await api.post('auth.php?action=login', { email, password });
            console.log('Login response:', response.data);
            if (response.data && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return { success: true };
            }
            return { success: false, message: response.data?.message || 'Invalid response from server' };
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.status, error.response.data);
                return { success: false, message: error.response.data?.message || 'Login failed' };
            } else if (error.request) {
                console.error('No response received:', error.request);
                return { success: false, message: 'Server not reachable. Check if backend is running.' };
            } else {
                console.error('Error setting up request:', error.message);
                return { success: false, message: 'Request error: ' + error.message };
            }
        }
    };

    const register = async (name, email, password, role) => {
        try {
            await api.post('auth.php?action=register', { name, email, password, role });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
