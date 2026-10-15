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

    if (authService.isAdmin(user)) {
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