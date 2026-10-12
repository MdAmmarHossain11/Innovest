import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import CopyrightIcon from '@mui/icons-material/Copyright';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import UpdateIcon from '@mui/icons-material/Update';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ background: '#f8fafd', minHeight: '100vh', py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant={isSm ? "h5" : isMd ? "h4" : "h3"}
            sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}
          >
            Terms & Conditions
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isSm ? 12 : 14 }}>
            Last updated: June 2, 2025
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3, md: 4 },
            border: '1px solid #e0e3ea',
            maxWidth: 900,
            mx: 'auto',
          }}
        >
          {/* Introduction */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <GavelIcon color="primary" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Introduction
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            Welcome to Innovest, a platform for startup crowdfunding and investment. By accessing or using our services, you agree to comply with and be bound by these Terms & Conditions. Please read them carefully before using our platform.
          </Typography>

          {/* User Obligations */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VerifiedUserIcon color="success" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              User Obligations
            </Typography>
          </Box>
          <List dense sx={{ mb: 4 }}>
            {[
              "You must provide accurate and complete information during registration and keep your account details up to date.",
              "You are responsible for all activities that occur under your account.",
              "You agree not to use the platform for any unlawful or fraudulent purpose.",
              "You must comply with all applicable laws and regulations while using Innovest."
            ].map((text, i) => (
              <ListItem sx={{ py: 0 }} key={i}>
                <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{ variant: 'body1', color: 'text.secondary', lineHeight: 1.8, fontSize: isSm ? 14 : 16 }}
                />
              </ListItem>
            ))}
          </List>

          {/* Account & Security */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SecurityIcon color="info" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Account & Security
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use or security breach. Innovest is not liable for any loss or damage arising from your failure to protect your account information.
          </Typography>

          {/* Intellectual Property */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CopyrightIcon color="action" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Intellectual Property
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            All content, trademarks, and intellectual property on Innovest are owned by Innovest or its licensors. You may not copy, reproduce, or distribute any content from the platform without prior written consent.
          </Typography>

          {/* Limitation of Liability */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WarningAmberIcon color="warning" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Limitation of Liability
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            Innovest is provided on an "as is" and "as available" basis. We do not guarantee the accuracy, completeness, or reliability of any content. To the fullest extent permitted by law, Innovest disclaims all liability for any damages arising from your use of the platform.
          </Typography>

          {/* Changes to Terms */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <UpdateIcon color="secondary" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Changes to Terms
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            We may update these Terms & Conditions from time to time. Changes will be posted on this page with an updated effective date. Continued use of Innovest after changes constitutes acceptance of the new terms.
          </Typography>

          {/* Contact Us */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ContactMailIcon color="primary" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Contact Us
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            For questions about these Terms & Conditions, please visit our{' '}
            <Link to="/contact" style={{ color: '#ff715a', textDecoration: 'none' }}>
              Contact Us
            </Link>{' '}
            page or email us at innovest05@gmail.com.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsAndConditions; 