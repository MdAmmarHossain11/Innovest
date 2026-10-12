import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, useTheme, useMediaQuery } from '@mui/material';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

const features = [
  {
    icon: <WorkOutlineOutlinedIcon sx={{ fontSize: 36, color: '#00A4A6' }} />,
    title: 'Find your passionate project',
    desc: 'Finding your passionate project can be an exciting and rewarding experience that allows you to pursue your interests and make a positive impact in the world.',
  },
  {
    icon: <SavingsOutlinedIcon sx={{ fontSize: 36, color: '#00A4A6' }} />,
    title: 'Invest your savings on project',
    desc: 'Investing your savings in a project can be a great way to potentially earn a higher return on your money than you would by leaving it in a savings account.',
  },
  {
    icon: <PaidOutlinedIcon sx={{ fontSize: 36, color: '#00A4A6' }} />,
    title: 'Get return from investment',
    desc: 'Getting a return from an investment typically involves earning a profit on the money you have invested. There are several ways to earn a return on an investment.',
  },
];

export default function BusinessTrendsAndHowItWorks() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {/* How It Works Section */}
      <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: '#f8fafd', px: { xs: 1, sm: 2, md: 4 } }}>
        <Grid
          container
          spacing={isXs ? 2 : 4}
          alignItems="center"
          justifyContent="center"
          direction={isXs ? 'column-reverse' : 'row'}
        >
          <Grid item xs={12} md={5} sx={{ textAlign: isXs ? 'center' : 'left', mb: isXs ? 3 : 0 }}>
            <Typography
              variant={isXs ? "h5" : "h4"}
              fontWeight={700}
              mb={2}
              sx={{ color: '#0a174e' }}
            >
              An Exploration of<br />How It Works
            </Typography>
            <Typography color="text.secondary" mb={3} sx={{ fontSize: isXs ? '1rem' : '1.1rem' }}>
              A fundraising company typically works by partnering with organisations, charities, or individuals to help them raise money for a specific cause or project. The company provides a variety of fundraising services, such as marketing, event planning, and donor management, to help their clients achieve their fundraising.
            </Typography>
            {/*<Button
              variant="contained"
              onClick={handleCreateAccount}
              sx={{
                fontWeight: 600,
                px: { xs: 3, sm: 4 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(95, 95, 255, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(95, 95, 255, 0.4)'
                },
                minWidth: 200
              }}
            >
              Create an Account
            </Button>*/}
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid
              container
              spacing={isXs ? 2 : 3}
              justifyContent="center"
            >
              {features.map((f, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  key={f.title}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: isXs ? 2 : 0
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: 4,
                      bgcolor: '#fff',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      height: '100%',
                      minWidth: 220,
                      maxWidth: 320,
                      width: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.03)',
                        boxShadow: '0 8px 24px rgba(0,164,166,0.10)',
                        bgcolor: '#f0f8ff'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        border: '2px dashed #00A4A6',
                        color: '#00A4A6',
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {f.icon}
                    </Avatar>
                    <Typography fontWeight={700} mb={1} sx={{ color: '#0a174e', fontSize: { xs: '1.05rem', sm: '1.12rem' } }}>
                      {f.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize={isXs ? "0.97rem" : "1rem"}>
                      {f.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
} 