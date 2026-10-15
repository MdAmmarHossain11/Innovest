import { API_HOST, getMediaUrl } from '../../config';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  IconButton,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Alert from '@mui/material/Alert';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LinkIcon from '@mui/icons-material/Link';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import authService from '../../services/authService';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const states = [
  "Select One",
  "Barisal", "Chattogram", "Dhaka", "Khulna", "Mymensingh",
  "Rajshahi", "Rangpur", "Sylhet"
];

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState(0); // Set to 0 for Your Profile tab
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    title: '',
    company: '',
    email: '',
    website: '',
    city: '',
    state: 'Select One',
    bio: '',
    profile_pic: null
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    // Fetch user info from backend on mount
    const fetchUser = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user && user.access) {
          const profile = await authService.getProfile();
          setFormData((currentData) => ({
            ...currentData,
            ...profile,
            state: profile.state || 'Select One',
            profile_pic: profile.profile_pic || null
          }));
          const profilePicture = profile.profile_pic || '';
          setProfilePicUrl(getMediaUrl(profilePicture));
        }
      } catch (err) {
        setError('Failed to fetch user info');
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setError('');
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.access) throw new Error('Not authenticated');
      const profileFields = { ...formData };
      delete profileFields.profile_pic;
      let payload = profileFields;
      if (profilePic) {
        payload = new FormData();
        Object.entries(profileFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) payload.append(key, value);
        });
        payload.append('profile_pic', profilePic);
      }
      const updatedProfile = await authService.updateProfile(payload);
      const updatedPicture = updatedProfile.profile_pic || '';
      setFormData((currentData) => ({
        ...currentData,
        ...updatedProfile,
        state: updatedProfile.state || 'Select One',
        profile_pic: updatedPicture || null
      }));
      setProfilePicUrl(getMediaUrl(updatedPicture));
      setProfilePic(null);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.profile_pic?.[0] ||
        err.message ||
        'Failed to save changes'
      );
      setSaveStatus('');
      console.error('Error updating profile:', err);
    }
  };


  const handleDeleteAccount = async () => {
    setDeleteError('');
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.access) throw new Error('Not authenticated');
      await axios.delete(`${API_HOST}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${user.access}` }
      });
      // Optionally, log out the user
      authService.logout();
      navigate('/');
    } catch (err) {
      setDeleteError('Failed to delete account.');
    }
  };

  const renderProfileContent = () => (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#fff', borderRadius: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={profilePicUrl}
          sx={{ width: 96, height: 96, mb: 1, boxShadow: 2 }}
        />
        <label htmlFor="profile-pic-upload">
          <input
            accept="image/*"
            id="profile-pic-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
          <Button
            variant="outlined"
            component="span"
            startIcon={<PhotoCamera />}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            {profilePic ? 'Change Photo' : 'Upload Photo'}
          </Button>
        </label>
      </Box>
      <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>Personal Information</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            variant="outlined"
            autoComplete="given-name"
            helperText="Enter your first name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            variant="outlined"
            autoComplete="family-name"
            helperText="Enter your last name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Title/Position"
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            helperText="Your current job title or position"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            variant="outlined"
            helperText="Your company or organization"
          />
        </Grid>
      </Grid>
      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#1976d2', fontWeight: 600 }}>Contact Information</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            autoComplete="email"
            helperText="We'll never share your email."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            variant="outlined"
            autoComplete="url"
            helperText="Your personal or company website"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            variant="outlined"
            autoComplete="address-level2"
            helperText="City you are based in"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>State</InputLabel>
            <Select
              value={formData.state}
              onChange={handleChange}
              label="State"
              name="state"
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#1976d2', fontWeight: 600 }}>About You</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Introduce Yourself (Short Bio)"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            helperText="A short summary about you, your interests, or your work."
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: '#1976d2',
            color: 'white',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 2,
            px: 4,
            textTransform: 'uppercase',
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{
            color: '#666',
            borderColor: '#ccc',
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'uppercase',
            '&:hover': {
              borderColor: '#1976d2',
              bgcolor: 'rgba(25, 118, 210, 0.04)'
            },
          }}
        >
          Close
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ ml: 2, borderColor: '#f44336', color: '#f44336', fontWeight: 600 }}
        >
          Delete Account
        </Button>
        {deleteError && (
          <Typography sx={{ color: 'red', ml: 2, alignSelf: 'center', fontWeight: 500 }}>
            {deleteError}
          </Typography>
        )}
        {saveStatus === 'success' && (
          <Typography sx={{ color: 'green', ml: 2, alignSelf: 'center', fontWeight: 500 }}>
            Profile saved!
          </Typography>
        )}
      </Grid>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: '#666',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
          <Box
            onClick={() => setActiveTab(0)}
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: activeTab === 0 ? '#fff' : 'transparent',
              borderBottom: activeTab === 0 ? '2px solid #00A4A6' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeTab === 0 ? '#fff' : '#f0f0f0'
              }
            }}
          >
            <PersonOutlineIcon sx={{ mb: 1, color: '#666' }} />
            <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
              Your Profile
            </Typography>
          </Box>
          <Box
            onClick={() => setActiveTab(1)}
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: activeTab === 1 ? '#fff' : 'transparent',
              borderBottom: activeTab === 1 ? '2px solid #00A4A6' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeTab === 1 ? '#fff' : '#f0f0f0'
              }
            }}
          >
            <LockOutlinedIcon sx={{ mb: 1, color: '#666' }} />
            <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
              Security & Password
            </Typography>
          </Box>
          <Box
            onClick={() => setActiveTab(2)}
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: activeTab === 2 ? '#fff' : 'transparent',
              borderBottom: activeTab === 2 ? '2px solid #00A4A6' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeTab === 2 ? '#fff' : '#f0f0f0'
              }
            }}
          >
            <LinkIcon sx={{ mb: 1, color: '#666' }} />
            <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
              Contact Connections
            </Typography>
          </Box>
        </Box>

        {/* Content Area */}
        {activeTab === 0 && renderProfileContent()}
        {activeTab === 1 && (
          <Box sx={{ p: 4, bgcolor: '#fff' }}>
            <Button
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 2,
                color: '#666',
                borderColor: '#e0e0e0',
                textTransform: 'none',
                justifyContent: 'space-between',
                fontSize: '0.95rem',
                '&:hover': {
                  borderColor: '#00A4A6',
                  bgcolor: 'rgba(0, 164, 166, 0.04)',
                },
              }}
            >
              Click here to change your password
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfileManagement; 