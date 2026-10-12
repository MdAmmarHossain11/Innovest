import React, { useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import ProfileManagement from '../profile/ProfileManagement';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Check if user is admin trying to access user dashboard
    if (user.user_type === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProfileManagement />
    </Container>
  );
};

export default Dashboard; 