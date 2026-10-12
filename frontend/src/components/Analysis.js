import { API_HOST } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  Divider,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import PieChartIcon from '@mui/icons-material/PieChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const API_URL = `${API_HOST}/api/`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Analysis = () => {
  // Form state
  const [formData, setFormData] = useState({
    industry: '',
    funding_rounds: '',
    funding_amount_m_usd: '',
    valuation_m_usd: '',
    revenue_m_usd: '',
    employees: '',
    market_share_percent: '',
    year_founded: '',
    region: '',
    exit_status: ''
  });

  // UI state
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available options
  const industries = ['AI', 'FinTech', 'HealthTech', 'EdTech', 'IoT', 'Gaming', 'E-Commerce', 'Cybersecurity'];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Australia'];
  const exitStatuses = ['', 'Private', 'IPO', 'Acquired'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // Set up axios interceptor to handle 401 responses
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized error - possibly redirect to login
          console.error('Authentication error:', error);
          setError('Your session has expired. Please log in again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up the interceptor when the component unmounts
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to use this feature');
        setLoading(false);
        return;
      }

      // Prepare the request data
      const requestData = {
        industry: formData.industry || '',
        funding_rounds: formData.funding_rounds ? Number(formData.funding_rounds) : 0,
        funding_amount_m_usd: formData.funding_amount_m_usd ? Number(formData.funding_amount_m_usd) : 0,
        valuation_m_usd: formData.valuation_m_usd ? Number(formData.valuation_m_usd) : 0,
        revenue_m_usd: formData.revenue_m_usd ? Number(formData.revenue_m_usd) : 0,
        employees: formData.employees ? Number(formData.employees) : 0,
        market_share_percent: formData.market_share_percent ? Number(formData.market_share_percent) : 0,
        year_founded: formData.year_founded ? Number(formData.year_founded) : new Date().getFullYear(),
        region: formData.region || ''
      };

      // Validate required fields
      const requiredFields = ['industry', 'region'];
      const missingFields = requiredFields.filter(field => !requestData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Use the configured axios instance which includes the auth token
      const response = await api.post('ml/predict/', requestData);
      
      setPrediction(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  // Calculate years in operation
  const yearsInOperation = formData.year_founded 
    ? new Date().getFullYear() - parseInt(formData.year_founded)
    : 0;

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Redirect to login page if not authenticated
  const redirectToLogin = () => {
    navigate('/login');
  };

  // Show login prompt if not authenticated
  if (!token) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Authentication Required</Typography>
          <Typography variant="body1" paragraph>
            You need to be logged in to access the prediction feature.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={redirectToLogin}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Startup Profitability Predictor
      </Typography>
      
      <Grid container spacing={4}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f1f3' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Enter Startup Details</Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="lg" sx={{ mb: 2 }}>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      label="Industry"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Funding Rounds"
                    name="funding_rounds"
                    type="number"
                    value={formData.funding_rounds}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Funding Amount (৳M)"
                    name="funding_amount_m_usd"
                    type="number"
                    value={formData.funding_amount_m_usd}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Valuation (৳M)"
                    name="valuation_m_usd"
                    type="number"
                    value={formData.valuation_m_usd}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUpIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Revenue (৳M)"
                    name="revenue_m_usd"
                    type="number"
                    value={formData.revenue_m_usd}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUpIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Employees"
                    name="employees"
                    type="number"
                    value={formData.employees}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupsIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Market Share (%)"
                    name="market_share_percent"
                    type="number"
                    value={formData.market_share_percent}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    inputProps={{ step: "0.01" }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PieChartIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year Founded"
                    name="year_founded"
                    type="number"
                    value={formData.year_founded}
                    onChange={handleInputChange}
                    size="small"
                    sx={{ mb: 2 }}
                    inputProps={{ min: "1900", max: new Date().getFullYear().toString() }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="lg" sx={{ mb: 3 }}>
                    <InputLabel>Region</InputLabel>
                    <Select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      label="Region"
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <PublicIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {regions.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="lg" sx={{ mb: 3 }}>
                    <InputLabel>Exit Status</InputLabel>
                    <Select
                      name="exit_status"
                      value={formData.exit_status}
                      onChange={handleInputChange}
                      label="Exit Status"
                      startAdornment={
                        <InputAdornment position="start">
                          <ExitToAppIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {exitStatuses.map((status) => (
                        <MenuItem key={status || 'none'} value={status || ''}>
                          {status || 'Select Exit Status'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Predict Profitability'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f1f3', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Prediction Results</Typography>
            
            {loading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Analyzing startup data...</Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {prediction && (
              <Box>
                <Box 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    bgcolor: prediction.is_profitable ? 'success.light' : 'error.light',
                    color: 'white',
                    textAlign: 'center',
                    mb: 3
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {prediction.is_profitable ? 'Likely Profitable' : 'Likely Not Profitable'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Confidence: {(prediction.probability * 100).toFixed(1)}%
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Key Factors Influencing This Prediction:</Typography>
                <Box sx={{ mb: 3 }}>
                  {(() => {
                    // Calculate impact scores based on company data
                    const factors = [];
                    const formValues = formData;
                    
                    // Helper to add a factor with impact
                    const addFactor = (name, value, weight, format = (v) => v) => {
                      if (value !== undefined && value !== '') {
                        // Calculate a dynamic impact score based on the value and weight
                        const baseScore = Math.min(100, Math.max(5, weight * 100));
                        const valueImpact = typeof value === 'number' 
                          ? Math.min(1.5, 1 + (Math.abs(value - 50) / 100)) 
                          : 1;
                        const impact = Math.min(100, Math.round(baseScore * valueImpact));
                        
                        factors.push({
                          name,
                          value: format(value),
                          impact,
                          isPositive: value > 50 // Simple heuristic - can be adjusted
                        });
                      }
                    };

                    // Add factors with their weights (sum should be ~1.0)
                    addFactor('Valuation', parseFloat(formValues.valuation_m_usd), 0.3, v => `৳${v}M`);
                    addFactor('Funding Amount', parseFloat(formValues.funding_amount_m_usd), 0.25, v => `৳${v}M`);
                    addFactor('Market Share', parseFloat(formValues.market_share_percent), 0.2, v => `${v}%`);
                    addFactor('Team Size', parseInt(formValues.employees), 0.15, v => `${v} employees`);
                    addFactor('Years in Operation', 
                      formValues.year_founded ? new Date().getFullYear() - parseInt(formValues.year_founded) : 0, 
                      0.1,
                      v => `${v} years`
                    );

                    // Sort by impact (highest first)
                    factors.sort((a, b) => b.impact - a.impact);

                    // Get top 3 factors
                    const topFactors = factors.slice(0, 3);

                    return (
                      <Box>
                        {topFactors.map((factor, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {factor.name}: {factor.value}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: factor.isPositive ? 'success.main' : 'warning.main',
                                fontWeight: 600
                              }}>
                                {factor.impact}% Impact
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              width: '100%', 
                              height: 6, 
                              bgcolor: 'grey.200',
                              borderRadius: 3,
                              overflow: 'hidden'
                            }}>
                              <Box 
                                sx={{
                                  width: `${factor.impact}%`,
                                  height: '100%',
                                  bgcolor: factor.isPositive ? 'success.main' : 'warning.main',
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    );
                  })()}
                </Box>

                {(() => {
                  const suggestions = [];
                  const formValues = formData;
                  
                  // Helper function to add suggestion if condition is true
                  const addSuggestion = (condition, message) => {
                    if (condition) suggestions.push(message);
                  };

                  // Analyze funding amount
                  addSuggestion(
                    parseFloat(formValues.funding_amount_m_usd) < 5,
                    `Increase funding amount (current: ৳${formValues.funding_amount_m_usd}M). Consider seeking additional investment to support growth.`
                  );

                  // Analyze employee count
                  addSuggestion(
                    parseInt(formValues.employees) > 100 && !prediction.is_profitable,
                    `Optimize team size (current: ${formValues.employees} employees). Consider rightsizing or improving operational efficiency.`
                  );

                  // Analyze market share
                  addSuggestion(
                    parseFloat(formValues.market_share_percent) < 5,
                    `Grow market share (current: ${formValues.market_share_percent}%). Focus on customer acquisition and retention strategies.`
                  );

                  // Analyze years in operation
                  const yearsInOperation = formValues.year_founded ? new Date().getFullYear() - parseInt(formValues.year_founded) : 0;
                  addSuggestion(
                    yearsInOperation > 5 && !prediction.is_profitable,
                    `After ${yearsInOperation} years, consider pivoting your business model or exploring new revenue streams.`
                  );

                  // Add default suggestions if no specific ones apply
                  if (suggestions.length === 0) {
                    if (prediction.is_profitable) {
                      suggestions.push("Continue monitoring key metrics to sustain profitability.");
                    } else {
                      suggestions.push("Analyze your business model and cost structure for potential improvements.");
                    }
                  }

                  return (
                    <Box sx={{ 
                      mb: 3, 
                      p: 2, 
                      bgcolor: prediction.is_profitable ? 'success.light' : 'warning.light', 
                      color: 'white', 
                      borderRadius: 1 
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {prediction.is_profitable ? '🌟 Growth Opportunities:' : '🔍 Improvement Suggestions:'}
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                        {suggestions.map((suggestion, index) => (
                          <li key={index}>
                            <Typography variant="body2">{suggestion}</Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  );
                })()}

                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Note: This prediction is based on historical data and statistical models. Actual results may vary.
                </Typography>
              </Box>
            )}

            {!prediction && !loading && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '400px',
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  p: 3,
                  background: 'linear-gradient(145deg, #f5f7fa 0%, #eef2f5 100%)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(25, 118, 210, 0.1)',
                    zIndex: 0
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '16px' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#1976D2"/>
                    <path d="M13 7H11V13H17V11H13V7Z" fill="#1976D2"/>
                  </svg>
                  
                  <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                    AI-Powered Profitability Analysis
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '600px' }}>
                    Our advanced machine learning model analyzes your startup's metrics to predict profitability with high accuracy.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                    gap: 2, 
                    width: '100%',
                    maxWidth: '800px',
                    mb: 3
                  }}>
                    {[
                      { icon: '📊', title: 'Data-Driven', desc: 'Analyzes 100+ data points' },
                      { icon: '🧠', title: 'ML-Powered', desc: 'XGBoost algorithm' },
                      { icon: '⚡', title: 'Real-time', desc: 'Instant predictions' }
                    ].map((item, index) => (
                      <Paper key={index} elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'white' }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>{item.icon}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                      </Paper>
                    ))}
                  </Box>
                  
                  {/*<Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2, px: 4, py: 1, borderRadius: 2 }}
                    onClick={() => document.getElementById('prediction-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started
                  </Button>*/}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analysis;