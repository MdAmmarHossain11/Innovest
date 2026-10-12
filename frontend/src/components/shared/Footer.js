import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#1E1E1E',
                color: '#fff',
                py: 4,
                mt: 'auto',
                width: '100%',
                borderTop: '1px solid #333'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* GET STARTED Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 2.5,
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em'
                        }}>
                            GET STARTED
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link component={RouterLink} to="/start-fundraise" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Start a Fundraise
                            </Link>
                            <Link component={RouterLink} to="/investor-signup" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Investor Signup
                            </Link>
                            <Link component={RouterLink} to="/login" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Account Login
                            </Link>
                        </Box>
                    </Grid>

                    {/* BROWSE Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 2.5,
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em'
                        }}>
                            BROWSE
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link component={RouterLink} to="/trending" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Trending
                            </Link>
                            <Link component={RouterLink} to="/recently-funded" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Recently Funded
                            </Link>
                            <Link component={RouterLink} to="/new-noteworthy" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                New & Noteworthy
                            </Link>
                        </Box>
                    </Grid>

                    {/* RESOURCES Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 2.5,
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em'
                        }}>
                            RESOURCES
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link component={RouterLink} to="/faq" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                FAQ
                            </Link>
                            <Link component={RouterLink} to="/guidelines" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Guidelines
                            </Link>
                            <Link component={RouterLink} to="/contact" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Contact Us
                            </Link>
                        </Box>
                    </Grid>

                    {/* LEGAL Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 2.5,
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em'
                        }}>
                            LEGAL
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Link component={RouterLink} to="/privacy-policy" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Privacy Policy
                            </Link>
                            <Link component={RouterLink} to="/terms-and-conditions" sx={{ 
                                color: '#9E9E9E', 
                                textDecoration: 'none', 
                                fontSize: '0.875rem',
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#fff' } 
                            }}>
                                Terms of Service
                            </Link>
                        </Box>
                        {/* Social Media Links */}
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Link 
                                href="https://twitter.com" 
                                target="_blank" 
                                sx={{ 
                                    color: '#9E9E9E', 
                                    transition: 'color 0.2s ease',
                                    '&:hover': { color: '#fff' },
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <TwitterIcon sx={{ fontSize: 20 }} />
                            </Link>
                            <Link 
                                href="https://linkedin.com" 
                                target="_blank" 
                                sx={{ 
                                    color: '#9E9E9E', 
                                    transition: 'color 0.2s ease',
                                    '&:hover': { color: '#fff' },
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <LinkedInIcon sx={{ fontSize: 20 }} />
                            </Link>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 4, mb: 3, borderColor: '#333' }} />

                {/* Bottom Section */}
                <Box sx={{ pb: 2 }}>
                    <Typography 
                        variant="body2" 
                        color="#9E9E9E" 
                        align="center"
                        sx={{ 
                            fontSize: '0.75rem',
                            opacity: 0.8
                        }}
                    >
                        Copyright © {new Date().getFullYear()} Innovest. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 