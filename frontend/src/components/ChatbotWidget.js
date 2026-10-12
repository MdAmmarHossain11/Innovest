import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Avatar, Typography, Paper, TextField, Button, Fade, Slide, Chip, List, ListItem, ListItemText } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import chatbotQA from './chatbotQA';

const assistantAvatar = '/images/chatbot.png';

const quickReplies = [
  'What is innovest?',
  'How do i create an account?',
  'How do i invest?'
];

const initialMessages = [
  { from: 'bot', text: 'Hi there 👋' },
  { from: 'bot', text: 'How can I help you today?' }
];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Function to get suggestions based on input
  const getSuggestions = (inputText) => {
    if (!inputText.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = inputText.toLowerCase();
    const filtered = chatbotQA
      .filter(qa => qa.q.toLowerCase().includes(searchTerm))
      .slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    getSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.q);
    setShowSuggestions(false);
    handleSend(suggestion.q);
  };

  const handleSend = (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setMessages((msgs) => [...msgs, { from: 'user', text }]);
    setInput('');
    setShowSuggestions(false);
    // Check for a matching Q&A
    const answer = chatbotQA.find(pair => text.toLowerCase().includes(pair.q));
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: answer ? answer.a : 'Thanks for your message! (This is a demo bot.)' }
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <Fade in={!open}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1300
          }}
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: '#ff4f8b',
              color: '#fff',
              width: 64,
              height: 64,
              boxShadow: '0 4px 24px rgba(255,79,139,0.18)',
              '&:hover': { bgcolor: '#ff267a' }
            }}
            size="large"
          >
            <ChatIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Fade>

      {/* Chat Window */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 340,
            maxWidth: '95vw',
            height: 440,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1400,
            boxShadow: '0 8px 32px rgba(255,79,139,0.18)'
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ffe0ef', bgcolor: '#fff' }}>
            <Avatar src={assistantAvatar} sx={{ bgcolor: '#ff4f8b', mr: 1 }} />
            <Typography sx={{ fontWeight: 700, color: '#ff4f8b', flexGrow: 1 }}>Virtual Assistant</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', background: '#fff6fa' }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{ display: 'flex', mb: 1.5, justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.from === 'bot' && <Avatar src={assistantAvatar} sx={{ width: 28, height: 28, mr: 1 }} />}
                <Box
                  sx={{
                    bgcolor: msg.from === 'user' ? '#ff4f8b' : '#fff',
                    color: msg.from === 'user' ? '#fff' : '#222',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '80%',
                    fontSize: 15,
                    boxShadow: msg.from === 'user' ? '0 2px 8px #ff4f8b22' : '0 1px 4px #eee',
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Box>
          {/* Quick Replies */}
          <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {quickReplies.map((reply, i) => (
              <Chip
                key={i}
                label={reply}
                onClick={() => handleSend(reply)}
                sx={{ bgcolor: '#ffe0ef', color: '#ff4f8b', fontWeight: 600, mb: 0.5, cursor: 'pointer', '&:hover': { bgcolor: '#ffb3d1' } }}
                size="small"
              />
            ))}
          </Box>
          {/* Input with Suggestions */}
          <Box sx={{ position: 'relative', borderTop: '1px solid #ffe0ef', bgcolor: '#fff' }}>
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  right: 0,
                  bgcolor: '#fff',
                  border: '1px solid #ffe0ef',
                  borderRadius: '8px 8px 0 0',
                  maxHeight: 200,
                  overflowY: 'auto',
                  zIndex: 1500,
                  boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <List dense>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#fff6fa' },
                        borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                      }}
                    >
                      <ListItemText
                        primary={suggestion.q}
                        primaryTypographyProps={{
                          fontSize: 14,
                          color: '#666',
                          fontWeight: 500
                        }}
                      />
                      <SearchIcon sx={{ fontSize: 16, color: '#ff4f8b' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {/* Input Field */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write your message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                onFocus={() => {
                  if (input.trim()) {
                    getSuggestions(input);
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                sx={{
                  background: '#fff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => handleSend()} disabled={!input.trim()}>
                      <SendIcon sx={{ color: '#ff4f8b' }} />
                    </IconButton>
                  )
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default ChatbotWidget; 