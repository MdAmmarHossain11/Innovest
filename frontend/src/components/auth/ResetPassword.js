import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    IconButton,
    InputAdornment,
    LinearProgress,
    Tooltip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    CheckCircle,
    Cancel,
    Info,
    Lock,
    Key
} from '@mui/icons-material';
import authService from '../../services/authService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [formData, setFormData] = useState({
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        conditions: [],
        allConditionsMet: false
    });

    const checkPasswordStrength = (password) => {
        const conditions = [];
        let score = 0;
        let allConditionsMet = true;

        // Length check
        if (password.length >= 8) {
            conditions.push({ text: 'Password should be at least 8 characters long', met: true });
            score += 1;
        } else {
            conditions.push({ text: 'Password should be at least 8 characters long', met: false });
            allConditionsMet = false;
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            conditions.push({ text: 'Include at least one uppercase letter', met: true });
            score += 1;
        } else {
            conditions.push({ text: 'Include at least one uppercase letter', met: false });
            allConditionsMet = false;
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            conditions.push({ text: 'Include at least one lowercase letter', met: true });
            score += 1;
        } else {
            conditions.push({ text: 'Include at least one lowercase letter', met: false });
            allConditionsMet = false;
        }

        // Number check
        if (/[0-9]/.test(password)) {
            conditions.push({ text: 'Include at least one number', met: true });
            score += 1;
        } else {
            conditions.push({ text: 'Include at least one number', met: false });
            allConditionsMet = false;
        }

        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            conditions.push({ text: 'Include at least one special character (!@#$%^&*(),.?":{}|<>)', met: true });
            score += 1;
        } else {
            conditions.push({ text: 'Include at least one special character (!@#$%^&*(),.?":{}|<>)', met: false });
            allConditionsMet = false;
        }

        setPasswordStrength({ score, conditions, allConditionsMet });
    };

    const generatePasswordSuggestion = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*(),.?":{}|<>';
        
        const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];
        
        let password = '';
        // Ensure at least one of each type
        password += getRandomChar(uppercase);
        password += getRandomChar(lowercase);
        password += getRandomChar(numbers);
        password += getRandomChar(special);
        
        // Fill the rest randomly
        const allChars = uppercase + lowercase + numbers + special;
        for (let i = 0; i < 4; i++) {
            password += getRandomChar(allChars);
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return password;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Check if passwords match
        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Check if all password conditions are met
        if (!passwordStrength.allConditionsMet) {
            setError('Please ensure your password meets all requirements');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.resetPassword(token, formData);
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = (score) => {
        if (score <= 2) return '#ff1744'; // Red
        if (score <= 4) return '#ffa000'; // Orange
        return '#00c853'; // Green
    };

    return (
        <>
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
                                Reset Password
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
                                name="password"
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            {formData.password && (
                                <Box sx={{ mt: 2, mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Password Strength
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(passwordStrength.score / 5) * 100}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getStrengthColor(passwordStrength.score)
                                            }
                                        }}
                                    />
                                    <List dense>
                                        {passwordStrength.conditions.map((condition, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    {condition.met ? (
                                                        <CheckCircle color="success" />
                                                    ) : (
                                                        <Cancel color="error" />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText primary={condition.text} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password2"
                                label="Confirm New Password"
                                type={showPassword2 ? 'text' : 'password'}
                                value={formData.password2}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword2(!showPassword2)}
                                                edge="end"
                                            >
                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Password match indicator */}
                            {formData.password && formData.password2 && (
                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                    {formData.password === formData.password2 ? (
                                        <>
                                            <CheckCircle color="success" sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="success.main">
                                                Passwords match
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Cancel color="error" sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="error.main">
                                                Passwords do not match
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            )}

                            {/*<Box sx={{ mt: 2, mb: 2 }}>
                                <Tooltip title="Click to generate a strong password suggestion">
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            const suggestion = generatePasswordSuggestion();
                                            setFormData(prev => ({
                                                ...prev,
                                                password: suggestion,
                                                password2: suggestion
                                            }));
                                            checkPasswordStrength(suggestion);
                                        }}
                                        startIcon={<Key />}
                                        fullWidth
                                    >
                                        Generate Strong Password
                                    </Button>
                                </Tooltip>
                            </Box>*/}

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
                                disabled={loading || !passwordStrength.allConditionsMet || formData.password !== formData.password2 || !formData.password || !formData.password2}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default ResetPassword; 