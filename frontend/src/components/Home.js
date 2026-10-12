import { API_HOST } from '../config';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Grow,
  Zoom,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow,
  TrendingUp,
  People,
  Business,
  RocketLaunch,
  ArrowForward,
  Star,
  CheckCircle,
  Lightbulb,
  MonetizationOn,
  Security,
  Speed
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FeaturedCompanies from './company/FeaturedCompanies';
import ThreeDAnimation from './home/ThreeDAnimation';
import BusinessTrendsAndHowItWorks from './home/BusinessTrendsAndHowItWorks';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [animate, setAnimate] = useState(false);
  const [stats, setStats] = useState([
    { number: "0", label: "Total Companies" },
    { number: "0", label: "Active Investors" },
    { number: "0", label: "Startups Funded" },
    { number: "85%", label: "Success Rate" }
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
          { number: data.total_companies.toString(), label: "Total Companies" },
          { number: data.total_users.toString(), label: "Active Investors" },
          { number: data.total_paid_payments.toString(), label: "Startups Funded" },
          { number: `${data.success_rate}%`, label: "Success Rate" }
        ]);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Keep default values if API fails
    } finally {
      setLoadingStats(false);
    }
  };

  const features = [
    {
      icon: <RocketLaunch sx={{ fontSize: 40, color: '#6c63ff' }} />,
      title: "Launch Your Startup",
      description: "Create compelling fundraising campaigns with professional tools"
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#6c63ff' }} />,
      title: "Connect with Investors",
      description: "Access a network of accredited investors worldwide"
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#6c63ff' }} />,
      title: "Track Progress",
      description: "Monitor your fundraising progress in real-time"
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#6c63ff' }} />,
      title: "Secure Platform",
      description: "Bank-level security for all your financial transactions"
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            zIndex: 1
          }
        }}
      >
        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 2
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: 150,
            height: 150,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
            zIndex: 2
          }}
        />

        {/* 3D Animation Background */}
        <ThreeDAnimation />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 3,
            pl: { xs: 2, md: 4 },
            pr: { xs: 2, md: 'auto' }
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={animate} timeout={1000}>
                <Box>
                  <Chip
                    icon={<Star />}
                    label="Leading Startup Platform"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      mb: 3,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4.5rem' },
                      fontWeight: 800,
                      mb: 3,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Transform Your
                    <Box component="span" sx={{
                      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'block'
                    }}>
                      Startup Dreams
                    </Box>
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 400,
                      mb: 4,
                      opacity: 0.95,
                      lineHeight: 1.6,
                      maxWidth: '540px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(45deg, #ffffff 0%, #e3f2fd 50%, #bbdefb 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'white',
                      '&::selection': {
                        background: 'rgba(108, 99, 255, 0.3)',
                        color: 'white'
                      }
                    }}
                  >
                    Join thousands of successful startups that have raised millions through our innovative fundraising platform.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      endIcon={<ArrowForward />}
                      sx={{
                        fontSize: '1.125rem',
                        py: 2,
                        px: 4,
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        borderRadius: '50px',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff5252, #26a69a)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(255, 107, 107, 0.6)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Start Fundraising
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrow />}
                      component="a"
                      href="https://youtu.be/rhru93yFNVw"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: '1.125rem',
                        py: 2,
                        px: 4,
                        textTransform: 'none',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        textDecoration: 'none',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                          textDecoration: 'none'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide direction="left" in={animate} timeout={1200}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4,
                    p: 3,
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
                      Quick Stats
                    </Typography>
                    <Grid container spacing={2}>
                      {loadingStats ? (
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress size={20} />
                          </Box>
                        </Grid>
                      ) : (
                        stats.map((stat, index) => (
                          <Grid item xs={6} key={index}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4ecdc4' }}>
                                {stat.number}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                {stat.label}
                              </Typography>
                            </Box>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
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
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
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
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 54, color: '#6c63ff', transition: 'color 0.3s', '&:hover': { color: '#4ecdc4' } }
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#232946', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500, fontSize: '1.05rem', minHeight: 48 }}>
                      {feature.description}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <FeaturedCompanies />
      <BusinessTrendsAndHowItWorks />

      {/* CTA Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8fafd 0%, #e0e7ff 100%)' }}>
        <Container maxWidth="lg">
          <Zoom in={animate} timeout={3000}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.85)',
                borderRadius: 5,
                p: { xs: 3, sm: 6 },
                textAlign: 'center',
                color: '#0a174e',
                boxShadow: '0 12px 40px 0 rgba(95, 95, 255, 0.10)',
                border: '2px solid',
                borderColor: 'rgba(108,99,255,0.10)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              }}
            >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 8,
                background: 'linear-gradient(90deg, #6c63ff 0%, #4ecdc4 100%)',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                opacity: 0.8,
              }} />
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#232946', letterSpacing: '-1px', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Ready to Start Your Journey?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.92, color: '#4b5563', fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Join thousands of successful entrepreneurs who have transformed their ideas into reality
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<RocketLaunch />}
                sx={{
                  fontWeight: 700,
                  px: { xs: 4, sm: 6 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.15rem' },
                  borderRadius: 3,
                  textTransform: 'none',
                  background: 'linear-gradient(90deg, #6c63ff 0%, #4ecdc4 100%)',
                  color: '#fff',
                  boxShadow: '0 6px 24px rgba(76,205,196,0.18)',
                  minWidth: 220,
                  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #4ecdc4 0%, #6c63ff 100%)',
                    transform: 'translateY(-4px) scale(1.04)',
                    boxShadow: '0 12px 32px rgba(76,205,196,0.22)',
                  },
                }}
              >
                Get Started Today
              </Button>
            </Card>
          </Zoom>
        </Container>
      </Box>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
}

export default Home;