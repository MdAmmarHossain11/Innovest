import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// FAQ illustration using local image
const FaqIllustration = () => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
    <img
      src="/images/FAQ.png"
      alt="FAQ Illustration"
      style={{ width: '100%', maxWidth: 320, height: 'auto', marginBottom: 8 }}
    />
    
  </Box>
);

const faqs = [
  {
    question: '📌 What is this platform used for?',
    answer: 'This platform connects startups looking for funding with investors interested in backing early-stage businesses. 💼 Entrepreneurs can launch fundraising campaigns, and investors can explore vetted startup opportunities.'
  },
  {
    question: '🚀 How can I start a fundraiser for my startup?',
    answer: 'To start a fundraiser, sign up as a founder, complete your startup profile, and submit your campaign for review. ✅ Once approved, your campaign will go live and be visible to potential investors.'
  },
  {
    question: '👥 Who can invest in startups on this platform?',
    answer: 'Both accredited and non-accredited investors can invest, depending on the regulations applicable in your region 🌍 and the specific campaign’s terms. Always check eligibility criteria before investing.'
  },
  {
    question: '💰 Is there a minimum investment amount?',
    answer: 'Yes, the minimum investment amount varies by campaign but is typically set by the startup. Most campaigns allow investments starting from ৳100 to make it accessible for more people. 💸'
  },
  {
    question: '🔎 How do I know if a startup is legitimate?',
    answer: 'All startups go through a basic vetting process before their campaigns are approved. However, you should always perform your own due diligence 🕵️‍♂️ and read campaign materials carefully before investing.'
  },
  {
    question: '📈 What do I get in return for investing?',
    answer: 'Investors may receive equity, convertible notes, revenue shares, or other financial instruments based on the terms of the campaign. Your return depends on the startup’s success and exit strategy. 💼📊'
  },
  {
    question: '💳 Are there any fees involved?',
    answer: 'There are no fees for browsing campaigns or creating an account. However, a small transaction fee may apply to investments, and startups may be charged a platform fee for successful fundraising. ⚖️'
  },
  {
    question: '❌ Can I cancel or withdraw my investment?',
    answer: 'You may cancel your investment within a limited timeframe as per the platform’s cancellation policy. After that, investments are typically non-refundable unless the campaign is unsuccessful. ⏳'
  },
  {
    question: '🔐 Is my investment secure?',
    answer: 'Investments in startups carry inherent risks, including the loss of capital. ⚠️ While we implement security measures to protect your data and transactions, financial returns are not guaranteed.'
  },
  {
    question: '📊 How do I track the progress of a startup I invested in?',
    answer: 'Startups are encouraged to post regular updates. As an investor, you’ll receive notifications 📬 and have access to a dashboard where you can monitor progress and communications from the startup.'
  }
];


const Faq = () => {
  const [expanded, setExpanded] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  // Split FAQs for two columns
  const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
  const rightFaqs = faqs.filter((_, i) => i % 2 !== 0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f7fa', py: 6, px: 1 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <FaqIllustration />
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
            color: '#ffb300',
            letterSpacing: 2,
            mb: 1,
            fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
          }}
        >
          FAQ
        </Typography>
      </Box>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          borderRadius: 4,
          p: { xs: 2, sm: 3, md: 4 },
          background: '#232323',
          color: 'white',
        }}
      >

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {leftFaqs.map((faq, idx) => {
              const number = (idx * 2) + 1;
              return (
                <Accordion
                  key={number}
                  expanded={expanded === `panel${number}`}
                  onChange={handleChange(`panel${number}`)}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    background: '#2d2d2d',
                    color: 'white',
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    aria-controls={`panel${number}-content`}
                    id={`panel${number}-header`}
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: '#2196f3',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        mr: 1.5,
                        minWidth: 32,
                        display: 'inline-block',
                      }}
                    >
                      {number < 10 ? `0${number}` : number}
                    </Typography>
                    <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#fff', fontSize: '1rem' }}>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>
          <Grid item xs={12} md={6}>
            {rightFaqs.map((faq, idx) => {
              const number = (idx * 2) + 2;
              return (
                <Accordion
                  key={number}
                  expanded={expanded === `panel${number}`}
                  onChange={handleChange(`panel${number}`)}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    background: '#2d2d2d',
                    color: 'white',
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    aria-controls={`panel${number}-content`}
                    id={`panel${number}-header`}
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: '#2196f3',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        mr: 1.5,
                        minWidth: 32,
                        display: 'inline-block',
                      }}
                    >
                      {number < 10 ? `0${number}` : number}
                    </Typography>
                    <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#fff', fontSize: '1rem' }}>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Faq; 