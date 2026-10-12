import { API_HOST } from '../config';
import axios from 'axios';

const API_URL = `${API_HOST}/api/auth/`;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

const register = async (userData) => {
    try {
        console.log('Attempting registration with data:', userData);
        const response = await axiosInstance.post('register/', userData);
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('login/', {
            email,
            password
        });
        if (response.data.access) {
            const userData = {
                ...response.data.user,
                access: response.data.access
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', response.data.access);
            // Set default authorization header for all future requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }
        return response.data;
    } catch (error) {
        // Pass the error response data directly
        if (error.response?.data) {
            throw error.response.data;
        }
        throw new Error('Network error occurred. Please check your connection.');
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove authorization header
    delete axiosInstance.defaults.headers.common['Authorization'];
};

const verifyEmail = async (token) => {
    try {
        const response = await axiosInstance.get(`verify-email/${token}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const updateProfile = async (userData) => {
    try {
        const user = getCurrentUser();
        if (!user?.access) {
            throw new Error('No authentication token found');
        }

        const response = await axiosInstance.put('profile/', userData, {
            headers: { Authorization: `Bearer ${user.access}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error;
        }
        throw new Error('Network error occurred. Please check your connection.');
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await axiosInstance.post('forgot-password/', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const resetPassword = async (token, passwordData) => {
    try {
        const response = await axiosInstance.post(`reset-password/${token}/`, passwordData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getToken = () => {
    const user = getCurrentUser();
    if (user?.access) {
        return user.access;
    }
    const token = localStorage.getItem('token');
    if (token) {
        // Update axios headers if token exists
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
    }
    return null;
};

const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    verifyEmail,
    updateProfile,
    forgotPassword,
    resetPassword,
    getToken,
    isAuthenticated
};

export default authService; 