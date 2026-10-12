import { API_HOST } from '../config';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  useMediaQuery,
  useTheme,
  InputAdornment
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';

const RED = '#e50914';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_HOST}/api/contact/`, {
        ...formData,
        subject: 'Contact Form Submission',
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSnackbar({
        open: true,
        message: response.data.message || 'Message sent successfully!',
        severity: 'success'
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Failed to send message. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f7fa', py: 8, px: 1 }}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
          px: { xs: 2, sm: 3, md: 5 }
        }}
      >
        <Paper elevation={6} sx={{ borderRadius: 5, p: { xs: 2, sm: 4, md: 6 }, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7} lg={8}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  letterSpacing: 0.5,
                  fontFamily: 'Montserrat, Roboto, Arial, sans-serif'
                }}
              >
                CONTACT US
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 3, maxWidth: 500 }}>
                If you have any questions, please feel free to get in touch with us via phone, text, email, the form below, or even on social media!
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ background: '#f7f7f7', borderRadius: 3, p: { xs: 2, sm: 3 }, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#222' }}>GET IN TOUCH</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                      size="small"
                      sx={{ background: 'white', borderRadius: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
                      size="small"
                      sx={{ background: 'white', borderRadius: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      size="small"
                      sx={{ background: 'white', borderRadius: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.message}
                      helperText={errors.message}
                      size="small"
                      multiline
                      minRows={4}
                      sx={{ background: 'white', borderRadius: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MessageIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        background: RED,
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        boxShadow: '0 2px 8px rgba(229,9,20,0.10)',
                        '&:hover': { background: '#b00610' },
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: 160
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'SEND MESSAGE'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                <Box sx={{ background: '#f7f7f7', borderRadius: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#222' }}>CONTACT INFORMATION</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PhoneIcon sx={{ color: RED, mr: 1 }} />
                    <Typography variant="body2">773-385-1240</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <LocationOnIcon sx={{ color: RED, mr: 1 }} />
                    <Typography variant="body2">United city, Madani Avenue, Badda, Dhaka, Bangladesh</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ color: RED, mr: 1 }} />
                    <Typography variant="body2">innovest05@gmail.com</Typography>
                  </Box>
                </Box>
                <Box sx={{ background: '#f7f7f7', borderRadius: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#222' }}>BUSINESS HOURS</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Monday - Friday</Typography>
                      <Typography variant="body2">9:00 am - 8:00 pm</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Saturday</Typography>
                      <Typography variant="body2">9:00 am - 6:00 pm</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Sunday</Typography>
                      <Typography variant="body2">9:00 am - 5:00 pm</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#eee' }} />

          <Box sx={{ borderRadius: 3, overflow: 'hidden', height: '30vh', minHeight: 260, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.465287926324!2d90.45860677239652!3d23.802048139595566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c864383c35d3%3A0x1646d663724f15c5!2sRF27%2BR7F%20United%20city%2C%20Madani%20Ave%2C%20Dhaka%201212!5e0!3m2!1sen!2sbd!4v1747508054545!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 15px rgba(24,144,234,0.10)',
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1.05rem',
            letterSpacing: 0.5,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
