import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const categories = [
  'Food',
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Entertainment',
  'Transportation',
  'Retail',
  'Other'
];

const ShareIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    attachment: null
  });

  const [ideas, setIdeas] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Submitting idea:', formData);
    // For now, just add it to the local state
    setIdeas(prev => [...prev, formData]);
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      attachment: null
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        component={RouterLink}
        to="/dashboard"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 4,
          color: '#666',
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'transparent',
            color: '#444'
          }
        }}
      >
        Back to Dashboard
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          bgcolor: '#fff',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#178de2',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Share Your Innovative Idea
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              placeholder="What's your idea called?"
              required
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa'
                }
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={6}
              fullWidth
              placeholder="Tell us about your idea..."
              required
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa'
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
                required
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa'
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: 'rgba(0, 0, 0, 0.12)',
                borderRadius: 2,
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
            >
              <input
                type="file"
                id="file-upload"
                hidden
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <IconButton
                  component="span"
                  sx={{
                    mb: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  <CloudUploadIcon />
                </IconButton>
                <Typography display="block" variant="subtitle1" gutterBottom>
                  {formData.attachment ? formData.attachment.name : 'Upload Attachment'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop or click to upload
                </Typography>
              </label>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 2,
                borderRadius: 2,
                backgroundColor: '#178de2',
                '&:hover': { 
                  backgroundColor: '#0066FF',
                },
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 135, 62, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0, 135, 62, 0.25)',
                  backgroundColor: '#0066FF'
                }
              }}
            >
              Submit Idea
            </Button>
          </Stack>
        </form>
      </Paper>

      
    </Container>
  );
};

export default ShareIdea; 