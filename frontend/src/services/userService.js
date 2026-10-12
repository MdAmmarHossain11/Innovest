import axios from 'axios';
import authService from './authService';
import { API_URL } from '../config';

const userService = {
  getAllUsers: async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.access) {
      throw new Error('No authentication token available');
    }
    
    try {
      console.log('Fetching users from chat service'); // Debug log
      const response = await axios.get(`${API_URL}chat/users/`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`
        }
      });
      console.log('User service response:', response.data); // Debug log
      
      if (!Array.isArray(response.data)) {
        console.error('Invalid user data format:', response.data);
        throw new Error('Invalid user data format received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error in userService.getAllUsers:', error);
      throw error;
    }
  }
};

export default userService; 