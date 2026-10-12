import axios from 'axios';
import { API_URL } from '../config';

const companyPermissionService = {
    requestAccess: async (companyId, userIntro, userPurpose) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post(
                `${API_URL}company-permission/request/`,
                {
                    company: companyId,
                    user_intro: userIntro,
                    user_purpose: userPurpose,
                    ppt: 'accept',
                    request_access: 'yes'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${currentUser.access}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getNotifications: async (markRead = false) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(
            `${API_URL}company-permission/notifications/${markRead ? '?mark_read=true' : ''}`,
            { headers: { 'Authorization': `Bearer ${currentUser?.access}` } }
        );
        return response.data;
    },
    getPermission: async (companyId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_URL}company-permission/${companyId}/`, {
            headers: { 'Authorization': `Bearer ${currentUser.access}` }
        });
        if (!response.ok) throw new Error('Failed to fetch permission');
        return response.json();
    },
    fetchRequests: async (companyId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`${API_URL}company/${companyId}/permissions/`, {
            headers: { 'Authorization': `Bearer ${currentUser?.access}` }
        });
        return response.data;
    },
    updateRequest: async (permissionId, data) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser?.access) {
            throw new Error('No access token found');
        }
        const response = await axios.patch(
            `${API_URL}company-permissions/${permissionId}/`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${currentUser.access}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },
    deleteRequest: async (permissionId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.delete(
            `${API_URL}company-permissions/${permissionId}/`,
            { headers: { 'Authorization': `Bearer ${currentUser?.access}` } }
        );
        return response.data;
    },
    getRequest: async (permissionId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(
            `${API_URL}company-permissions/${permissionId}/user-detail/`,
            { headers: { 'Authorization': `Bearer ${currentUser?.access}` } }
        );
        return response.data;
    },
    fetchUserDetail: async (permissionId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(
            `${API_URL}company-permissions/${permissionId}/user-detail/`,
            { headers: { 'Authorization': `Bearer ${currentUser?.access}` } }
        );
        return response.data;
    },
};

export default companyPermissionService; 