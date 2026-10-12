import React from 'react';
import { Box } from '@mui/material';
import FeaturedCompanies from '../components/company/FeaturedCompanies';
import BusinessTrendsAndHowItWorks from '../components/home/BusinessTrendsAndHowItWorks';

const Home = () => {
    return (
        <Box>
            <FeaturedCompanies />
            <BusinessTrendsAndHowItWorks />
        </Box>
    );
};

export default Home; 