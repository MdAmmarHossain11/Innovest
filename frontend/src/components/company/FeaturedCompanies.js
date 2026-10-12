import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Link,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import companyService from '../../services/companyService';

const FeaturedCompanies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);


  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestCompanies = async () => {
      try {
        setLoading(true);
        const data = await companyService.getCompanies();
        // Sort by created_at in descending order and take the latest 10
        const sortedCompanies = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
          : [];

        // Fetch paid investors count for each company
        const companiesWithInvestorCount = await Promise.all(
          sortedCompanies.map(async (company) => {
            try {
              const paidInvestorsCount = await companyService.getPaidInvestorsCount(company.id);
              return {
                ...company,
                paidInvestorsCount
              };
            } catch (error) {
              console.error(`Error fetching paid investors count for company ${company.id}:`, error);
              return {
                ...company,
                paidInvestorsCount: 0
              };
            }
          })
        );

        setCompanies(companiesWithInvestorCount);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load featured companies');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCompanies();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return null; // Hide the section if there's an error
  }

  if (companies.length === 0) {
    return null; // Hide the section if no companies
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
      <Container maxWidth="xl">
        {/* Featured Companies Component */}
        <Box sx={{ py: 4, background: '#fff' }}>
          <Container maxWidth="auto">
            <Fade in={animate} timeout={2000}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2c3e50' }}>
                  Featured Startups
                </Typography>
                <Typography variant="h6" sx={{ color: '#7f8c8d', maxWidth: 600, mx: 'auto' }}>
                  Discover innovative companies raising funds on our platform
                </Typography>
              </Box>
            </Fade>
          </Container>
        </Box>

        <Box sx={{ position: 'relative', width: '100%', px: { xs: 1, sm: 2 } }}>
          <Grid container spacing={3} justifyContent="center">
            {companies.slice(0, 8).map((company) => (
              <Grid item key={company.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  component={RouterLink}
                  to={`/companies/${company.id}`}
                  sx={{
                    height: 370,
                    minHeight: 370,
                    maxHeight: 370,
                    width: 285,
                    minWidth: 285,
                    maxWidth: 285,
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px rgba(80,80,180,0.08)',
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: 6
                    },
                    bgcolor: '#fff',
                    p: 0.5,
                    mx: 'auto',
                  }}
                >
                  {/* Company Image */}
                  <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', height: 110, mb: 1 }}>
                    <CardMedia
                      component="img"
                      height="110"
                      image={
                        company.cover_image ||
                        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`
                      }
                      alt={company.product_name}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if default image fails
                        e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`;
                      }}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2, pt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 210, maxHeight: 210 }}>
                    {/* Company Name */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, fontSize: '1.08rem', mb: 0.5, color: '#222', minHeight: 32 }}
                    >
                      {company.product_name}
                    </Typography>
                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, minHeight: 36, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {company.quick_description}
                    </Typography>
                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip label={company.industry || 'Industry'} size="small" sx={{ bgcolor: '#e6eaff', color: '#2d3e70', fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }} />
                      {/* <Chip label="SEIS" size="small" sx={{ bgcolor: '#eafff3', color: '#1b8e5a', fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }} />*/}
                      {/* Country flag chip */}
                      {company.country && (
                        <Chip
                          label={company.state || 'State'}
                          size="small"
                          icon={<span style={{ fontSize: 18, marginLeft: 4 }}>{getCountryFlag(company.country)}</span>}
                          sx={{ bgcolor: '#f5f5f5', color: '#222', fontWeight: 700, fontSize: '0.8rem', borderRadius: 2 }}
                        />
                      )}
                    </Box>
                    {/* Progress Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: '#5f5fff', fontSize: '1rem', mr: 1 }}>
                        {company.total_payments ? formatLargeNumber(company.total_payments) : '৳0'} raised
                      </Typography>
                      <Typography sx={{ color: '#888', fontWeight: 500, fontSize: '0.95rem', mr: 1 }}>
                        - {company.fundraise_terms && company.fundraise_terms.duration || 'Duration'}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Box sx={{ width: '100%', height: 7, borderRadius: 4, background: '#e3e6f5', overflow: 'hidden' }}>
                        <Box sx={{
                          width: company.fundraise_terms && company.fundraise_terms.raise_amount
                            ? `${(company.total_payments / company.fundraise_terms.raise_amount * 100)}%`
                            : '0%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #5f5fff 0%, #a685ff 100%)',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    {/* Stats Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Type</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                          {company.fundraise_terms?.investment_type
                            ? company.fundraise_terms.investment_type.split(' ').map(word =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')
                            : 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Target</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                          {company.fundraise_terms && company.fundraise_terms.raise_amount
                            ? formatLargeNumber(company.fundraise_terms.raise_amount)
                            : '৳0'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Investors</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                          {company.paidInvestorsCount !== undefined
                            ? company.paidInvestorsCount
                            : '0'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/*<Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            component={RouterLink}
            to="/browse-companies"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'rgba(0, 167, 111, 0.08)'
              }
            }}
          >
            View More Companies
          </Button>
        </Box>*/}
        <Box sx={{
          textAlign: 'center',
          mt: { xs: 4, sm: 5, md: 6 },
          px: { xs: 2, sm: 0 }
        }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => window.location.assign('/browse-companies')}
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
            View More Companies
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Helper function for country flag emoji
function getCountryFlag(country) {
  if (!country) return '🌐';
  switch (country.toLowerCase()) {
    case 'ksa': return '🇸🇦';
    case 'eng': return '🏴';
    case 'usa': return '🇺🇸';
    case 'pak': return '🇵🇰';
    default: return '🌐';
  }
}

// Helper function to format large numbers
function formatLargeNumber(number) {
  if (number >= 1000000) {
    return `৳${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `৳${(number / 1000).toFixed(1)}K`;
  }
  return `৳${number.toLocaleString()}`;
}

export default FeaturedCompanies; 
