import { API_HOST } from '../config';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import axios from 'axios';

const services = [
  {
    icon: <SecurityIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />,
    title: 'Secure Platform',
    description: 'State-of-the-art security measures to protect your investments and data.',
  },
  {
    icon: <HandshakeIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />,
    title: 'Expert Support',
    description: 'Dedicated team of investment professionals to guide you through the process.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />,
    title: '24/7 Assistance',
    description: 'Round-the-clock support for all your investment needs and queries.',
  },
];

const testimonials = [
  {
    name: 'Ahmed Rahman',
    role: 'Angel Investor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'The platform has transformed how I discover and invest in promising startups. The due diligence tools are invaluable.',
  },
  {
    name: 'Tanvir Hasan',
    role: 'Venture Capitalist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Outstanding platform for finding high-potential investment opportunities. The process is streamlined and efficient.',
  },
];

const clientLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0d/City-Group-Logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Walton_Group_Logo.png/640px-Walton_Group_Logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Seal_of_Square_Group.svg/640px-Seal_of_Square_Group.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/MGI_Logo.png/640px-MGI_Logo.png',
  'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/ACI_logo.svg/1920px-ACI_logo.svg.png',
];

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animate, setAnimate] = useState(false);
  const [stats, setStats] = useState([
    { icon: <BusinessCenterIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: '0', label: 'Companies Listed' },
    { icon: <GroupsIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: '0', label: 'Active Investors' },
    { icon: <TrendingUpIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: '0', label: 'Total Investments' },
  ]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setAnimate(true);
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_HOST}/api/statistics/`);
      if (response.data.status === 'success') {
        const data = response.data.data;
        setStats([
          { icon: <BusinessCenterIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: data.total_companies.toString(), label: 'Companies Listed' },
          { icon: <GroupsIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: data.total_users.toString(), label: 'Active Investors' },
          { icon: <TrendingUpIcon sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }} />, value: data.total_paid_payments.toString(), label: 'Total Investments' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Keep default values if API fails
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `
            linear-gradient(45deg, rgba(26, 35, 126, 0.9) 30%, rgba(13, 71, 161, 0.9) 90%),
            url('/images/aboutUs-illustration.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 6, sm: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h4' : 'h2'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Transforming Investment Opportunities
              </Typography>
              <Typography
                variant={isMobile ? 'body1' : 'h5'}
                sx={{ mb: 4, opacity: 0.9, maxWidth: { xs: '100%', md: '90%' } }}
              >
                We connect innovative companies with visionary investors to create lasting impact.
              </Typography>
              
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Container maxWidth="xl">
          <Fade in={animate} timeout={1500}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#232946', letterSpacing: '-1px', fontSize: { xs: '2rem', md: '2.7rem' } }}>
                Why Choose Innovest?
        </Typography>
              <Typography variant="h6" sx={{ color: '#7f8c8d', maxWidth: 600, mx: 'auto', fontWeight: 500 }}>
                Everything you need to successfully raise funds for your startup
        </Typography>
            </Box>
          </Fade>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in={animate} timeout={1500 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 4,
                      p: 3,
                      textAlign: 'center',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
                      border: '1.5px solid rgba(120, 119, 198, 0.10)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.03)',
                        boxShadow: '0 16px 40px 0 rgba(31, 38, 135, 0.18)',
                        background: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(120, 119, 198, 0.18)',
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '5px',
                        background: 'linear-gradient(90deg, #6c63ff 0%, #4ecdc4 100%)',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        opacity: 0.7,
                      }
                    }}
                    elevation={0}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 70,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.15) rotate(-6deg)',
                        }
                      }}
                    >
                      {React.cloneElement(service.icon, {
                        sx: { fontSize: 54, color: '#6c63ff', transition: 'color 0.3s', '&:hover': { color: '#4ecdc4' } }
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#232946', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500, fontSize: '1.05rem', minHeight: 48 }}>
                      {service.description}
                    </Typography>
              </Card>
                </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 4, sm: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {loadingStats ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              </Grid>
            ) : (
              stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{stat.icon}</Box>
                  <Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    component="div"
                    sx={{ fontWeight: 700 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant={isMobile ? 'body2' : 'h6'} color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 10 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          What Our Users Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ height: '100%', boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={testimonial.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" component="div" sx={{ fontSize: { xs: 16, sm: 18 } }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                    "{testimonial.text}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Client Logos Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Trusted by Leading Companies
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            {clientLogos.map((logo, index) => (
              <Grid item xs={4} sm={3} md={2} key={index}>
                <Box
                  component="img"
                  src={logo}
                  alt={`Client Logo ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 120,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                    transition: 'opacity 0.3s',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
