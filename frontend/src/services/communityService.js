import { API_HOST } from '../config';
import axios from 'axios';
import authService from './authService';

const API_URL = `${API_HOST}/api/community`;

// Initialize authenticated API client
const authenticatedApi = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
authenticatedApi.interceptors.request.use((config) => {
  const token = authService.getCurrentUser()?.access;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
authenticatedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user?.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const communityService = {
  // Get all posts (optionally filtered)
  getPosts: async (filters = {}) => {
    try {
      const response = await api.get('/posts/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get post comments
  getComments: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a comment (authenticated endpoint)
  addComment: async (postId, content) => {
    try {
      const response = await authenticatedApi.post(`/posts/${postId}/comments/`, { content });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Delete a comment (authenticated endpoint)
  deleteComment: async (postId, commentId) => {
    try {
      const response = await authenticatedApi.delete(`/posts/${postId}/comments/${commentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Add a reaction (authenticated endpoint)
  addReaction: async (postId, type) => {
    try {
      const response = await authenticatedApi.post(`/posts/${postId}/reactions/`, { type });
      return response.data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  // Toggle interest (authenticated endpoint)
  toggleInterest: async (postId) => {
    try {
      const response = await authenticatedApi.post(`/posts/${postId}/interest/`);
      return response.data;
    } catch (error) {
      console.error('Error toggling interest:', error);
      throw error;
    }
  },

  // Get notifications (authenticated endpoint)
  getNotifications: async ({ offset = 0, limit = 10, markRead = false }) => {
    try {
      const response = await authenticatedApi.get('/notifications/', {
        params: { 
          offset, 
          limit, 
          mark_read: markRead 
        } 
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notification count (authenticated endpoint)
  getUnreadNotificationCount: async () => {
    try {
      const response = await authenticatedApi.get('/notifications/unread-count/');
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  },

  // Delete a post (authenticated endpoint)
  deletePost: async (postId) => {
    try {
      const response = await authenticatedApi.delete(`/posts/${postId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};

export default communityService; 