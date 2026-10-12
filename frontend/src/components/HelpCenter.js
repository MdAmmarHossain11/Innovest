import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  IconButton,
  Chip,
  Stack,
  Fade,
  Slide,
  Grow,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon
} from '@mui/icons-material';

const advisor = {
  name: 'Dr. Ahmed Hassan',
  title: 'Senior Business Consultant',
  bio: '15+ years advising startups and enterprises across Bangladesh and South Asia. Expert in business strategy, funding, and sustainable growth.',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  specialties: ['Business Planning', 'Funding', 'Growth Strategy', 'Market Entry', 'Digital Transformation'],
  experience: '15+ Years',
  clients: '500+',
  successRate: '95%'
};

const BusinessConsultant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Assalamu alaikum! I'm ${advisor.name}, your business consultant from Bangladesh. I'm here to help you with any business questions or challenges you might have. What would you like to discuss today?`,
      sender: 'advisor',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate advisor response
    setTimeout(() => {
      const advisorResponse = generateAdvisorResponse(newMessage);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: advisorResponse,
        sender: 'advisor',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAdvisorResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('funding') || message.includes('money') || message.includes('investment') || message.includes('taka')) {
      return "Great question about funding! In Bangladesh, you have several excellent options: traditional bank loans from Sonali Bank or Brac Bank, microfinance institutions like Grameen Bank, angel investors through Startup Bangladesh, and government grants. The Bangladesh Bank also offers special SME loans. What stage is your business currently in?";
    }
    
    if (message.includes('plan') || message.includes('strategy')) {
      return "Business planning is crucial for success in Bangladesh! Start with a clear vision and mission, then develop your value proposition, target market analysis, and financial projections. Consider local market dynamics, regulatory requirements, and cultural factors. Would you like me to help you create a specific business plan template?";
    }
    
    if (message.includes('growth') || message.includes('scale') || message.includes('expand')) {
      return "Scaling a business in Bangladesh requires understanding local market dynamics. Focus on your core competencies, build strong systems and processes, and ensure you have the right team in place. Consider expanding to other cities like Chittagong, Sylhet, or Rajshahi. What's your current revenue and team size?";
    }
    
    if (message.includes('market') || message.includes('competition') || message.includes('bangladesh')) {
      return "Market analysis in Bangladesh is essential! Research your competitors, understand your target audience, and identify your unique value proposition. Consider the growing middle class, digital adoption trends, and regional preferences. Have you conducted any market research yet? I can guide you through the process.";
    }
    
    if (message.includes('pitch') || message.includes('presentation') || message.includes('investor')) {
      return "A compelling pitch deck should tell your story clearly and concisely. Include your problem, solution, market opportunity, business model, and financial projections. Keep it to 10-15 slides maximum. For Bangladeshi investors, emphasize local market understanding and social impact. Would you like me to share a pitch deck template?";
    }
    
    if (message.includes('digital') || message.includes('online') || message.includes('ecommerce')) {
      return "Digital transformation is key in Bangladesh's growing market! Consider e-commerce platforms like Daraz or Evaly, digital marketing strategies, and online payment solutions like bKash or Nagad. The digital economy is booming here. What type of business are you running?";
    }
    
    if (message.includes('export') || message.includes('international') || message.includes('foreign')) {
      return "Export opportunities in Bangladesh are excellent! The garment industry is well-established, but there's growing potential in IT services, pharmaceuticals, and agricultural products. Consider the Bangladesh Export Promotion Bureau (EPB) for guidance and incentives. What products or services are you looking to export?";
    }
    
    if (message.includes('government') || message.includes('policy') || message.includes('regulation')) {
      return "Understanding government policies and regulations is crucial in Bangladesh. The government offers various incentives for startups, SMEs, and foreign investment. Consider registering with the Bangladesh Investment Development Authority (BIDA) for support. What specific regulatory concerns do you have?";
    }
    
    return "Thank you for your question! I'd be happy to help you with that. Could you provide a bit more context about your specific situation in Bangladesh? This will help me give you more targeted advice for the local market.";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "How do I get funding for my startup in Bangladesh?",
    "What are the best business opportunities in Bangladesh?",
    "How can I scale my business to other cities?",
    "What government incentives are available for businesses?"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4 
    }}>
      <Container maxWidth="lg">
        {/* Modern Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Business Consultant
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Get expert business advice from Bangladesh's top consultant
          </Typography>
          
          {/* Modern Advisor Card */}
          <Card sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 4,
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Avatar 
                  src={advisor.avatar} 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    border: '4px solid #667eea',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }} 
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    {advisor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                    {advisor.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip label={`${advisor.experience} Experience`} size="small" color="primary" />
                    <Chip label={`${advisor.clients} Clients`} size="small" color="secondary" />
                    <Chip label={`${advisor.successRate} Success Rate`} size="small" color="success" />
                  </Box>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                {advisor.bio}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                {advisor.specialties.map((spec, i) => (
                  <Chip 
                    key={i} 
                    label={spec} 
                    color="primary" 
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      '&:hover': { transform: 'translateY(-2px)' },
                      transition: 'transform 0.2s'
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Grid container spacing={4}>
          {/* Modern Chat Interface */}
          <Grid item xs={12} lg={8}>
            <Slide direction="up" in timeout={1800}>
              <Paper sx={{ 
                height: '650px', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                {/* Modern Chat Header */}
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={advisor.avatar} 
                      sx={{ 
                        width: 45, 
                        height: 45, 
                        mr: 2,
                        border: '2px solid rgba(255,255,255,0.3)'
                      }} 
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {advisor.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {isTyping ? 'Typing...' : '🟢 Online'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#ffd700' }} />
                    <Typography variant="body2">4.9/5</Typography>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ 
                  flex: 1, 
                  overflow: 'auto', 
                  p: 3,
                  background: '#f8fafd'
                }}>
                  <List sx={{ p: 0 }}>
                    {messages.map((message, index) => (
                      <Grow in timeout={500} key={message.id}>
                        <ListItem
                          sx={{
                            flexDirection: 'column',
                            alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            p: 0,
                            mb: 2
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              maxWidth: '75%',
                              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                            }}
                          >
                            {message.sender === 'advisor' && (
                              <Avatar 
                                src={advisor.avatar} 
                                sx={{ 
                                  width: 35, 
                                  height: 35, 
                                  mr: 1, 
                                  mt: 0.5,
                                  border: '2px solid #667eea'
                                }} 
                              />
                            )}
                            <Box
                              sx={{
                                background: message.sender === 'user' 
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : 'white',
                                color: message.sender === 'user' ? 'white' : 'text.primary',
                                p: 2.5,
                                borderRadius: 3,
                                maxWidth: '100%',
                                wordWrap: 'break-word',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                position: 'relative',
                                '&::before': message.sender === 'user' ? {
                                  content: '""',
                                  position: 'absolute',
                                  right: -8,
                                  top: 12,
                                  width: 0,
                                  height: 0,
                                  borderLeft: '8px solid #667eea',
                                  borderTop: '8px solid transparent',
                                  borderBottom: '8px solid transparent'
                                } : {
                                  content: '""',
                                  position: 'absolute',
                                  left: -8,
                                  top: 12,
                                  width: 0,
                                  height: 0,
                                  borderRight: '8px solid white',
                                  borderTop: '8px solid transparent',
                                  borderBottom: '8px solid transparent'
                                }
                              }}
                            >
                              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                {message.text}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  opacity: 0.7, 
                                  mt: 1, 
                                  display: 'block',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {formatTime(message.timestamp)}
                              </Typography>
                            </Box>
                            {message.sender === 'user' && (
                              <Avatar 
                                sx={{ 
                                  width: 35, 
                                  height: 35, 
                                  ml: 1, 
                                  mt: 0.5, 
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                              >
                                <PersonIcon />
                              </Avatar>
                            )}
                          </Box>
                        </ListItem>
                      </Grow>
                    ))}
                    {isTyping && (
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 0, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Avatar 
                            src={advisor.avatar} 
                            sx={{ 
                              width: 35, 
                              height: 35, 
                              mr: 1, 
                              mt: 0.5,
                              border: '2px solid #667eea'
                            }} 
                          />
                          <Box sx={{ 
                            bgcolor: 'white', 
                            p: 2.5, 
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666' }}>
                              {advisor.name} is typing...
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    )}
                  </List>
                  <div ref={messagesEndRef} />
                </Box>

                {/* Modern Message Input */}
                <Box sx={{ 
                  p: 3, 
                  borderTop: '1px solid #e0e0e0',
                  background: 'white'
                }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                    <TextField
                      fullWidth
                      placeholder="Type your business question here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      multiline
                      maxRows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: '#f8fafd',
                          '&:hover': {
                            bgcolor: '#f0f2f5'
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white'
                          }
                        }
                      }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 48,
                        height: 48,
                        '&:hover': { 
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.05)'
                        },
                        '&.Mui-disabled': { bgcolor: '#ccc' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Modern Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Quick Questions */}
              <Slide direction="left" in timeout={2000}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1a237e'
                  }}>
                    <LightbulbIcon sx={{ mr: 1, color: '#ff9800' }} />
                    Quick Questions
                  </Typography>
                  <Stack spacing={2}>
                    {quickQuestions.map((question, index) => (
                      <Chip 
                        key={index}
                        label={question} 
                        variant="outlined" 
                        onClick={() => setNewMessage(question)}
                        sx={{ 
                          cursor: 'pointer',
                          p: 1.5,
                          fontSize: '0.9rem',
                          '&:hover': { 
                            bgcolor: 'primary.main',
                            color: 'white',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Slide>

              {/* Tips */}
              <Slide direction="left" in timeout={2200}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1a237e'
                  }}>
                    <SupportIcon sx={{ mr: 1, color: '#4caf50' }} />
                    Pro Tips
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#4caf50' 
                      }} />
                      <Typography variant="body2">
                        Be specific about your business stage
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#4caf50' 
                      }} />
                      <Typography variant="body2">
                        Include relevant metrics & numbers
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#4caf50' 
                      }} />
                      <Typography variant="body2">
                        Ask follow-up questions for details
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Slide>

              {/* Stats */}
              <Slide direction="left" in timeout={2400}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1a237e'
                  }}>
                    <TrendingUpIcon sx={{ mr: 1, color: '#f44336' }} />
                    Success Metrics
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Experience</Typography>
                      <Chip label={advisor.experience} size="small" color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Clients Helped</Typography>
                      <Chip label={advisor.clients} size="small" color="secondary" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Success Rate</Typography>
                      <Chip label={advisor.successRate} size="small" color="success" />
                    </Box>
                  </Stack>
                </Paper>
              </Slide>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessConsultant; 