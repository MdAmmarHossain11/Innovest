import { API_HOST } from '../config';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Link, Container, Grid, Card, CardMedia, Divider, Chip, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
//import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import authService from '../services/authService';
import AssignmentIcon from '@mui/icons-material/Assignment'; // 📝 Suitable for forms
import LockIcon from '@mui/icons-material/Lock';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Dialog from '@mui/material/Dialog';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link as RouterLink } from 'react-router-dom';


const fallbackImage = 'https://img.freepik.com/free-vector/business-people-office_24908-57140.jpg';


const comments = [
  { name: 'John Doe', message: 'Great initiative!', rating: 5 },
  { name: 'Jane Smith', message: 'Very inspiring story.', rating: 4 },
];

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

const getTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

const formatEventDateTime = (value) => value
  ? `${new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, ${new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}, ${new Date(value).toLocaleDateString('en-US', { weekday: 'long' })}`
  : 'N/A';

const formatCategories = (value) => {
  if (!value) return 'N/A';
  try {
    const categories = typeof value === 'string' && value.startsWith('[') ? JSON.parse(value) : value;
    return Array.isArray(categories) ? categories.join(', ') : categories;
  } catch {
    return value;
  }
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.access) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(`${API_HOST}/api/events/${id}/`, {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`
          }
        });
        setEvent(response.data);
        if (response.data.registration_end) {
          setTimeLeft(getTimeRemaining(response.data.registration_end));
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        const errMsg = err.response?.data?.detail || err.message || 'Failed to fetch event details';
        setError(errMsg);
        if (errMsg === 'Given token not valid for any token type') {
          setLoginDialogOpen(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event?.registration_end) return;

    const timer = setInterval(() => {
      const updated = getTimeRemaining(event.registration_end);
      setTimeLeft(updated);

      if (updated.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event?.registration_end]);

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (error && error === 'Given token not valid for any token type') {
    // Show nothing, dialog will be shown below
  } else if (error) {
    return <Typography align="center" color="error">{error}</Typography>;
  }
  if (!event) return null;

  return (
    <Box sx={{ bgcolor: '#f7f9fb', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.08)', bgcolor: '#fff' }}>
              {/* Image Carousel Placeholder */}
              <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                <CardMedia
                  component="img"
                  height="340"
                  image={event.cover_image || fallbackImage}
                  alt={event.title || 'Event'}
                  sx={{ borderRadius: 3, objectFit: 'cover', width: '100%' }}
                />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#232946', fontSize: { xs: '1.5rem', md: '2.1rem' } }}>
                {event.title || 'Untitled Event'}
              </Typography>

              <Divider sx={{ my: 2, borderColor: '#e0e3ea' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#232946' }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#444', mb: 3, whiteSpace: 'pre-line', fontSize: '1.08rem', lineHeight: 1.8 }}>
                {stripHtml(event.description || 'No description available')}
              </Typography>
              {event.location_link && (
                <Box sx={{ my: 3 }}>
                  <Link href={event.location_link} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </Link>
                </Box>
              )}

            </Card>
          </Grid>
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 32 }}>
              <Card sx={{ mb: 3, p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(80, 80, 180, 0.06)', bgcolor: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#232946' }}>
                  Event Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">Start : <b>{formatEventDateTime(event.start_at)}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">End : <b>{formatEventDateTime(event.end_at)}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Category: <b>{formatCategories(event.categories)}</b></Typography>
                  </Box>
                  {/*<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">Registration Form:{' '}
                      {event.registration_form ? (<Link
                        href={event.registration_form}
                        target="_blank"
                        rel="noopener noreferrer"
                        fontWeight="bold"
                        underline="hover"
                      >
                        {event.registration_form}
                      </Link>
                      ) : (
                        <b>N/A</b>
                      )}
                    </Typography>
                  </Box>*/}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2">Location : <b>{event.location || 'N/A'}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon sx={{ fontSize: 18, color: '#b0b3c7' }} />
                    <Typography variant="body2">
                      Privacy: <b>{event.privacy || 'N/A'}</b>
                    </Typography>
                  </Box>

                  {event.registration_end && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventBusyIcon sx={{ fontSize: 18, color: 'error.main' }} />
                      <Typography variant="body2" color="error">
                        Registration ends: <b>{formatEventDateTime(event.registration_end)}</b>
                        {timeLeft?.total > 0 && (
                          <>
                            <br />
                            <span style={{ fontWeight: 400, color: '#555' }}>
                              [{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left]
                            </span>
                          </>
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
                {/* Registration Button */}
                {event.registration_form && (
                  <Button
                    variant="contained"
                    onClick={() => window.open(event.registration_form, '_blank')}
                    sx={{
                      bgcolor: '#111',
                      color: '#fff',
                      borderRadius: 2, // square shape
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 'none',
                      fontSize: '1.1rem',
                      mt: 2,
                      mb: 2,
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': { bgcolor: '#333' },
                    }}
                  >
                    Registration
                  </Button>
                )}
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Login Required Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 2, textAlign: 'center', minWidth: 340 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Box sx={{ mb: 2 }}>
            <WarningAmberIcon sx={{ fontSize: 60, color: '#f7b928' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Oops...! Something went Wrong !
          </Typography>
          <Typography sx={{ color: '#888', mb: 3 }}>
            You Must be Login Before Explore this page
          </Typography>
          <Button
            variant="contained"
            sx={{ background: '#2d3e70', color: '#fff', borderRadius: 2, px: 4, fontWeight: 700 }}
            component={RouterLink}
            to="/login"
            onClick={() => {
              setLoginDialogOpen(false);
              setError(null);
            }}
          >
            Login
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default EventDetails; 