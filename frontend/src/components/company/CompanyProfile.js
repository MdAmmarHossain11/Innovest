import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import LockIcon from '@mui/icons-material/Lock';

// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function CompanyProfile() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pt: 3, pb: 6 }}>
      <Container maxWidth="lg">
        {/* Company Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              EarthEn
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Efficient Energy Storage through CO₂
            </Typography>
          </Box>
          <IconButton aria-label="add to favorites">
            <StarBorderIcon />
          </IconButton>
        </Box>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} md={8}>
            {/* Company Banner */}
            <Paper 
              sx={{ 
                mb: 3, 
                overflow: 'hidden',
                bgcolor: '#003366',
                color: 'white',
                p: 4,
                position: 'relative'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                  Efficient Energy Storage through CO₂
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="contained" color="primary" size="large">
                    Share
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Tabs Navigation */}
            <Paper sx={{ mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }
                }}
              >
                <Tab label="Profile" />
                <Tab label="Business Plan" />
                <Tab label="Updates" />
              </Tabs>

              {/* Tab Content */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    The Problem
                  </Typography>
                  <Typography paragraph>
                    Renewable energy is predicted to supply 45-50% of the world's electricity by 2023.
                    The grid needs to decarbonize, but solar and wind are not always active. A flexible-duration
                    energy storage gap in the grid for economic, safe, temperature, lifecycle, and duration needs.
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Our Solution
                  </Typography>
                  <Typography paragraph>
                    EarthEn offers Long-duration energy storage using advanced thermo-mechanical
                    systems, enabling customers to store renewable power efficiently and access
                    affordable, reliable energy anytime to meet growing global electricity demands.
                  </Typography>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Business Plan
                  </Typography>
                  <Typography color="text.secondary">
                    This content is private. Request access to view the business plan.
                  </Typography>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Company Updates
                  </Typography>
                  <Typography color="text.secondary">
                    No updates available at this time.
                  </Typography>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>

          {/* Right Column - Info Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <LockIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Private Fundraise
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  This company may be interested in raising funds from accredited investors.
                  You must Request Access to see more information about this company.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  endIcon={<ShareIcon />}
                >
                  Request Access
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CompanyProfile; 