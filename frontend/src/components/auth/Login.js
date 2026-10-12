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
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import authService from '../../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear errors when user types
        if (name === 'email') {
            setEmailError('');
        }
        if (name === 'password') {
            setPasswordError('');
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        setPasswordError('');
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);
            // Check user_type and redirect accordingly
            if (response.user.user_type === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Login error details:', err);

            // Handle network errors
            if (err.message === 'Network error occurred. Please check your connection.') {
                setError(err.message);
                return;
            }

            // Handle specific error messages
            const errorMessage = err.error || err.message || 'An error occurred during login.';

            if (errorMessage.toLowerCase().includes('invalid email or password') || 
                errorMessage.toLowerCase().includes('verify your email')) {
                setError(errorMessage);
            } else if (errorMessage.toLowerCase().includes('email')) {
                setEmailError(errorMessage);
            } else if (errorMessage.toLowerCase().includes('password')) {
                setPasswordError(errorMessage);
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 128px)', // Subtract header and footer height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
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
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!emailError}
                            helperText={emailError}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
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
                                padding: '12px 20px',
                                fontWeight: 600,
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 8px rgba(25, 118, 210, 0.35)',
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ color: '#1976d2' }}>
                                Forgot password?
                            </MuiLink>
                            <Box sx={{ mt: 1 }}>
                                <MuiLink component={Link} to="/register" variant="body2" sx={{ color: '#1976d2' }}>
                                    {"Don't have an account? Sign Up"}
                                </MuiLink>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login; 