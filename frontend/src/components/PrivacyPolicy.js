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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));  // phone
  const isMd = useMediaQuery(theme.breakpoints.down('md'));  // tablet

  return (
    <Box sx={{ background: '#f8fafd', minHeight: '100vh', py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant={isSm ? "h5" : isMd ? "h4" : "h3"}
            sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}
          >
            Privacy Policy
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
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Privacy Commitment
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            At Innovest, accessible at innovest.com, protecting your privacy is a core responsibility. This Privacy Policy explains how we collect, use, and safeguard your personal data when you use our startup crowdfunding platform.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            By accessing or using our platform, you agree to the terms outlined in this Privacy Policy. For questions or concerns, you can reach us at innovest05@gmail.com.
          </Typography>

          {/* What Information We Collect */}
          <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
            What Information We Collect
          </Typography>
          <List dense sx={{ mb: 4 }}>
            {[
              "Personal identifiers like your name, email, and phone number when registering.",
              "Company information (for startups), including funding needs and pitch materials.",
              "Investor details such as accreditation status and funding interests.",
              "Payment data handled by secure third-party processors (we never store full card details).",
              "Usage analytics like IP address, device type, and pages visited.",
              "Messages or communications exchanged on the platform."
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

          {/* How We Use Your Data */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              How We Use Your Data
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            Your data enables us to operate and enhance our startup funding ecosystem effectively. Here's how:
          </Typography>

          <List dense sx={{ mb: 4 }}>
            {[
              "Facilitating startup-investor connections.",
              "Enabling campaign creation, investment opportunities, and funding rounds.",
              "Verifying identity and regulatory compliance (e.g., KYC/AML checks).",
              "Processing payments and managing transactions securely.",
              "Sending platform updates, notifications, and optional marketing messages.",
              "Improving user experience through data-driven insights.",
              "Detecting and preventing fraudulent or malicious activity."
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

          {/* Third-Party Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
              Third-Party Websites & Services
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform may link to third-party services like payment gateways, startup profiles, or external analytics tools. We do not control or take responsibility for the privacy practices or the content of these third parties. We encourage you to review the privacy policies of any third-party sites or services you interact with.
          </Typography>

          {/* Contact Us */}
          <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            For privacy-related questions or data access requests, you can also visit our{' '}
            <Link to="/contact" style={{ color: '#ff715a', textDecoration: 'none' }}>
              Contact Us
            </Link>{' '}
            page or email us directly at innovest05@gmail.com. We respond to inquiries promptly in accordance with applicable data protection laws.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
