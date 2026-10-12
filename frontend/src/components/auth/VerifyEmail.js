import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Alert,
    Paper,
    Button
} from '@mui/material';
import authService from '../../services/authService';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await authService.verifyEmail(token);
                setMessage(response.message);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred during email verification');
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <>
            <Container component="main" maxWidth="sm" sx={{ mt: 12 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                        <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                            Email Verification
                        </Typography>

                        {loading ? (
                            <Typography>Verifying your email...</Typography>
                        ) : (
                            <>
                                {error ? (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                ) : (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        {message}
                                    </Alert>
                                )}
                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/login')}
                                    >
                                        Go to Login
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default VerifyEmail; 