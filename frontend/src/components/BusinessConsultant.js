import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
  Stack
} from '@mui/material';
import {
  Send as SendIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Book as BookIcon
} from '@mui/icons-material';

const advisor = {
  name: 'Dr. Emily Carter',
  title: 'Senior Business Consultant',
  bio: '15+ years advising startups, SMEs, and large enterprises. Expert in business strategy, funding, and growth.',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  specialties: ['Business Planning', 'Funding', 'Growth Strategy', 'Market Entry', 'Pitch Decks']
};

const BusinessConsultant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi! I'm ${advisor.name}, your business consultant. I'm here to help you with any business questions or challenges you might have. What would you like to discuss today?`,
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
    
    if (message.includes('funding') || message.includes('money') || message.includes('investment')) {
      return "Great question about funding! There are several options depending on your business stage. For early-stage startups, consider bootstrapping, angel investors, or crowdfunding. For growth-stage companies, venture capital or business loans might be more appropriate. What stage is your business currently in?";
    }
    
    if (message.includes('plan') || message.includes('strategy')) {
      return "Business planning is crucial for success! Start with a clear vision and mission, then develop your value proposition, target market analysis, and financial projections. Would you like me to help you create a specific business plan template?";
    }
    
    if (message.includes('growth') || message.includes('scale')) {
      return "Scaling a business requires careful planning. Focus on your core competencies, build strong systems and processes, and ensure you have the right team in place. What's your current revenue and team size? This will help me give you more specific advice.";
    }
    
    if (message.includes('market') || message.includes('competition')) {
      return "Market analysis is essential! Research your competitors, understand your target audience, and identify your unique value proposition. Have you conducted any market research yet? I can guide you through the process.";
    }
    
    if (message.includes('pitch') || message.includes('presentation')) {
      return "A compelling pitch deck should tell your story clearly and concisely. Include your problem, solution, market opportunity, business model, and financial projections. Keep it to 10-15 slides maximum. Would you like me to share a pitch deck template?";
    }
    
    return "Thank you for your question! I'd be happy to help you with that. Could you provide a bit more context about your specific situation? This will help me give you more targeted advice.";
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafd', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#1a237e' }}>
            Business Consultant
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Chat with our expert business advisor for personalized guidance
          </Typography>
          
          {/* Advisor Info */}
          <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar src={advisor.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{advisor.name}</Typography>
                <Typography variant="body2" color="text.secondary">{advisor.title}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {advisor.bio}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {advisor.specialties.map((spec, i) => (
                <Chip key={i} label={spec} color="primary" size="small" />
              ))}
            </Stack>
          </Paper>
        </Box>

        <Grid container spacing={4}>
          {/* Chat Interface */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={advisor.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{advisor.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {isTyping ? 'Typing...' : 'Online'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <List sx={{ p: 0 }}>
                  {messages.map((message) => (
                    <ListItem
                      key={message.id}
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
                          maxWidth: '70%',
                          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                      >
                        {message.sender === 'advisor' && (
                          <Avatar src={advisor.avatar} sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }} />
                        )}
                        <Box
                          sx={{
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                            color: message.sender === 'user' ? 'white' : 'text.primary',
                            p: 2,
                            borderRadius: 2,
                            maxWidth: '100%',
                            wordWrap: 'break-word'
                          }}
                        >
                          <Typography variant="body1">{message.text}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Box>
                        {message.sender === 'user' && (
                          <Avatar sx={{ width: 32, height: 32, ml: 1, mt: 0.5, bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                  {isTyping && (
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 0, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar src={advisor.avatar} sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }} />
                        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {advisor.name} is typing...
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  )}
                </List>
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '&.Mui-disabled': { bgcolor: 'grey.300' }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Tips & Resources */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                <SupportIcon sx={{ mr: 1, color: 'primary.main' }} />
                Quick Tips
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Be specific about your business stage"
                    secondary="Early-stage, growth, or established?"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Include relevant metrics"
                    secondary="Revenue, team size, market size"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Ask follow-up questions"
                    secondary="Get more detailed advice"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                <BookIcon sx={{ mr: 1, color: 'primary.main' }} />
                Popular Topics
              </Typography>
              <Stack spacing={1}>
                <Chip 
                  label="Business Plan Creation" 
                  variant="outlined" 
                  onClick={() => setNewMessage("How do I create a business plan?")}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip 
                  label="Funding Strategies" 
                  variant="outlined" 
                  onClick={() => setNewMessage("What funding options are available for my business?")}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip 
                  label="Market Analysis" 
                  variant="outlined" 
                  onClick={() => setNewMessage("How do I conduct market research?")}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip 
                  label="Growth Planning" 
                  variant="outlined" 
                  onClick={() => setNewMessage("How can I scale my business?")}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessConsultant; 