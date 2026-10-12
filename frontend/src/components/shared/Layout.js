import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Button, Container, Menu, MenuItem, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import EventIcon from '@mui/icons-material/Event';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import Footer from './Footer';
import ChatbotWidget from '../ChatbotWidget';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [pagesAnchorEl, setPagesAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePagesMenuOpen = (event) => setPagesAnchorEl(event.currentTarget);
  const handlePagesMenuClose = () => setPagesAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleMenuClose();
  };

  const handleMyAccount = () => {
    //navigate('/profile/edit');
    navigate('/dashboard');
    handleMenuClose();
  };

  const handleHelp = () => {
    navigate('/help');
    handleMenuClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const commonButtonStyles = {
    textTransform: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#4B5563',
    px: { xs: 1.5, sm: 2 },
    py: { xs: 0.75, sm: 1 },
    minHeight: '42px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#00A4A6',
    },
    '& .MuiSvgIcon-root': {
      fontSize: { xs: '1rem', sm: '1.2rem' },
      marginRight: '4px',
    },
  };

  const activeButtonStyles = {
    ...commonButtonStyles,
    color: '#00A4A6',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#00A4A6',
    },
  };

  const signInButtonStyles = {
    textTransform: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#00A4A6',
    backgroundColor: 'transparent',
    border: '1px solid #00A4A6',
    borderRadius: '8px',
    px: 3,
    py: 0.8,
    minHeight: '42px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#00A4A6',
      color: 'white',
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 280 },
            backgroundColor: '#ebdef0',
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Innovest</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem
            button
            component={RouterLink}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/browse-companies"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Browse Companies" />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemIcon>
              <LightbulbOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Community" />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem
            button
            onClick={handlePagesMenuOpen}
          >
            <ListItemIcon>
              <KeyboardArrowDownIcon />
            </ListItemIcon>
            <ListItemText primary="Pages" />
          </ListItem>
        </List>
      </Drawer>

      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ebdef0',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, height: { xs: 56, sm: 64 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo/Brand */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Innovest
            </Typography>

            {/* Navigation Links */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              <Button
                component={RouterLink}
                to="/"
                startIcon={<HomeIcon />}
                sx={isActivePath('/') ? activeButtonStyles : commonButtonStyles}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/browse-companies"
                startIcon={<SearchIcon />}
                sx={isActivePath('/browse-companies') ? activeButtonStyles : commonButtonStyles}
              >
                Browse Companies
              </Button>
              <Button
                component={RouterLink}
                to="/community"
                startIcon={<LightbulbOutlinedIcon />}
                sx={isActivePath('/community') ? activeButtonStyles : commonButtonStyles}
              >
                Community
              </Button>
              <Button
                component={RouterLink}
                to="/events"
                startIcon={<EventIcon />}
                sx={isActivePath('/events') ? activeButtonStyles : commonButtonStyles}
              >
                Events
              </Button>
              <Button
                endIcon={<KeyboardArrowDownIcon />}
                sx={commonButtonStyles}
                onClick={handlePagesMenuOpen}
              >
                Pages
              </Button>
              <Menu
                anchorEl={pagesAnchorEl}
                open={Boolean(pagesAnchorEl)}
                onClose={handlePagesMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      borderRadius: '8px',
                      mx: 1,
                      my: 0.5,
                      fontSize: '0.95rem',
                      color: '#4B5563',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 164, 166, 0.08)',
                        color: '#00A4A6',
                      },
                    },
                  },
                }}
              >
                <MenuItem component={RouterLink} to="/about" onClick={handlePagesMenuClose}>
                  About Us
                </MenuItem>
                <MenuItem component={RouterLink} to="/contact" onClick={handlePagesMenuClose}>
                  Contact Us
                </MenuItem>
                <MenuItem component={RouterLink} to="/faq" onClick={handlePagesMenuClose}>
                  FAQ
                </MenuItem>
              </Menu>

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={signInButtonStyles}
                >
                  Sign In
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    startIcon={<PersonOutlineIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleMenuOpen}
                    sx={{
                      ...commonButtonStyles,
                      ml: { xs: 0.5, sm: 1 },
                    }}
                  >
                    My Account
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      elevation: 2,
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                          borderRadius: '8px',
                          mx: 1,
                          my: 0.5,
                          fontSize: '0.95rem',
                          color: '#4B5563',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 164, 166, 0.08)',
                            color: '#00A4A6',
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={handleMyAccount}>
                      <PersonOutlineIcon sx={{ mr: 2, fontSize: 20 }} />
                      <Typography variant="inherit">My Account</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleHelp}>
                      <HelpOutlineIcon sx={{ mr: 2, fontSize: 20 }} />
                      <Typography variant="inherit">Help Center</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: '#EF4444',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          color: '#EF4444',
                        }
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ height: 64 }} /> {/* Spacer for fixed AppBar */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
        {/* <CategoriesSection /> */}
        {/* <HowItWorksSection /> */}
      </Box>
      {location.pathname !== '/admin-dashboard' && <ChatbotWidget />}
      <Footer />
    </Box>
  );
}

export default Layout; 