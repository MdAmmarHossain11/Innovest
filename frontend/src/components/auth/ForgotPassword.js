import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Link as MuiLink,
    InputAdornment
} from '@mui/material';
import {
    Email,
    Lock
} from '@mui/icons-material';
import authService from '../../services/authService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            setSuccess(response.message);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <Lock sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
                            Forgot Password
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2,
                                backgroundColor: '#1976d2',
                                color: 'white',
                                padding: '10px 20px',
                                fontWeight: 600,
                                boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 8px rgba(25, 118, 210, 0.35)',
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <MuiLink component={Link} to="/login" variant="body2" sx={{ color: '#1976d2' }}>
                                Back to Login
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ForgotPassword; 