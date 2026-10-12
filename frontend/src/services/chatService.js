import axios from 'axios';
import { API_HOST } from '../config';

const API_URL = `${API_HOST}/api/chat/`;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.access) {
            config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Response error:', error.response || error);
        return Promise.reject(error);
    }
);

class ChatService {
    // Get all users except current user
    async getUsers() {
        try {
            console.log('Fetching users from:', `${API_URL}users/`);
            const response = await axiosInstance.get('users/');
            console.log('Users response:', response.data);
            
            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format: expected an array of users');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Get conversation with a specific user
    async getConversation(userId) {
        try {
            console.log('Fetching conversation for user:', userId);
            const response = await axiosInstance.get(`conversation/?user_id=${userId}`);
            console.log('Conversation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }

    // Send a message (optionally with file)
    async sendMessage(userId, message, file = null) {
        try {
            console.log('Sending message to user:', userId);
            let data;
            let headers = {};
            if (file) {
                data = new FormData();
                data.append('receiver', userId);
                data.append('message', message || '');
                data.append('file', file);
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                data = { receiver: userId, message: message };
            }
            const response = await axiosInstance.post('send/', data, { headers });
            console.log('Message sent response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Mark message as read
    async markAsRead(messageId) {
        try {
            console.log('Marking message as read:', messageId);
            const response = await axiosInstance.post(`messages/${messageId}/mark_as_read/`);
            console.log('Mark as read response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }

    // Send a chat request
    async sendRequest(toUserId) {
        try {
            const response = await axiosInstance.post('send_request/', { 
                to_user: toUserId 
            });
            return response.data;
        } catch (error) {
            console.error('Error sending chat request:', error);
            throw error;
        }
    }

    // Respond to a chat request (accept/reject)
    async respondRequest(requestId, action) {
        try {
            const response = await axiosInstance.post('respond_request/', { 
                request_id: requestId, 
                action_type: action 
            });
            return response.data;
        } catch (error) {
            console.error('Error responding to chat request:', error);
            throw error;
        }
    }

    // List all chat requests (sent and received)
    async getMyRequests() {
        try {
            const response = await axiosInstance.get('my_requests/');
            return response.data;
        } catch (error) {
            console.error('Error fetching chat requests:', error);
            throw error;
        }
    }

    // Delete a message
    async deleteMessage(messageId) {
        try {
            const response = await axiosInstance.delete(`messages/${messageId}/delete_message/`);
            return response.data;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    // Edit a message
    async editMessage(messageId, newText) {
        try {
            const response = await axiosInstance.patch(`messages/${messageId}/`, { message: newText });
            return response.data;
        } catch (error) {
            console.error('Error editing message:', error);
            throw error;
        }
    }
}

export default new ChatService(); 