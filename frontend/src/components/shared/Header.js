import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Header = () => {
    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 600,
                            fontSize: '1.5rem'
                        }}
                    >
                        Innovest
                    </Typography>

                    {/* Navigation Links */}
                    <Stack direction="row" spacing={4} sx={{ flex: 1, justifyContent: 'center' }}>
                        <Button
                            component={RouterLink}
                            to="/browse-companies"
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                        >
                            Browse Companies
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/about"
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            startIcon={<InfoOutlinedIcon />}
                        >
                            About Us
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/contact"
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            startIcon={<ChatOutlinedIcon />}
                        >
                            Contact Us
                        </Button>
                    </Stack>

                    {/* Sign In Button */}
                    <Button
                        component={RouterLink}
                        to="/signin"
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            borderColor: '#00A76F',
                            color: '#00A76F',
                            '&:hover': {
                                borderColor: '#00875C',
                                backgroundColor: 'rgba(0, 167, 111, 0.08)'
                            }
                        }}
                    >
                        Sign In
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header; 