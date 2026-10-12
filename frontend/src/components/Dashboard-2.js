import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

const Analysis = () => {
  // Analysis tab states
  const [industryFilter, setIndustryFilter] = useState('all');
  const [fundingFilter, setFundingFilter] = useState('all');
  const [profitabilityFilter, setProfitabilityFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [startupData, setStartupData] = useState([]);

  // Load startup data
  useEffect(() => {
    // In a real application, this would be an API call
    const data = [
      {
        name: 'FinTech_1',
        industry: 'FinTech',
        funding: 101.09,
        valuation: 844.75,
        revenue: 67.87,
        profitable: true,
        region: 'north-america'
      },
      {
        name: 'AI_1',
        industry: 'AI',
        funding: 250.50,
        valuation: 1500.00,
        revenue: 120.30,
        profitable: false,
        region: 'europe'
      },
      {
        name: 'HealthTech_1',
        industry: 'HealthTech',
        funding: 75.25,
        valuation: 450.00,
        revenue: 45.60,
        profitable: true,
        region: 'asia'
      },
      {
        name: 'EdTech_1',
        industry: 'EdTech',
        funding: 45.80,
        valuation: 320.00,
        revenue: 30.20,
        profitable: false,
        region: 'north-america'
      },
      {
        name: 'IoT_1',
        industry: 'IoT',
        funding: 180.90,
        valuation: 900.00,
        revenue: 85.40,
        profitable: true,
        region: 'europe'
      },
      {
        name: 'Gaming_1',
        industry: 'Gaming',
        funding: 520.75,
        valuation: 2500.00,
        revenue: 200.30,
        profitable: true,
        region: 'asia'
      },
      {
        name: 'Cybersecurity_1',
        industry: 'Cybersecurity',
        funding: 150.25,
        valuation: 750.00,
        revenue: 65.80,
        profitable: false,
        region: 'north-america'
      }
    ];
    setStartupData(data);
    setFilteredStartups(data);
  }, []);

  // Filter startups based on selected criteria
  useEffect(() => {
    let filtered = [...startupData];

    if (industryFilter !== 'all') {
      filtered = filtered.filter(startup => 
        startup.industry.toLowerCase() === industryFilter.toLowerCase()
      );
    }

    if (fundingFilter !== 'all') {
      const [min, max] = fundingFilter.split('-').map(Number);
      filtered = filtered.filter(startup => {
        if (max) {
          return startup.funding >= min && startup.funding <= max;
        } else {
          return startup.funding >= min;
        }
      });
    }

    if (profitabilityFilter !== 'all') {
      filtered = filtered.filter(startup => 
        startup.profitable === (profitabilityFilter === 'profitable')
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(startup => 
        startup.region.toLowerCase() === regionFilter.toLowerCase()
      );
    }

    setFilteredStartups(filtered);
  }, [industryFilter, fundingFilter, profitabilityFilter, regionFilter, startupData]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Startup Insights: Predict Growth, Profitability, and Unicorn Potential
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Interactive Machine Learning-powered analysis of startup data to predict profitability, estimate unicorn potential, and uncover industry trends.
      </Typography>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="subtitle2" color="text.secondary">Total Startups</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>500</Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>Active Companies</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="subtitle2" color="text.secondary">Unicorn Potential</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>23%</Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>High Growth Potential</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="subtitle2" color="text.secondary">Profitable Startups</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>42%</Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>Current Rate</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="subtitle2" color="text.secondary">Avg. Funding</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>৳156M</Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>Per Startup</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Industry Distribution Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Industry Distribution</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'FinTech', value: 25 },
                      { name: 'AI', value: 20 },
                      { name: 'HealthTech', value: 15 },
                      { name: 'EdTech', value: 15 },
                      { name: 'IoT', value: 10 },
                      { name: 'Gaming', value: 8 },
                      { name: 'Cybersecurity', value: 7 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'FinTech', value: 25 },
                      { name: 'AI', value: 20 },
                      { name: 'HealthTech', value: 15 },
                      { name: 'EdTech', value: 15 },
                      { name: 'IoT', value: 10 },
                      { name: 'Gaming', value: 8 },
                      { name: 'Cybersecurity', value: 7 }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Funding Trends Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Funding Trends by Industry</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'FinTech', funding: 250, valuation: 1800 },
                    { name: 'AI', funding: 200, valuation: 1500 },
                    { name: 'HealthTech', funding: 180, valuation: 1200 },
                    { name: 'EdTech', funding: 150, valuation: 1000 },
                    { name: 'IoT', funding: 120, valuation: 800 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="funding" fill="#8884d8" name="Avg. Funding (৳M)" />
                  <Bar dataKey="valuation" fill="#82ca9d" name="Avg. Valuation (৳M)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Predictive Analytics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Predictive Analytics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Profitability Prediction</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Model Accuracy: 85%</Typography>
                  <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Key Factors:</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Market Share" secondary="Impact: 35%" />
                    <LinearProgress variant="determinate" value={35} sx={{ width: 100 }} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Funding Amount" secondary="Impact: 25%" />
                    <LinearProgress variant="determinate" value={25} sx={{ width: 100 }} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Industry Type" secondary="Impact: 20%" />
                    <LinearProgress variant="determinate" value={20} sx={{ width: 100 }} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Unicorn Potential</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Model Accuracy: 78%</Typography>
                  <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Key Factors:</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Valuation Growth" secondary="Impact: 40%" />
                    <LinearProgress variant="determinate" value={40} sx={{ width: 100 }} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Funding Rounds" secondary="Impact: 30%" />
                    <LinearProgress variant="determinate" value={30} sx={{ width: 100 }} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Revenue Growth" secondary="Impact: 30%" />
                    <LinearProgress variant="determinate" value={30} sx={{ width: 100 }} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Dataset Explorer */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Dataset Explorer</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Industry"
                  variant="outlined"
                  size="small"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Industries</MenuItem>
                  <MenuItem value="fintech">FinTech</MenuItem>
                  <MenuItem value="ai">AI</MenuItem>
                  <MenuItem value="healthtech">HealthTech</MenuItem>
                  <MenuItem value="edtech">EdTech</MenuItem>
                  <MenuItem value="iot">IoT</MenuItem>
                  <MenuItem value="gaming">Gaming</MenuItem>
                  <MenuItem value="cybersecurity">Cybersecurity</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Funding Range"
                  variant="outlined"
                  size="small"
                  value={fundingFilter}
                  onChange={(e) => setFundingFilter(e.target.value)}
                >
                  <MenuItem value="all">All Ranges</MenuItem>
                  <MenuItem value="0-50">৳0-50M</MenuItem>
                  <MenuItem value="50-100">৳50-100M</MenuItem>
                  <MenuItem value="100-500">৳100-500M</MenuItem>
                  <MenuItem value="500">৳500M+</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Profitability"
                  variant="outlined"
                  size="small"
                  value={profitabilityFilter}
                  onChange={(e) => setProfitabilityFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="profitable">Profitable</MenuItem>
                  <MenuItem value="non-profitable">Non-Profitable</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Region"
                  variant="outlined"
                  size="small"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <MenuItem value="all">All Regions</MenuItem>
                  <MenuItem value="north-america">North America</MenuItem>
                  <MenuItem value="europe">Europe</MenuItem>
                  <MenuItem value="asia">Asia</MenuItem>
                  <MenuItem value="australia">Australia</MenuItem>
                  <MenuItem value="south-america">South America</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Startup Name</TableCell>
                    <TableCell>Industry</TableCell>
                    <TableCell>Funding (৳M)</TableCell>
                    <TableCell>Valuation (৳M)</TableCell>
                    <TableCell>Revenue (৳M)</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStartups.map((startup, index) => (
                    <TableRow key={index}>
                      <TableCell>{startup.name}</TableCell>
                      <TableCell>{startup.industry}</TableCell>
                      <TableCell>${startup.funding.toFixed(2)}</TableCell>
                      <TableCell>${startup.valuation.toFixed(2)}</TableCell>
                      <TableCell>${startup.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={startup.profitable ? 'Profitable' : 'Non-Profitable'}
                          color={startup.profitable ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analysis; 