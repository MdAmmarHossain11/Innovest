import { API_HOST } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  List,
  ListItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  TextField,
  IconButton,
  Menu,
  ListItemText,
  InputAdornment,
  Alert,
  CircularProgress,
  Badge,
  Snackbar,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import authService from '../services/authService';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import FundingSetup from './company/FundingSetup';
import CloseIcon from '@mui/icons-material/Close';
import chatService from '../services/chatService';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DownloadIcon from '@mui/icons-material/Download';
import GroupsIcon from '@mui/icons-material/Groups';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RoomIcon from '@mui/icons-material/Room';
import communityService from '../services/communityService';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import companyService from '../services/companyService';
import userService from '../services/userService';
import CompanyView from './company/CompanyView';
import companyPermissionService from '../services/companyPermissionService';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Analysis from './Analysis';
import AddUserDialog from './company/AddUserDialog';
import CompanyUpdateLog from './company/CompanyUpdateLog';
import { subMonths, isAfter } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import CheckIcon from '@mui/icons-material/Check';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import TitleIcon from '@mui/icons-material/Title';
import LabelIcon from '@mui/icons-material/Label';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RepeatIcon from '@mui/icons-material/Repeat';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
//import InputAdornment from '@mui/material/InputAdornment';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const API_URL = `${API_HOST}/api/auth/profile/`;

// Backend handler for posting community posts
async function submitCommunityPost(formData) {
  const data = new FormData();
  data.append('title', formData.title);
  data.append('type', formData.type);
  data.append('visibility', formData.visibility || 'public');
  data.append('description', formData.description);
  if (formData.tags && Array.isArray(formData.tags)) {
    data.append('tags', formData.tags.join(','));
  }
  if (formData.type === 'Event') {
    data.append('eventLocation', formData.eventLocation || '');
    data.append('eventLocationLink', formData.eventLocationLink || '');
    data.append('eventStartDateTime', formData.eventStartDateTime || '');
    data.append('eventEndDateTime', formData.eventEndDateTime || '');
  }
  if (formData.attachment) {
    data.append('attachment', formData.attachment);
  }
  const currentUser = authService.getCurrentUser();
  const response = await axios.post(`${API_HOST}/api/community/posts/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${currentUser?.access}`
    }
  });
  return response.data;
}

// Add fetchCommunityPosts function
const fetchCommunityPosts = async (accessToken) => {
  const response = await axios.get(`${API_HOST}/api/community/posts/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.data;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [value, setValue] = useState(() => {
    const savedTab = localStorage.getItem('dashboardTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [backedCompanies, setBackedCompanies] = useState([
    {
      id: 2,
      name: 'GreenTech Energy',
      description: 'Pioneering eco-friendly energy solutions for a sustainable future.',
      image: 'https://placehold.co/400x200',
      invested: 5000,
      investedDate: '2024-01-12',
      shares: 50,
      sharePercentage: 1.2,
      status: 'Active',
      updates: [
        { date: '2025-04', text: 'Launched MVP' },
        { date: '2025-03', text: 'Raised Series A' },
        { date: '2025-01', text: 'Signed 3 partnerships' }
      ],
      documents: [
        { name: 'Share Certificate', url: '#' },
        { name: 'Term Sheet', url: '#' }
      ],
      investmentHistory: [
        { date: '2024-01', value: 5000 },
        { date: '2024-06', value: 5200 },
        { date: '2024-12', value: 6000 },
        { date: '2025-04', value: 8000 }
      ],
      exitEvent: {
        type: 'Acquisition',
        date: '2025-06-15',
        details: 'Acquired by SolarTech Holdings for ৳20M'
      }
    },
    {
      id: 3,
      name: 'Urban Mobility Co.',
      description: 'Revolutionizing city transport with smart, electric vehicles.',
      image: 'https://placehold.co/400x200',
      invested: 7500,
      investedDate: '2024-02-15',
      shares: 75,
      sharePercentage: 1.8,
      status: 'Active',
      updates: [
        { date: '2025-03', text: 'Expanded to 3 new cities' },
        { date: '2025-02', text: 'Launched new vehicle line' }
      ],
      documents: [
        { name: 'Share Certificate', url: '#' },
        { name: 'Term Sheet', url: '#' }
      ],
      investmentHistory: [
        { date: '2024-02', value: 7500 },
        { date: '2024-08', value: 8000 },
        { date: '2025-03', value: 9500 }
      ],
      exitEvent: null
    }
  ]);
  const [companyDetailsOpen, setCompanyDetailsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('dashboardActiveTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
  const [openAddTask, setOpenAddTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalCompanies: 0,
    totalInvestors: 0,
    totalPosts: 0,
    totalBalance: 0,
    earningsChange: 0,
    ordersChange: 0,
    customersChange: 0,
    balanceChange: 0,
    revenueOrders: 0,
    revenueEarnings: 0,
    revenueRefunds: 0,
    conversionRatio: 0,
    revenueByMonth: [
      { name: 'Jan', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Feb', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Mar', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Apr', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'May', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Jun', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Jul', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Aug', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Sep', Orders: 0, Earnings: 0, Refunds: 0 },
      { name: 'Oct', Orders: 0, Earnings: 0, Refunds: 0 },
    ]
  });

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch user analytics data
  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        throw new Error('User not authenticated');
      }

      // Fetch user's companies
      const companiesResponse = await companyService.getCompanies({ user: currentUser.id });
      const companies = Array.isArray(companiesResponse) ? companiesResponse : [];

      // Initialize metrics
      let totalInvestors = 0;
      let totalBalance = 0;
      let totalPosts = 0;

      // Calculate total investors and balance from companies
      for (const company of companies) {
        try {
          const payments = await companyService.getUserPayments(company.id);
          totalInvestors += payments.length;
          totalBalance += payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
        } catch (err) {
          console.error(`Error fetching payments for company ${company.id}:`, err);
        }
      }


      // Fetch user's posts
      try {
        const posts = await communityService.getPosts({ author: currentUser.id });
        totalPosts = posts.length;
      } catch (err) {
        console.error('Error fetching user posts:', err);
      }

      setAnalyticsData(prev => ({
        ...prev,
        totalCompanies: companies.length,
        totalInvestors,
        totalPosts,
        totalBalance,
        // For now, using placeholder values for changes
        earningsChange: 12.5,
        ordersChange: -3.2,
        customersChange: 7.8,
        balanceChange: 5.2
      }));

    } catch (error) {
      console.error('Error fetching user analytics:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if registration is ending soon (within 7 days)
  const isRegistrationEndingSoon = (endDate) => {
    if (!endDate) return false;
    const now = new Date();
    const end = new Date(endDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    return end > now && end <= sevenDaysFromNow;
  };

  // Fetch upcoming events with registration ending soon
  const fetchUpcomingEvents = async () => {
    try {
      setEventsLoading(true);
      const currentUser = authService.getCurrentUser();

      if (!currentUser?.access) {
        console.warn('No access token found. User might not be authenticated.');
        return;
      }

      // Try different endpoints in case the path is different
      const endpoints = [
        `${API_HOST}/api/events/upcoming/`,
        `${API_HOST}/api/events/`,
        `${API_HOST}/api/company-events/upcoming/`
      ];

      let eventsData = [];
      let lastError = null;

      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${currentUser.access}`,
              'Content-Type': 'application/json'
            },
            params: {
              limit: 10,  // Get more events to filter for registration end date
              upcoming: true
            }
          });

          // Handle different response formats
          let rawEvents = [];
          if (Array.isArray(response.data)) {
            rawEvents = response.data;
          } else if (response.data.results) {
            rawEvents = response.data.results;
          } else if (response.data.data) {
            rawEvents = response.data.data;
          }

          // Filter events where registration is ending soon (within 7 days)
          eventsData = rawEvents.filter(event => {
            return event.registration_end && isRegistrationEndingSoon(event.registration_end);
          });

          // Sort by registration end date (soonest first)
          eventsData.sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end));

          // Take only the 2 most urgent events
          eventsData = eventsData.slice(0, 2);

        } catch (err) {
          console.warn(`Error with endpoint ${endpoint}:`, err.message);
          lastError = err;
          continue;
        }
      }

      // If no events with registration ending soon, show a message
      if (eventsData.length === 0) {
        console.log('No events with registration ending soon found');
        if (lastError) {
          throw lastError;
        }
      }

      console.log('Fetched events:', eventsData);
      setUpcomingEvents(eventsData);

    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
      // Set empty array to prevent errors in the UI
      setUpcomingEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch all data when component mounts
  useEffect(() => {
    fetchUserAnalytics();
    fetchUpcomingEvents();
  }, []);
  const [language, setLanguage] = useState('English');
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [chatTab, setChatTab] = useState('chats');
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [settingsTab, setSettingsTab] = useState(0);
  // Live date and clock state
  const [now, setNow] = useState(new Date());
  const [ideaSearch, setIdeaSearch] = useState('');
  const [ideaStatusFilter, setIdeaStatusFilter] = useState('');
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  // Share Idea Dialog state
  const [openShareIdea, setOpenShareIdea] = useState(false);
  const [shareIdeaForm, setShareIdeaForm] = useState({
    title: '',
    type: '',
    visibility: 'public',
    tags: [],
    description: '',
    attachment: null,
    eventLocation: '',
    eventLocationLink: '',
    eventStartDateTime: '',
    eventEndDateTime: '',
  });
  const ideaCategories = ['Business', 'Technology', 'Design', 'Other'];
  const [openCreateCompanyDialog, setOpenCreateCompanyDialog] = useState(false);
  const [openCompanyView, setOpenCompanyView] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openFundingSetup, setOpenFundingSetup] = useState(false);
  const [myCompanies, setMyCompanies] = useState([
    {
      id: 1,
      name: 'MSolar Glass, LLC',
      description: 'Advanced manufacturing facility dedicated to producing Solar Panels & Glass',
      image: 'https://placehold.co/400x200',
      following: true,
    }
    // Add more companies as needed
  ]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const POLLING_INTERVAL = 500; // Poll every 0.5 seconds for near real-time
  const [chatRequests, setChatRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [attachmentAnchorEl, setAttachmentAnchorEl] = useState(null);
  const [attachmentType, setAttachmentType] = useState(null);
  const attachmentInputRef = useRef();
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [chatSuggestions, setChatSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState(null);
  const [chatMenuUser, setChatMenuUser] = useState(null);
  const [chatFilter, setChatFilter] = useState('accepted'); // 'accepted' or 'other'
  // Store refs for each message row
  const messageRefs = useRef({});
  // Tag input state for chip input
  const [tagInput, setTagInput] = useState('');
  // State for post submission feedback
  const [postLoading, setPostLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [postError, setPostError] = useState(null);
  // State for post actions
  const [viewPost, setViewPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', type: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  // --- Notification State ---
  const [communityNotifications, setCommunityNotifications] = useState([]); // List of notifications
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); // Unread count
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false); // Popup state
  const [notificationPopupType, setNotificationPopupType] = useState('community');
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationHasMore, setNotificationHasMore] = useState(false); // For 'View More'
  const [companyNotifications, setCompanyNotifications] = useState([]);
  const NOTIFICATION_PAGE_SIZE = 10;

  const [settingsFormData, setSettingsFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    title: '',
    company: '',
    website: '',
    city: '',
    state: '',
    bio: '',
    position: '',
    address: '',
    country: '',
    dob: '',
    profile_pic: null
  });

  // State variables for profile image
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [settingsSnackbar, setSettingsSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [allCompanies, setAllCompanies] = useState([]);
  const [allCompaniesLoading, setAllCompaniesLoading] = useState(false);
  const [allCompaniesError, setAllCompaniesError] = useState('');
  const [backedPage, setBackedPage] = useState(1);
  const COMPANIES_PER_PAGE = 6;
  const [trackProgressCompany, setTrackProgressCompany] = useState(null);
  const [openTrackProgressDialog, setOpenTrackProgressDialog] = useState(false);
  const [trackProgressForm, setTrackProgressForm] = useState({
    exitEvent: { notice: '' },
    kpis: { revenue: '', revenueRate: '', burnRate: '', retention: '' },
    documents: [],
    updates: [{ text: '' }],
  });
  const [trackProgressLoading, setTrackProgressLoading] = useState(false);
  const [trackProgressId, setTrackProgressId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [companyUpdateId, setCompanyUpdateId] = useState(null);
  const [lastSavedCompanyUpdate, setLastSavedCompanyUpdate] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusCompany, setStatusCompany] = useState(null);
  const [permitDialogOpen, setPermitDialogOpen] = useState(false);
  const [permitDialogCompany, setPermitDialogCompany] = useState(null);
  const [permitLoading, setPermitLoading] = useState(false);
  const [permitError, setPermitError] = useState('');
  const [permitUsers, setPermitUsers] = useState([]);
  const [permitSearch, setPermitSearch] = useState('');
  const [permitStatusFilter, setPermitStatusFilter] = useState('');
  const [permitUserDetailOpen, setPermitUserDetailOpen] = useState(false);
  const [permitUserDetail, setPermitUserDetail] = useState(null);
  const [permitDeleteDialogOpen, setPermitDeleteDialogOpen] = useState(false);
  const [permitUserToDelete, setPermitUserToDelete] = useState(null);
  // Add state for users dialog
  const [openCompanyUsersDialog, setOpenCompanyUsersDialog] = useState(false);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyUsersLoading, setCompanyUsersLoading] = useState(false);
  const [companyUsersError, setCompanyUsersError] = useState('');
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [openUserProfileDialog, setOpenUserProfileDialog] = useState(false);
  const [selectedCompanyForUsers, setSelectedCompanyForUsers] = useState(null);
  // Add state for visibility filter
  const [ideaVisibilityFilter, setIdeaVisibilityFilter] = useState('');
  const [companyUserSearch, setCompanyUserSearch] = useState('');
  const [companyUserAmountRange, setCompanyUserAmountRange] = useState([0, 1000000]);

  // User to be deleted
  const [userToDelete, setUserToDelete] = useState(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const [updateLogOpen, setUpdateLogOpen] = useState(false);
  const [updateLogCompany, setUpdateLogCompany] = useState(null);

  // Add state at the top of Dashboard component
  const [permitDeleteSnackbar, setPermitDeleteSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Function to show snackbar messages
  const showSnackbar = (message, severity = 'success') => {
    setSettingsSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Contact founder handler
  const handleContactFounder = async (company) => {
    try {
      setLoading(true);

      // Get the company details to find the owner
      const companyDetails = await companyService.getCompanyById(company.id);
      const ownerId = companyDetails.user_id;

      if (!ownerId) {
        console.error('Owner ID not found for company:', company.id);
        alert('Could not find the company owner. Please try again later.');
        return;
      }

      // Get all users to find the owner
      const users = await userService.getAllUsers();
      const owner = users.find(u => u.id === ownerId);

      if (!owner) {
        console.error('Owner not found in user list:', ownerId);
        alert('Could not load the company owner\'s details. Please try again later.');
        return;
      }

      // Check if user already exists in chat users
      const existingUser = chatUsers.find(u => u.id === owner.id);

      if (!existingUser) {
        // Add user to chat users if not already there
        setChatUsers(prev => [...prev, owner]);
      }

      // Switch to chat tab (assuming tab index 5 is the chat tab)
      setValue(5);

      // Select the chat with the owner
      setSelectedChat(existingUser || owner);

    } catch (error) {
      console.error('Error contacting founder:', error);
      alert('Failed to open chat with the founder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(`${API_HOST}/api/settings/profile/`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserProfile(data);
      authService.updateCurrentUser(data);

      // Format the date fields before setting the form data
      const formattedData = {
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        created_at: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : ''
      };
      setSettingsFormData(formattedData);

      // Set profile image URL with the correct path
      if (data.profile_pic) {
        setProfileImageUrl(
          /^https?:\/\//.test(data.profile_pic)
            ? data.profile_pic
            : `${API_HOST}${data.profile_pic.startsWith('/') ? '' : '/'}${data.profile_pic}`
        );
      } else {
        setProfileImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize user state from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored user:', storedUser);
    if (storedUser) {
      setUser(storedUser);
      setAccessToken(storedUser.access);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetch companies for My Companies tab
    const fetchMyCompanies = async () => {
      try {
        const user = authService.getCurrentUser();
        const userId = user?.id || user?.user_id || user?.pk;
        if (!userId) {
          console.error('No user ID found');
          return;
        }
        console.log('Fetching companies for user:', userId);
        const userCompanies = await companyService.getCompanies({ user: userId });
        console.log('Fetched companies:', userCompanies);
        setMyCompanies(userCompanies);
      } catch (err) {
        console.error('Error fetching my companies:', err);
        setMyCompanies([]);
      }
      try {
        const notifications = await companyPermissionService.getNotifications();
        setCompanyNotifications(notifications.results || []);
      } catch (notificationError) {
        console.warn('Could not load company notifications:', notificationError);
      }
    };
    fetchMyCompanies();
  }, []);

  // Fetch all companies for Backed tab
  useEffect(() => {
    const fetchAllCompanies = async () => {
      setAllCompaniesLoading(true);
      setAllCompaniesError('');
      try {
        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        const userId = user?.id || user?.user_id || user?.pk;
        if (!userId) {
          console.error('No user ID found in user object:', user);
          return;
        }
        // First get all companies
        const companies = await companyService.getCompanies({ company_status: '' });
        console.log('Fetched companies:', companies);

        if (!companies || companies.length === 0) {
          console.log('No companies found');
          setAllCompanies([]);
          return;
        }

        // Then filter companies where user has made payments
        const backedCompanies = [];
        for (const company of companies) {
          try {
            console.log(`Processing company ${company.id}: ${company.product_name}`);
            const payments = await companyService.getUserPayments(company.id);
            console.log(`Payments for company ${company.id}:`, payments);

            if (!payments || payments.length === 0) {
              console.log(`No payments found for company ${company.id}`);
              continue;
            }

            // Filter payments by current user AND paid status
            const paidPayments = payments.filter(payment =>
              payment.payment_status === 'paid' &&
              payment.user &&
              (payment.user.id === userId || payment.user.user_id === userId || payment.user.pk === userId)
            );

            if (paidPayments.length === 0) {
              console.log(`No paid payments found for current user in company ${company.id}`);
              continue;
            }

            // Get fundraise terms
            const fundraiseTerms = await companyService.getFundraiseTerms(company.id);
            console.log(`Fundraise terms for ${company.id}:`, fundraiseTerms);

            // Calculate total paid investment
            const totalPaidInvestment = paidPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
            console.log(`Total paid investment for ${company.id}:`, totalPaidInvestment);

            // Get pre-money valuation and raise amount from fundraise terms
            const currentTerm = fundraiseTerms && fundraiseTerms.results && fundraiseTerms.results.length > 0 ? fundraiseTerms.results[0] : null;
            const preMoneyValuation = currentTerm ? parseFloat(currentTerm.pre_money_valuation) : 0;
            const raiseAmount = currentTerm ? parseFloat(currentTerm.raise_amount) : 0;
            console.log(`Valuation data for ${company.id}:`, { preMoneyValuation, raiseAmount });

            // Calculate equity percentage
            const equityPercentage = preMoneyValuation && raiseAmount ?
              ((totalPaidInvestment / (preMoneyValuation + raiseAmount)) * 100) : 0;
            console.log(`Calculated equity percentage for ${company.id}:`, equityPercentage);

            backedCompanies.push({
              ...company,
              payments: paidPayments,
              preMoneyValuation: preMoneyValuation,
              raiseAmount: raiseAmount,
              equityPercentage: equityPercentage,
              invested: totalPaidInvestment,
              investedDate: paidPayments[0].payment_date,
              investmentHistory: paidPayments.map(payment => ({
                date: new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                value: parseFloat(payment.amount)
              }))
            });
          } catch (err) {
            console.error(`Error processing company ${company.id}:`, err);
            continue;
          }
        }
        console.log('Final backed companies:', backedCompanies);
        setAllCompanies(backedCompanies);
      } catch (err) {
        console.error('Error fetching backed companies:', err);
        setAllCompaniesError('Failed to load companies');
      } finally {
        setAllCompaniesLoading(false);
      }
    };
    fetchAllCompanies();
  }, [user]);

  // Add useEffect for fetching users
  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    if (user?.id) {
      console.log('Calling fetchUsers with user ID:', user.id);
      fetchUsers();
    }
  }, [user]);

  // Fetch chat requests on mount and when user changes
  useEffect(() => {
    let pollInterval;
    const fetchRequests = async () => {
      if (!user?.id) return;
      setRequestsLoading(true);
      try {
        const requests = await chatService.getMyRequests();
        setChatRequests(requests);
        setRequestsError(null);
      } catch (err) {
        setRequestsError('Failed to load chat requests');
      } finally {
        setRequestsLoading(false);
      }
    };
    fetchRequests();
    // Poll every 1 second for near real-time
    pollInterval = setInterval(fetchRequests, 1000);
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [user]);

  // Helper: get request status for a user
  const getRequestStatus = (otherUserId) => {
    // Sent by me
    const sent = chatRequests.find(r => r.from_user.id === user?.id && r.to_user.id === otherUserId);
    if (sent) return { status: sent.status, direction: 'sent', request: sent };
    // Received by me
    const received = chatRequests.find(r => r.from_user.id === otherUserId && r.to_user.id === user?.id);
    if (received) return { status: received.status, direction: 'received', request: received };
    return null;
  };

  // Handlers for sending/responding to requests
  const handleSendRequest = async (toUserId) => {
    try {
      setRequestsLoading(true);
      await chatService.sendRequest(toUserId);
      // Refresh requests
      const requests = await chatService.getMyRequests();
      setChatRequests(requests);
    } catch (err) {
      setRequestsError('Failed to send request');
    } finally {
      setRequestsLoading(false);
    }
  };
  const handleRespondRequest = async (requestId, action) => {
    try {
      setRequestsLoading(true);
      await chatService.respondRequest(requestId, action);
      // Refresh requests
      const requests = await chatService.getMyRequests();
      setChatRequests(requests);
    } catch (err) {
      setRequestsError('Failed to respond to request');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('dashboardTab', newValue.toString());
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      setOpenAddTask(false);
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDeleteTask = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const handleSaveEditTask = () => {
    setTodos(todos.map(todo => todo.id === editTaskId ? { ...todo, text: editTaskText } : todo));
    setEditTaskId(null);
    setEditTaskText('');
  };

  const handleLangMenuOpen = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangMenuClose = () => setLangAnchorEl(null);
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLangAnchorEl(null);
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      // Fetch all users (for search suggestions)
      const allUsersFetched = await chatService.getUsers();
      // Filter out admin users
      const nonAdminUsers = allUsersFetched.filter(u => !authService.isAdmin(u));
      // Get deleted chat users from localStorage
      const deletedChatUsers = JSON.parse(localStorage.getItem('deletedChatUsers') || '[]');
      // Filter out deleted users from chat sidebar
      const filteredUsers = nonAdminUsers.filter(u => !deletedChatUsers.includes(u.id));
      setAllUsers(nonAdminUsers); // for search suggestions, keep all non-admins
      setChatUsers(filteredUsers); // for sidebar, hide deleted
      // Fetch chat requests for status
      const requests = await chatService.getMyRequests();
      setChatRequests(requests);
    } catch (error) {
      setUsersError(
        error.response?.data?.error ||
        error.message ||
        'Failed to load users. Please try again.'
      );
    } finally {
      setUsersLoading(false);
    }
  };

  // Clear messages when changing chat
  useEffect(() => {
    if (selectedChat) {
      fetchConversation(selectedChat.id);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  const fetchConversation = async (userId) => {
    if (!userId || !user?.id) return;

    try {
      setLoading(true);
      const conversation = await chatService.getConversation(userId);
      if (!conversation || !Array.isArray(conversation)) {
        setUsersError('Invalid conversation data received');
        return;
      }
      console.log('Raw conversation data:', JSON.stringify(conversation, null, 2));
      // Map messages to include sender information and file
      const formattedMessages = conversation.map(msg => {
        console.log('Processing message:', JSON.stringify(msg, null, 2));
        console.log('Sender data:', JSON.stringify(msg.sender, null, 2));
        console.log('Sender profile_pic:', msg.sender?.profile_pic);
        let dateObj = msg.timestamp ? new Date(msg.timestamp) : new Date();
        const formattedMsg = {
          id: msg.id,
          from: msg.sender.id === user.id ? 'You' : `${msg.sender.first_name || msg.sender.email.split('@')[0]}`,
          text: msg.message,
          file: msg.file_url || null,
          fileName: msg.file ? msg.file.split('/').pop() : (msg.file_url ? msg.file_url.split('/').pop() : undefined),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: dateObj,
          self: msg.sender.id === user.id,
          is_read: msg.is_read,
          sender_profile_pic: msg.sender?.profile_pic
        };
        console.log('Formatted message:', JSON.stringify(formattedMsg, null, 2));
        return formattedMsg;
      });
      console.log('All formatted messages:', JSON.stringify(formattedMessages, null, 2));
      setMessages(formattedMessages);
      setUsersError(null);
    } catch (error) {
      setUsersError(error.response?.data?.error || 'Failed to load conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add polling effect for messages
  useEffect(() => {
    let pollInterval;

    const fetchNewMessages = async () => {
      if (!selectedChat?.id || !user?.id) return;

      try {
        const conversation = await chatService.getConversation(selectedChat.id);
        if (!conversation || !Array.isArray(conversation)) return;

        // Always update messages state with latest conversation
        const formattedMessages = conversation.map(msg => {
          let dateObj = msg.timestamp ? new Date(msg.timestamp) : new Date();
          return {
            id: msg.id,
            from: msg.sender.id === user.id ? 'You' : `${msg.sender.first_name || msg.sender.email.split('@')[0]}`,
            text: msg.message,
            file: msg.file_url || null,
            fileName: msg.file ? msg.file.split('/').pop() : (msg.file_url ? msg.file_url.split('/').pop() : undefined),
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: dateObj,
            self: msg.sender.id === user.id,
            is_read: msg.is_read,
            sender_profile_pic: msg.sender.profile_pic
          };
        });
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    // Start polling when chat is selected
    if (selectedChat) {
      // Initial fetch
      fetchNewMessages();

      // Set up polling interval
      pollInterval = setInterval(fetchNewMessages, POLLING_INTERVAL);
    }

    // Cleanup interval on unmount or when chat changes
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedChat, user, lastMessageId]);

  // Modify handleSendChat to update lastMessageId
  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedChat || !user?.id) return;

    try {
      setLoading(true);
      const newMessage = await chatService.sendMessage(selectedChat.id, chatInput);

      // Update lastMessageId with the new message
      setLastMessageId(newMessage.id);

      // Add the new message to the messages array
      setMessages(prev => [...prev, {
        id: newMessage.id,
        from: 'You',
        text: newMessage.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        self: true,
        is_read: false,
        sender_profile_pic: userProfile?.profile_pic
      }]);

      setChatInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setUsersError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.access) {
      fetchUsers();
    }
  }, [user]);

  // Only auto-scroll to bottom if user is already near the bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const threshold = 80; // px from bottom to consider as "at bottom"
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
    // Otherwise, do not auto-scroll
  }, [messages]);

  // Add connection status indicator
  const renderConnectionStatus = () => (
    <Box sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Box sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: wsConnected ? 'success.main' : 'error.main'
      }} />
      <Typography variant="caption" color="text.secondary">
        {wsConnected ? 'Connected' : 'Disconnected'}
      </Typography>
    </Box>
  );

  const handleAttachmentClick = (event) => {
    setAttachmentAnchorEl(event.currentTarget);
  };
  const handleAttachmentClose = () => {
    setAttachmentAnchorEl(null);
  };
  const handleAttachmentOption = (type) => {
    setAttachmentType(type);
    setAttachmentAnchorEl(null);
    setTimeout(() => {
      if (attachmentInputRef.current) attachmentInputRef.current.click();
    }, 100);
  };
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingAttachment(file);
    setAttachmentType(null);
    e.target.value = '';
  };

  const handleSendAttachment = async () => {
    if (!pendingAttachment || !selectedChat || !user?.id) return;
    try {
      setLoading(true);
      const newMessage = await chatService.sendMessage(selectedChat.id, '', pendingAttachment);
      setMessages(prev => [...prev, {
        id: newMessage.id,
        from: 'You',
        text: '',
        file: newMessage.file_url,
        fileName: pendingAttachment.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        self: true,
        is_read: false,
        sender_profile_pic: userProfile?.profile_pic
      }]);
      setPendingAttachment(null);
    } catch (error) {
      setUsersError('Failed to send attachment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleCancelAttachment = () => {
    setPendingAttachment(null);
  };

  // Add message deletion handler
  const handleDeleteMessage = async (messageId) => {
    // Find the message DOM node and its offsetTop
    const container = messagesContainerRef.current;
    const msgNode = messageRefs.current[messageId];
    const msgOffset = msgNode && container ? msgNode.offsetTop - container.scrollTop : null;

    // Optimistically update UI
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
          ...msg,
          text: `This message was deleted by ${userProfile?.first_name || userProfile?.email?.split('@')[0] || 'You'}`,
          file: null
        }
        : msg
    ));
    try {
      setLoading(true);
      await chatService.deleteMessage(messageId);
      // Immediately refresh conversation
      if (selectedChat) {
        await fetchConversation(selectedChat.id);
      }
      // Restore scroll so the deleted message stays at the same place
      if (container && msgOffset !== null) {
        // Wait for DOM update
        setTimeout(() => {
          const newMsgNode = messageRefs.current[messageId];
          if (newMsgNode) {
            container.scrollTop = newMsgNode.offsetTop - msgOffset;
          }
        }, 50);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setUsersError('Failed to delete message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add this function near the top of the component
  const handleImageDownload = (url, fileName) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  // Update search bar logic
  const handleChatSearchChange = (e) => {
    const value = e.target.value;
    setChatSearch(value);
    if (!value) {
      setChatSuggestions([]);
      return;
    }
    // Filter all registered users, exclude admins
    const lower = value.toLowerCase();
    const suggestions = allUsers
      .filter(u => !authService.isAdmin(u))
      .filter(u =>
        (u.first_name && u.first_name.toLowerCase().includes(lower)) ||
        (u.last_name && u.last_name.toLowerCase().includes(lower)) ||
        (u.email && u.email.toLowerCase().includes(lower))
      );
    setChatSuggestions(suggestions);
  };
  const handleChatSuggestionClick = (user) => {
    // Prevent admin users from being added or selected
    if (authService.isAdmin(user)) return;
    // Remove from deletedChatUsers if present
    const deletedChatUsers = JSON.parse(localStorage.getItem('deletedChatUsers') || '[]');
    if (deletedChatUsers.includes(user.id)) {
      const updated = deletedChatUsers.filter(id => id !== user.id);
      localStorage.setItem('deletedChatUsers', JSON.stringify(updated));
    }
    // If not already in chatUsers, add
    if (!chatUsers.find(u => u.id === user.id)) {
      setChatUsers(prev => [...prev, user]);
    }
    setSelectedChat(user);
    setChatSearch('');
    setChatSuggestions([]);
  };

  // Scroll to bottom when opening a chat (on selectedChat change)
  useEffect(() => {
    if (!selectedChat) return;
    // Wait for messages to load
    const timer = setTimeout(() => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedChat, messages.length]);

  // Helper to add tag
  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ' || e.type === 'blur') {
      const value = tagInput.trim().replace(/^#/, '');
      if (value && !(shareIdeaForm.tags || []).includes(value)) {
        setShareIdeaForm(prev => ({ ...prev, tags: [...(prev.tags || []), value] }));
      }
      setTagInput('');
      e.preventDefault && e.preventDefault();
    }
  };
  // Remove tag
  const handleTagDelete = (tagToDelete) => {
    setShareIdeaForm(prev => ({ ...prev, tags: (prev.tags || []).filter(tag => tag !== tagToDelete) }));
  };

  // Handler for Share Post dialog submit
  const handleSharePost = async () => {
    if (shareIdeaForm.attachment && !shareIdeaForm.attachment.type.startsWith('image/')) {
      setPostError('Community posts support image uploads only.');
      return;
    }
    setPostLoading(true);
    setPostSuccess(null);
    setPostError(null);
    try {
      await submitCommunityPost(shareIdeaForm);
      setPostSuccess('Post created successfully!');
      setShareIdeaForm({
        title: '',
        type: '',
        visibility: 'public',
        tags: [],
        description: '',
        attachment: null,
        eventLocation: '',
        eventLocationLink: '',
        eventStartDateTime: '',
        eventEndDateTime: '',
      });
      setTagInput('');
      setOpenShareIdea(false);
    } catch (error) {
      setPostError(error.response?.data || 'Failed to create post.');
    } finally {
      setPostLoading(false);
    }
  };

  // Fetch posts from backend on mount and after post
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser?.access) {
          const posts = await fetchCommunityPosts(currentUser.access);
          console.log('Fetched posts:', posts); // Debug: see API response
          setCommunityPosts(posts);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    loadPosts();
  }, [user, postSuccess]);

  useEffect(() => {
    if (!postSuccess) return undefined;
    const timer = setTimeout(() => setPostSuccess(null), 2000);
    return () => clearTimeout(timer);
  }, [postSuccess]);

  // API handlers
  const handleDeletePost = async (postId) => {
    setActionLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      await axios.delete(`${API_HOST}/api/community/posts/${postId}/`, {
        headers: { 'Authorization': `Bearer ${currentUser?.access}` }
      });
      setDeletePost(null);
      // Refresh posts
      const posts = await fetchCommunityPosts(currentUser.access);
      setCommunityPosts(posts);
      // Show success notification
      setSettingsSnackbar({
        open: true,
        message: 'Post deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      showSnackbar('Could not load community notifications. Please try again.', 'error');
      setSettingsSnackbar({
        open: true,
        message: 'Failed to delete post.',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPost = async () => {
    if (!editPost) return;
    setActionLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      const data = new FormData();
      // Prepare tags as string
      const tagsString = Array.isArray(editForm.tags) ? editForm.tags.join(',') : (editForm.tags || '');
      data.append('title', editForm.title);
      data.append('visibility', editForm.visibility);
      data.append('type', editForm.type);
      data.append('tags', tagsString);
      data.append('description', editForm.description);
      if (editForm.type === 'Event') {
        data.append('eventLocation', editForm.eventLocation || '');
        data.append('eventLocationLink', editForm.eventLocationLink || '');
        data.append('eventStartDateTime', editForm.eventStartDateTime || '');
        data.append('eventEndDateTime', editForm.eventEndDateTime || '');
      }
      // Only include attachment if a new file is selected
      if (editForm.attachment && editForm.attachment instanceof File) {
        data.append('attachment', editForm.attachment);
      }
      await axios.patch(`${API_HOST}/api/community/posts/${editPost.id}/`, data, {
        headers: {
          'Authorization': `Bearer ${currentUser?.access}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setEditPost(null);
      // Refresh posts
      const posts = await fetchCommunityPosts(currentUser.access);
      setCommunityPosts(posts);
      // Show success notification
      setSettingsSnackbar({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      // Optionally show error
      setSettingsSnackbar({
        open: true,
        message: 'Failed to update post.',
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // When opening the Edit dialog, prefill all fields including tags and event fields
  useEffect(() => {
    if (editPost) {
      let tags = editPost.tags;
      if (typeof tags === 'string') {
        tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      if (!Array.isArray(tags)) tags = [];

      // Helper to format datetime for input type="datetime-local"
      const formatDateTimeLocal = (dt) => {
        if (!dt) return '';
        // If already in 'YYYY-MM-DDTHH:MM' format, return as is
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) return dt;
        // If ISO string, convert to 'YYYY-MM-DDTHH:MM'
        const d = new Date(dt);
        if (isNaN(d)) return '';
        const pad = n => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setEditForm({
        title: editPost.title || '',
        type: editPost.type || '',
        visibility: editPost.visibility || 'public',
        tags,
        tagInput: '',
        description: editPost.description || '',
        eventLocation: editPost.eventLocation || '',
        eventLocationLink: editPost.eventLocationLink || '',
        eventStartDateTime: formatDateTimeLocal(editPost.eventStartDateTime),
        eventEndDateTime: formatDateTimeLocal(editPost.eventEndDateTime),
        attachment: editPost.attachment || null,
      });
    }
  }, [editPost]);

  // Download handler for attachments (guaranteed download)
  const handleDownloadAttachment = async (fileUrl, fileName) => {
    try {
      const currentUser = authService.getCurrentUser();
      const headers = {};
      if (currentUser?.access) {
        headers['Authorization'] = `Bearer ${currentUser.access}`;
      }
      const response = await fetch(fileUrl, { credentials: 'include', headers });
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'attachment';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  // Add effect to update filteredPosts when posts, search, or filter changes
  useEffect(() => {
    handleCommunitySearch();
    // eslint-disable-next-line
  }, [communityPosts, ideaSearch, ideaStatusFilter, userProfile]);

  const handleCommunitySearch = (typeFilter = ideaStatusFilter, visibilityFilter = ideaVisibilityFilter) => {
    const search = ideaSearch.trim().toLowerCase();
    const type = typeFilter;
    const visibility = visibilityFilter;
    const myPosts = communityPosts.filter(post => {
      // Only show current user's posts
      const isMine = post.user && typeof post.user === 'object'
        ? post.user.id === userProfile?.id
        : String(post.user) === String(userProfile?.id);
      // Filter by search (title or type)
      const matchesSearch = !search ||
        (post.title && post.title.toLowerCase().includes(search)) ||
        (post.type && post.type.toLowerCase().includes(search));
      // Filter by type
      const matchesType = !type || (post.type && post.type === type);
      // Filter by visibility
      const matchesVisibility = !visibility || (post.visibility && post.visibility === visibility);
      return isMine && matchesSearch && matchesType && matchesVisibility;
    });
    setFilteredPosts(myPosts);
  };

  // --- Fetch Notifications (real API) ---
  const fetchCommunityNotifications = async (markAsRead = false, offset = 0) => {
    setNotificationLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setNotificationLoading(false);
        return;
      }
      const data = await communityService.getNotifications({
        offset,
        limit: NOTIFICATION_PAGE_SIZE,
        markRead: markAsRead,
      });
      if (!data?.results) {
        setCommunityNotifications([]);
        return;
      }
      if (offset === 0) {
        setCommunityNotifications(data.results || []);
      } else {
        setCommunityNotifications(prev => [...(prev || []), ...(data.results || [])]);
      }
      setUnreadNotificationCount(data.unread_count);
      setNotificationHasMore(data.has_more);
    } catch (err) {
      // Optionally show error
    } finally {
      setNotificationLoading(false);
    }
  };

  // --- Open/close notification popup ---
  const handleOpenNotificationPopup = () => {
    setNotificationPopupType('community');
    setNotificationPopupOpen(true);
    fetchCommunityNotifications(true, 0); // Mark as read on open
  };
  const handleCloseNotificationPopup = () => setNotificationPopupOpen(false);
  const handleViewMoreNotifications = () => {
    fetchCommunityNotifications(false, communityNotifications.length);
  };

  const handleOpenCompanyNotificationPopup = async () => {
    setNotificationPopupType('company');
    setNotificationPopupOpen(true);
    setNotificationLoading(true);
    try {
      const data = await companyPermissionService.getNotifications(true);
      setCompanyNotifications(data.results || []);
    } catch (error) {
      console.warn('Could not load company notifications:', error);
      showSnackbar('Could not load company notifications. Please try again.', 'error');
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.access) return undefined;

    const refreshCompanyNotifications = async () => {
      try {
        const data = await companyPermissionService.getNotifications();
        setCompanyNotifications(data.results || []);
      } catch (error) {
        console.warn('Could not refresh company notifications:', error);
      }
    };

    refreshCompanyNotifications();
    const interval = setInterval(refreshCompanyNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?.access]);

  // --- Polling for Unread Notification Count ---
  useEffect(() => {
    let pollInterval;
    const pollUnreadCount = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.access) {
          setUnreadNotificationCount(0); // Reset count if user logs out
          return;
        }
        // Use the dedicated unread count endpoint
        const count = await communityService.getUnreadNotificationCount();
        setUnreadNotificationCount(count);
      } catch (err) {
        console.error('Error polling unread count:', err);
      }
    };

    // Start polling only if user is logged in
    if (user?.access) {
      pollUnreadCount(); // Initial fetch
      // Poll every 10 seconds
      pollInterval = setInterval(pollUnreadCount, 10000);
    }

    // Cleanup interval on component unmount or user logout
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [user?.access]); // Re-run effect when user\'s access token changes

  // Existing useEffect for tabValue (remove the notification polling part from here)
  useEffect(() => {
    // ... other logic dependent on tabValue ...
    // (Notification polling moved to the new useEffect above)
  }, [tabValue]);

  const handleSettingsTabChange = (event, newValue) => {
    setSettingsTab(newValue);
  };

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setSettingsFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    try {
      // Validate passwords
      if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
        setSettingsSnackbar({
          open: true,
          message: 'All fields are required',
          severity: 'error'
        });
        return;
      }

      if (passwordData.new_password !== passwordData.confirm_password) {
        setSettingsSnackbar({
          open: true,
          message: 'New passwords do not match',
          severity: 'error'
        });
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_HOST}/api/settings/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error changing password');
      }

      setSettingsSnackbar({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });

      // Reset password form
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setSettingsSnackbar({
        open: true,
        message: error.message || 'Error changing password',
        severity: 'error'
      });
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setIsUpdating(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();

      // Add profile image if it exists
      if (profileImage) {
        formData.append('profile_pic', profileImage);
      }

      // Add other form fields
      Object.keys(settingsFormData).forEach(key => {
        if (settingsFormData[key] !== null && settingsFormData[key] !== undefined && key !== 'profile_pic') {
          formData.append(key, settingsFormData[key]);
        }
      });

      const response = await fetch(`${API_HOST}/api/settings/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Validation errors:\n${errorMessages}`);
        }
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      setSettingsSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });

      // Update profile image URL if changed
      if (data.profile_pic) {
        setProfileImageUrl(
          /^https?:\/\//.test(data.profile_pic)
            ? data.profile_pic
            : `${API_HOST}${data.profile_pic.startsWith('/') ? '' : '/'}${data.profile_pic}`
        );
      }
      authService.updateCurrentUser(data);

      // Reset profile image states
      setProfileImage(null);
      setProfileImagePreview(null);

      // Refresh the profile data
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setSettingsSnackbar({
        open: true,
        message: error.message || 'Error updating profile',
        severity: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSettingsSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
      setProfileImage(file);

      // Update the form data with the new file
      setSettingsFormData(prev => ({
        ...prev,
        profile_pic: file
      }));
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete) {
      await companyService.deleteCompany(companyToDelete.id);
      setMyCompanies(prev => prev.filter(c => c.id !== companyToDelete.id));
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        // Call your user deletion API here
        // await userService.deleteUser(userToDelete.id);

        // Update the UI by removing the deleted user
        setCompanyUsers(prev => prev.filter(u => u.id !== userToDelete.id));

        // Close the dialog and reset the state
        setDeleteDialogOpen(false);

        // Show success message
        showSnackbar('User deleted successfully!', 'success');

        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        showSnackbar('Failed to delete user. Please try again.', 'error');
      }
    }
  };

  const handleStatusClick = (company) => {
    setStatusCompany(company);
    setStatusDialogOpen(true);
  };

  const handleStatusClose = () => {
    setStatusDialogOpen(false);
    setStatusCompany(null);
  };

  const handleTrackProgressExitChange = (field, value) => {
    setTrackProgressForm(prev => ({
      ...prev,
      exitEvent: { ...prev.exitEvent, notice: value },
    }));
  };

  const handleTrackProgressKPIChange = (field, value) => {
    setTrackProgressForm(prev => ({
      ...prev,
      kpis: { ...prev.kpis, [field]: value },
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map(file => ({
        file: file,
        name: file.name,
        preview: URL.createObjectURL(file)
      }));
      setTrackProgressForm(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
    }
    e.target.value = '';
  };

  const handleRemoveDocument = (idx) => {
    setTrackProgressForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== idx),
    }));
  };

  const handleTrackProgressFormChange = (field, value) => {
    setTrackProgressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTrackProgress = async () => {
    if (!trackProgressCompany) return;
    setTrackProgressLoading(true);
    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('company_id', trackProgressCompany.id);
    formData.append('notice', trackProgressForm.exitEvent.notice);
    formData.append('current_company_valuation', trackProgressForm.kpis.revenue);
    formData.append('revenue_rate', trackProgressForm.kpis.revenueRate);
    formData.append('burn_rate', trackProgressForm.kpis.burnRate);
    formData.append('retention_rate', trackProgressForm.kpis.retention);

    // Add files to form data
    trackProgressForm.documents.forEach(doc => {
      if (doc.file) {
        formData.append('investment_documents', doc.file, doc.name);
      }
    });

    // Company Update: Only update if text is non-empty and changed
    const updateText = trackProgressForm.updates[0]?.text || '';
    if (updateText && updateText !== lastSavedCompanyUpdate) {
      const updateData = {
        company_id: trackProgressCompany.id,
        title: updateText,
      };
      try {
        // Always create new update entry
        const res = await companyService.createCompanyUpdate(updateData);
        setCompanyUpdateId(res.data.id);
        setLastSavedCompanyUpdate(updateText);
      } catch (err) {
        console.error('Error saving company update:', err);
      }
    }
    try {
      // Always create new track progress entry
      await companyService.createTrackProgress(formData);
      // Show success snackbar
      setSnackbarMessage('Track progress updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setOpenTrackProgressDialog(false);
      // Clear form after successful save
      setTrackProgressForm({
        exitEvent: { notice: '' },
        kpis: { revenue: '', revenueRate: '', burnRate: '', retention: '' },
        documents: [],
        updates: [{ text: '' }]
      });
    } catch (err) {
      console.error('Error saving progress:', err);
      setSnackbarMessage('Error saving progress. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setTrackProgressLoading(false);
  };

  const handleOpenTrackProgressDialog = async (company) => {
    setTrackProgressCompany(company);
    setOpenTrackProgressDialog(true);
    setTrackProgressLoading(true);
    // Reset all state for new company before fetching
    setTrackProgressId(null);
    setCompanyUpdateId(null);
    setTrackProgressForm({
      exitEvent: { notice: '' },
      kpis: { revenue: '', revenueRate: '', burnRate: '', retention: '' },
      documents: [],
      updates: [{ text: '' }],
    });
    try {
      // Fetch track progress
      const res = await companyService.getTrackProgress(company.id);
      const results = res.data.results || [];

      // Process track progress data
      if (results.length > 0) {
        const latestProgress = results[0];
        setTrackProgressForm(prev => ({
          ...prev,
          exitEvent: { notice: latestProgress.notice || '' },
          kpis: {
            revenue: latestProgress.current_company_valuation || '',
            revenueRate: latestProgress.revenue_rate || '',
            burnRate: latestProgress.burn_rate || '',
            retention: latestProgress.retention_rate || ''
          },
          documents: latestProgress.investment_documents ? [
            {
              name: latestProgress.investment_documents.split('/').pop(),
              preview: latestProgress.investment_documents,
              file: null // We don't have the actual file, just the URL
            }
          ] : []
        }));
      }
      if (results.length > 0) {
        const progress = results[0];
        setTrackProgressId(progress.id);
        setTrackProgressForm(prev => ({
          ...prev,
          exitEvent: { notice: progress.notice || '' },
          kpis: {
            revenue: progress.current_company_valuation || '',
            revenueRate: progress.revenue_rate || '',
            burnRate: progress.burn_rate || '',
            retention: progress.retention_rate || '',
          },
          documents: progress.investment_documents ? [
            {
              name: progress.investment_documents.split('/').pop(),
              preview: progress.investment_documents,
              file: null // We don't have the actual file, just the URL
            }
          ] : []
        }));
      }
      // Fetch company update
      const updateRes = await companyService.getCompanyUpdates(company.id);
      const updateResults = updateRes.data.results || [];
      if (updateResults.length > 0) {
        setCompanyUpdateId(updateResults[0].id);
        setTrackProgressForm(prev => ({
          ...prev,
          updates: [{ text: updateResults[0].title || '' }],
        }));
        setLastSavedCompanyUpdate(updateResults[0].title || '');
      } else {
        setLastSavedCompanyUpdate('');
      }
    } catch (err) {
      // handle error
    }
    setTrackProgressLoading(false);
  };

  const handleViewCompanyDetails = async (company) => {
    // Default values for investment info
    const defaultInvestment = {
      invested: 5000,
      investmentHistory: [
        { date: '2024-01', value: 5000 },
        { date: '2024-06', value: 5200 },
        { date: '2024-12', value: 6000 },
        { date: '2025-04', value: 8000 }
      ],
      sharePercentage: 1.2,
      shares: 50,
      investedDate: '2024-01-12',
      exitEvent: null,
    };
    let mergedCompany = { ...company, ...defaultInvestment };
    try {
      // Fetch track progress
      const progressRes = await companyService.getTrackProgress(company.id);
      const progress = (progressRes.data.results && progressRes.data.results[0]) || null;
      if (progress) {
        mergedCompany.notice = progress.notice || null;
        mergedCompany.kpis = {
          revenue: progress.current_company_valuation || null,
          revenueRate: progress.revenue_rate || null,
          burnRate: progress.burn_rate || null,
          retention: progress.retention_rate || null,
        };
        mergedCompany.documents = progress.investment_documents ? [
          {
            name: progress.investment_documents.split('/').pop(),
            preview: progress.investment_documents,
            file: null // We don't have the actual file, just the URL
          }
        ] : [];
      } else {
        mergedCompany.notice = null;
        mergedCompany.kpis = { revenue: null, revenueRate: null, burnRate: null, retention: null };
        mergedCompany.documents = [];
      }
      // Fetch company updates
      const updatesRes = await companyService.getCompanyUpdates(company.id);
      const updates = (updatesRes.data.results || []).map(u => ({ text: u.title, date: u.created_at }));
      mergedCompany.updates = updates.length > 0 ? updates : [];
    } catch (err) {
      mergedCompany.notice = null;
      mergedCompany.kpis = { revenue: null, revenueRate: null, burnRate: null, retention: null };
      mergedCompany.documents = [];
      mergedCompany.updates = [];
    }
    setSelectedCompany(mergedCompany);
    setCompanyDetailsOpen(true);
  };

  const handleOpenPermitDialog = async (company) => {
    setPermitDialogCompany(company);
    setPermitDialogOpen(true);
    setPermitLoading(true);
    setPermitError('');
    try {
      const data = await companyPermissionService.fetchRequests(company.id);
      setPermitUsers(data);
      if (!data || data.length === 0) setPermitError('No user made any request.');
    } catch (err) {
      setPermitError('Failed to fetch permission requests.');
      setPermitUsers([]);
    }
    setPermitLoading(false);
  };

  const handleClosePermitDialog = () => {
    setPermitDialogOpen(false);
    setPermitDialogCompany(null);
    setPermitSearch('');
    setPermitStatusFilter('');
  };

  const handlePermitStatusChange = async (permissionId, newStatus) => {
    try {
      let company_permission = 'no';
      if (newStatus === 'Approved') {
        company_permission = 'yes';
      } else if (newStatus === 'Pending') {
        company_permission = 'pending';
      } else if (newStatus === 'Rejected') {
        company_permission = 'no';
      }

      console.log('Updating permission status:', { permissionId, company_permission });
      const response = await companyPermissionService.updateRequest(permissionId, {
        company_permission,
        status: newStatus.toLowerCase()
      });
      console.log('Update response:', response);

      if (response.status === 'success' || response.status === 'updated') {
        // Update the local state with the new status
        setPermitUsers(prev => prev.map(u =>
          u.id === permissionId ? { ...u, company_permission } : u
        ));
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating permission status:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message;
      alert('Failed to update permission status: ' + errorMessage);
    }
  };

  const handlePermitUserDelete = async (permissionId) => {
    try {
      await companyPermissionService.deleteRequest(permissionId);
      setPermitUsers(prev => prev.filter(u => u.id !== permissionId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleViewPermitUser = async (permissionId) => {
    try {
      const user = await companyPermissionService.getRequest(permissionId);
      setPermitUserDetail(user);
      setPermitUserDetailOpen(true);
    } catch (err) {
      alert('Failed to fetch user details');
    }
  };

  const handleCloseCreateCompanyDialog = () => {
    setOpenCreateCompanyDialog(false);
  };

  const handleFundingSetupSuccess = async () => {
    setOpenFundingSetup(false);
    setOpenCreateCompanyDialog(false);
    setValue(1);

    try {
      const currentUser = authService.getCurrentUser();
      const userId = currentUser?.id || currentUser?.user_id || currentUser?.pk;
      if (userId) {
        const userCompanies = await companyService.getCompanies({ user: userId });
        setMyCompanies(userCompanies);
      }
    } catch (error) {
      console.error('Error refreshing my companies after creation:', error);
    }
  };

  const handleOpenCompanyView = (company) => {
    setSelectedCompany(company);
    setOpenCompanyView(true);
  };

  const handleCloseCompanyView = () => {
    setOpenCompanyView(false);
    setSelectedCompany(null);
  };

  // Add handler to open users dialog
  const handleOpenCompanyUsers = async (company) => {
    setSelectedCompanyForUsers(company);
    setOpenCompanyUsersDialog(true);
    setCompanyUsersLoading(true);
    setCompanyUsersError('');
    try {
      const payments = await companyService.getUserPayments(company.id);
      // Group by user, show only users with at least one payment
      const userMap = {};
      for (const payment of payments) {
        if (!userMap[payment.user.id]) {
          userMap[payment.user.id] = {
            user_id: payment.user.id,
            user: payment.user, // User details are now included in the payment
            payments: []
          };
        }
        userMap[payment.user.id].payments.push(payment);
      }
      setCompanyUsers(Object.values(userMap));
    } catch (err) {
      setCompanyUsersError('Failed to load users');
      setCompanyUsers([]);
    } finally {
      setCompanyUsersLoading(false);
    }
  };

  // Add handler to open user profile dialog
  const handleViewUserProfile = (user) => {
    setSelectedUserProfile(user);
    setOpenUserProfileDialog(true);
  };

  const handleCompanyUserAmountRangeChange = (event, newValue) => {
    setCompanyUserAmountRange(newValue);
  };

  // Add this function to fetch and filter last 3 months of progress for a company
  const getLast3MonthsProgress = (progresses, companyId) => {
    const threeMonthsAgo = subMonths(new Date(), 3);
    return progresses
      .filter(p => p.company_id === companyId && isAfter(new Date(p.created_at), threeMonthsAgo))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  // Inside your Dashboard component, add state for track progress
  const [trackProgress, setTrackProgress] = useState([]);

  // Fetch progress for selected company
  useEffect(() => {
    if (selectedCompany) {
      companyService.getTrackProgress(selectedCompany.id)
        .then(res => setTrackProgress(res.data?.results || []))
        .catch(() => setTrackProgress([]));
    }
  }, [selectedCompany]);

  // Filter for last 3 months
  const last3MonthsProgress = trackProgress
    .filter(p => isAfter(new Date(p.created_at), subMonths(new Date(), 3)))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const chartData = {
    labels: last3MonthsProgress.map(p => new Date(p.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Valuation',
        data: last3MonthsProgress.map(p => p.current_company_valuation),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Revenue Rate',
        data: last3MonthsProgress.map(p => p.revenue_rate),
        borderColor: '#388e3c',
        backgroundColor: 'rgba(56, 142, 60, 0.1)',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Burn Rate',
        data: last3MonthsProgress.map(p => p.burn_rate),
        borderColor: '#d32f2f',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Retention Rate',
        data: last3MonthsProgress.map(p => p.retention_rate),
        borderColor: '#fbc02d',
        backgroundColor: 'rgba(251, 192, 45, 0.1)',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Add to component state
  const [messageMenuAnchorEl, setMessageMenuAnchorEl] = useState(null);
  const [messageMenuMsgId, setMessageMenuMsgId] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [chatDeleteMessageId, setChatDeleteMessageId] = useState(null);
  const [chatDeleteDialogOpen, setChatDeleteDialogOpen] = useState(false);

  // Add handler for editing a message
  const handleEditMessage = async (messageId, newText) => {
    try {
      setLoading(true);
      await chatService.editMessage(messageId, newText);
      if (selectedChat) {
        await fetchConversation(selectedChat.id);
      }
    } catch (error) {
      setUsersError('Failed to edit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add at the top of the Dashboard component
  const [activityLog, setActivityLog] = useState([
    {
      type: 'investment',
      company: 'Acme Corp',
      amount: 500,
      time: '2024-05-01T14:30:00Z'
    },
    {
      type: 'post',
      title: 'New AI Startup',
      time: '2024-05-02T09:15:00Z'
    },
    {
      type: 'investment',
      company: 'Beta Ltd',
      amount: 1200,
      time: '2024-05-03T11:00:00Z'
    },
    {
      type: 'post',
      title: 'How to grow your business',
      time: '2024-05-04T16:45:00Z'
    },
  ]);

  // Add state for Edit Post tag input
  const [editTagInput, setEditTagInput] = useState('');

  // Handler to add tags in Edit Post dialog
  const handleEditTagAdd = (e) => {
    if (e.type === 'blur' || e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      const value = (editTagInput || '').trim().replace(/^#/, '');
      if (value && !(editForm.tags || []).includes(value)) {
        setEditForm(f => ({ ...f, tags: [...(f.tags || []), value] }));
      }
      setEditTagInput('');
      if (e.key) e.preventDefault();
    }
  };

  // Handler to delete tags in Edit Post dialog
  const handleEditTagDelete = (tagToDelete) => {
    setEditForm(f => ({ ...f, tags: (f.tags || []).filter(t => t !== tagToDelete) }));
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/*<IconButton color="inherit" onClick={handleLangMenuOpen}><LanguageIcon /></IconButton>
            <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={handleLangMenuClose}>
              <MenuItem selected={language === 'English'} onClick={() => handleLanguageChange('English')}>English</MenuItem>
              <MenuItem selected={language === 'Bangla'} onClick={() => handleLanguageChange('Bangla')}>Bangla</MenuItem>
            </Menu>
            <IconButton color="inherit" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>*/}
            {/*<Avatar sx={{ width: 36, height: 36, ml: 1, border: '2px solid #6c63ff' }} src={userProfile?.profile_pic ? `/images/profile_pic/${userProfile.profile_pic}` : undefined}>
              {userProfile?.first_name ? userProfile.first_name[0] : 'P'}
            </Avatar>*/}
            <Avatar
              src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
              alt="Profile"
              sx={{ width: 36, height: 36, ml: 1, border: '2px solid #6c63ff' }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'Innovest'} {userProfile?.last_name || 'Admin'}</Typography>
              <Typography variant="caption" color="text.secondary">{userProfile?.title || 'Founder'}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Dashboard Content */}
      <Container maxWidth={false} disableGutters sx={{ py: 4, px: { xs: 1, sm: 3, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <Tabs
                value={value}
                onChange={handleTabChange}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  px: 2,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }
                }}
              >
                <Tab
                  icon={<BarChartIcon sx={{ fontSize: 20, color: value === 0 ? '#1890ff' : 'inherit' }} />}
                  iconPosition="start"
                  label={<span style={{ color: value === 0 ? '#1890ff' : 'inherit', fontWeight: value === 0 ? 700 : 600 }}>Dashboard</span>}
                />
                <Tab
                  icon={<BusinessIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="My Companies"
                />
                <Tab
                  icon={<BusinessIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Backed"
                />
                <Tab
                  icon={<GroupsIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Community"
                />
                <Tab
                  icon={<BarChartIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Analysis"
                />
                <Tab icon={<ChatIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Chat" />
                <Tab icon={<SettingsIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Settings" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {value === 0 && (
                  <>
                    {/* Greeting and Date Picker Row */}
                    <Container maxWidth={false} disableGutters sx={{ mt: 0, mb: 2, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" sx={{ color: '#233876', fontWeight: 700 }}>
                            Good Morning, {userProfile?.first_name || 'User'}!
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Here's what's happening with your store today.
                          </Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 2, px: 2, py: 1, border: '1px solid #eee', minWidth: 220 }}>
                            <CalendarMonthIcon sx={{ color: '#233876', mr: 1 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {format(now, 'dd MMM, yyyy')} &nbsp;|&nbsp; {format(now, 'hh:mm:ss a')}
                            </Typography>
                          </Box>
                          {/*<Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                            onClick={() => setOpenAddTask(true)}
                          >
                            Add Task
                          </Button>*/}
                        </Grid>
                      </Grid>
                    </Container>
                    {/* Summary Cards Row */}
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">TOTAL COMPANIES</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {loading ? <CircularProgress size={24} /> : analyticsData.totalCompanies}
                            </Typography>

                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">TOTAL INVESTORS</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {loading ? <CircularProgress size={24} /> : analyticsData.totalInvestors.toLocaleString()}
                            </Typography>

                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">MY POSTS</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {loading ? <CircularProgress size={24} /> : analyticsData.totalPosts.toLocaleString()}
                            </Typography>

                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">TOTAL BALANCE</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {loading ? <CircularProgress size={24} /> : `৳${analyticsData.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </Typography>

                          </Paper>
                        </Grid>
                      </Grid>
                    </Container>
                    {/* Revenue and Sales by Location Section */}
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container spacing={3}>
                        {/* Activity Log Section */}
                        {/*<Grid item xs={12} md={8}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3', minHeight: 320 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Activity Log</Typography>
                            </Box>
                            <Box sx={{ maxHeight: 260, overflowY: 'auto' }}>
                              {activityLog.length === 0 ? (
                                <Typography color="text.secondary">No recent activity.</Typography>
                              ) : (
                                activityLog.map((activity, idx) => (
                                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, borderRadius: 2, background: '#f7f9fb' }}>
                                    {activity.type === 'investment' ? (
                                      <MonetizationOnIcon color="primary" />
                                    ) : (
                                      <LightbulbIcon color="warning" />
                                    )}
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {activity.type === 'investment'
                                          ? `You invested ৳${activity.amount} in ${activity.company}`
                                          : `You posted an idea: "${activity.title}"`}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(activity.time).toLocaleString()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))
                              )}
                            </Box>
                          </Paper>
                        </Grid>*/}
                        {/* Events Section */}
                        <Grid item xs={12} md={4}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3', height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Upcoming Events (next 7 days)</Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
                                onClick={() => navigate('/events')}
                              >
                                View All
                              </Button>
                            </Box>

                            {eventsLoading ? (
                              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress size={24} />
                              </Box>
                            ) : upcomingEvents.length > 0 ? (
                              <Box>
                                {upcomingEvents.map((event) => (
                                  <Box
                                    key={event.id}
                                    sx={{
                                      mb: 2,
                                      p: 2,
                                      borderRadius: 2,
                                      background: '#f8fafc',
                                      borderLeft: '3px solid #3f51b5',
                                      '&:hover': {
                                        background: '#f1f5f9',
                                        cursor: 'pointer'
                                      }
                                    }}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                  >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                      {event.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.8rem', mb: 0.5 }}>
                                      <EventAvailableIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                      {formatDate(event.registration_end)}
                                    </Box>
                                    {event.location && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.8rem' }}>
                                        <RoomIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                        {event.location}
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                <EventAvailableIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.5 }} />
                                <Typography>No upcoming events</Typography>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      </Grid>
                    </Container>
                    {/* To-Do List Section */}
                    {/*<Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>To-Do List</Typography>
                        <List>
                          {todos.length === 0 && (
                            <Typography color="text.secondary">No tasks yet.</Typography>
                          )}
                          {todos.map(todo => (
                            <ListItem key={todo.id} secondaryAction={
                              <Box>
                                <IconButton edge="end" onClick={() => handleEditTask(todo.id, todo.text)}><EditIcon /></IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleDeleteTask(todo.id)}><DeleteIcon /></IconButton>
                              </Box>
                            }>
                              <Checkbox checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} />
                              {editTaskId === todo.id ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <TextField
                                    value={editTaskText}
                                    onChange={e => setEditTaskText(e.target.value)}
                                    onBlur={handleSaveEditTask}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') handleSaveEditTask();
                                    }}
                                    size="small"
                                    autoFocus
                                    sx={{ width: '100%' }}
                                  />
                                  <IconButton
                                    color="primary"
                                    sx={{ ml: 1 }}
                                    onClick={handleSaveEditTask}
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Box>
                              ) : (
                                <Typography sx={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 1 }}>{todo.text}</Typography>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Container>*/}
                    <Dialog open={openAddTask} onClose={() => setOpenAddTask(false)}>
                      <DialogTitle>Add Task</DialogTitle>
                      <DialogContent>
                        <TextField autoFocus fullWidth label="Task" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }} />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenAddTask(false)}>Cancel</Button>
                        <Button onClick={handleAddTask} variant="contained">Add</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}

                {/* Company View Dialog */}
                <Dialog
                  open={openCompanyView}
                  onClose={handleCloseCompanyView}
                  maxWidth="lg"
                  fullWidth
                  sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '1200px', height: '90vh' } }}
                >
                  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6">Company Details</Typography>
                    <IconButton edge="end" color="inherit" onClick={handleCloseCompanyView} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                    {selectedCompany && (
                      <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        <CompanyView
                          id={selectedCompany.id}
                          initialCompany={selectedCompany}
                          isDialog={true}
                          onClose={handleCloseCompanyView}
                        />
                      </Box>
                    )}
                  </DialogContent>
                </Dialog>

                {/* My Companies Tab */}
                {value === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">My Companies</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => {
                          // Refresh My Companies
                          const fetchMyCompanies = async () => {
                            try {
                              const user = authService.getCurrentUser();
                              const userId = user?.id || user?.user_id || user?.pk;
                              if (!userId) return;
                              const userCompanies = await companyService.getCompanies({ user: userId });
                              setMyCompanies(userCompanies);
                            } catch (err) {
                              setMyCompanies([]);
                            }
                          };
                          fetchMyCompanies();
                        }}>
                          <RefreshIcon sx={{ color: '#888' }} />
                        </IconButton>
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, ml: 0.5 }}>
                          {myCompanies.length} companies
                        </Typography>
                        <IconButton
                          onClick={handleOpenCompanyNotificationPopup}
                          aria-label="Company notifications"
                          sx={{ color: '#111', mr: 1 }}
                        >
                          <Badge badgeContent={companyNotifications.filter(notification => !notification.read).length} color="error">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                        <Button
                          variant="contained"
                          startIcon={<BusinessIcon />}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 3
                          }}
                          onClick={() => setOpenCreateCompanyDialog(true)}
                        >
                          Create Company
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<PersonIcon />}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 3,
                            background: '#1976d2',
                            ml: 1
                          }}
                          onClick={() => setAddUserDialogOpen(true)}
                        >
                          Add user
                        </Button>
                      </Box>
                    </Box>
                    {myCompanies.length === 0 ? (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 8,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1
                      }}>
                        <img
                          src="/images/company-illustration.jpg"
                          alt="No companies"
                          style={{
                            width: '200px',
                            height: 'auto',
                            marginBottom: '24px',
                            opacity: 0.8
                          }}
                        />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Companies Yet
                        </Typography>
                        <Typography color="text.secondary" align="center" sx={{ maxWidth: '400px', mb: 3 }}>
                          Start your journey by creating your first company profile. Showcase your business and attract potential investors.
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={3}>
                        {myCompanies.map((company) => (
                          <Grid item xs={12} key={company.id}>
                            <Card
                              elevation={0}
                              sx={{
                                display: 'flex',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                              }}
                            >
                              <CardMedia
                                component="img"
                                sx={{ width: 200, height: 140 }}
                                image={company.cover_image || `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`}
                                alt={company.product_name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`;
                                }}
                              />
                              <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {company.product_name}
                                  <IconButton
                                    size="small"
                                    disableRipple
                                    sx={{
                                      ml: 1,
                                      p: 0.5,
                                      borderRadius: '50%',
                                      bgcolor:
                                        company.company_status === 'Approved' ? '#4caf50' :
                                          company.company_status === 'Pending' ? '#ff9800' :
                                            company.company_status === 'Rejected' ? '#f44336' : '#bdbdbd',
                                      border: '2px solid #fff',
                                      boxShadow: 1,
                                      width: 22,
                                      height: 22,
                                      minWidth: 22,
                                      minHeight: 22,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'background 0.2s',
                                      '&:hover': {
                                        boxShadow: 3,
                                        opacity: 0.8
                                      }
                                    }}
                                    onClick={() => handleStatusClick(company)}
                                    aria-label={company.company_status}
                                  >
                                    <span style={{
                                      color: '#fff',
                                      fontWeight: 700,
                                      fontSize: '0.8rem',
                                      lineHeight: 1,
                                      userSelect: 'none',
                                      letterSpacing: 0.5
                                    }}>
                                      {company.company_status === 'Approved' ? 'A' :
                                        company.company_status === 'Pending' ? 'P' :
                                          company.company_status === 'Rejected' ? 'R' : 'O'}
                                    </span>
                                  </IconButton>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {company.quick_description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                                    onClick={() => handleOpenCompanyView(company)}
                                  >
                                    View
                                  </Button>
                                  <Button variant="outlined" size="small" color="success" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => handleOpenTrackProgressDialog(company)}>Update</Button>
                                  <Button variant="outlined" size="small" color="info" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => { setUpdateLogCompany(company); setUpdateLogOpen(true); }}>Update Log</Button>
                                  {/*<Button variant="outlined" size="small" color="error" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => handleDeleteClick(company)}>Delete</Button>*/}
                                  <Button variant="outlined" size="small" color="info" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => handleOpenCompanyUsers(company)} > Investors </Button>
                                  <Button variant="contained" size="small" color="success" sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }} onClick={() => handleOpenPermitDialog(company)}>Permit</Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
                {/* Backed Tab */}
                {value === 2 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Backed Companies</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => {
                          // Refresh Backed Companies
                          setAllCompaniesLoading(true);
                          setAllCompaniesError('');
                          const fetchAllCompanies = async () => {
                            try {
                              const user = authService.getCurrentUser();
                              const userId = user?.id || user?.user_id || user?.pk;
                              if (!userId) return;
                              const companies = await companyService.getCompanies({ company_status: '' });
                              if (!companies || companies.length === 0) {
                                setAllCompanies([]);
                                return;
                              }
                              const backedCompanies = [];
                              for (const company of companies) {
                                try {
                                  const payments = await companyService.getUserPayments(company.id);
                                  if (!payments || payments.length === 0) continue;
                                  // Filter payments by current user AND paid status
                                  const paidPayments = payments.filter(payment =>
                                    payment.payment_status === 'paid' &&
                                    payment.user &&
                                    (payment.user.id === userId || payment.user.user_id === userId || payment.user.pk === userId)
                                  );
                                  if (paidPayments.length === 0) continue;
                                  const fundraiseTerms = await companyService.getFundraiseTerms(company.id);
                                  const currentTerm = fundraiseTerms && fundraiseTerms.results && fundraiseTerms.results.length > 0 ? fundraiseTerms.results[0] : null;
                                  const preMoneyValuation = currentTerm ? parseFloat(currentTerm.pre_money_valuation) : 0;
                                  const raiseAmount = currentTerm ? parseFloat(currentTerm.raise_amount) : 0;
                                  const totalPaidInvestment = paidPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
                                  const equityPercentage = preMoneyValuation && raiseAmount ?
                                    ((totalPaidInvestment / (preMoneyValuation + raiseAmount)) * 100) : 0;
                                  backedCompanies.push({
                                    ...company,
                                    payments: paidPayments,
                                    preMoneyValuation: preMoneyValuation,
                                    raiseAmount: raiseAmount,
                                    equityPercentage: equityPercentage,
                                    invested: totalPaidInvestment,
                                    investedDate: paidPayments[0].payment_date,
                                    investmentHistory: paidPayments.map(payment => ({
                                      date: new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                                      value: parseFloat(payment.amount)
                                    }))
                                  });
                                } catch (err) {
                                  continue;
                                }
                              }
                              setAllCompanies(backedCompanies);
                            } catch (err) {
                              setAllCompaniesError('Failed to load companies');
                            } finally {
                              setAllCompaniesLoading(false);
                            }
                          };
                          fetchAllCompanies();
                        }}>
                          <RefreshIcon sx={{ color: '#888' }} />
                        </IconButton>
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, ml: 0.5 }}>
                          {allCompanies.length} companies
                        </Typography>
                      </Box>
                    </Box>
                    {allCompaniesLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <CircularProgress />
                      </Box>
                    ) : allCompaniesError ? (
                      <Typography color="error.main">{allCompaniesError}</Typography>
                    ) : allCompanies.length > 0 ? (
                      <>
                        <Grid container spacing={3}>
                          {allCompanies.slice(0, backedPage * COMPANIES_PER_PAGE).map((company) => (
                            <Grid item xs={12} key={company.id}>
                              <Card
                                elevation={0}
                                sx={{
                                  display: 'flex',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'rgba(0, 0, 0, 0.12)',
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  sx={{ width: 200, height: 140 }}
                                  image={company.cover_image || `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`}
                                  alt={company.product_name}
                                  onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop if default image fails
                                    e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`;
                                  }}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                  <Typography variant="h6" gutterBottom>
                                    {company.product_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" paragraph>
                                    {company.quick_description}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                                      onClick={() => handleViewCompanyDetails(company)}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      startIcon={<ChatIcon />}
                                      size="small"
                                      //sx={{ borderRadius: 2, ml: 'auto' }}
                                      sx={{ display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}
                                      onClick={() => handleContactFounder(company)}
                                    >
                                      Contact Founder
                                    </Button>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                        {allCompanies.length > backedPage * COMPANIES_PER_PAGE && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, alignItems: 'center', gap: 1 }}>
                            <IconButton onClick={() => {
                              // Refresh Backed Companies
                              setAllCompaniesLoading(true);
                              setAllCompaniesError('');
                              const fetchAllCompanies = async () => {
                                try {
                                  const user = authService.getCurrentUser();
                                  const userId = user?.id || user?.user_id || user?.pk;
                                  if (!userId) return;
                                  const companies = await companyService.getCompanies({ company_status: '' });
                                  if (!companies || companies.length === 0) {
                                    setAllCompanies([]);
                                    return;
                                  }
                                  const backedCompanies = [];
                                  for (const company of companies) {
                                    try {
                                      const payments = await companyService.getUserPayments(company.id);
                                      if (!payments || payments.length === 0) continue;
                                      // Filter payments by current user AND paid status
                                      const paidPayments = payments.filter(payment =>
                                        payment.payment_status === 'paid' &&
                                        payment.user &&
                                        (payment.user.id === userId || payment.user.user_id === userId || payment.user.pk === userId)
                                      );
                                      if (paidPayments.length === 0) continue;
                                      const fundraiseTerms = await companyService.getFundraiseTerms(company.id);
                                      const currentTerm = fundraiseTerms && fundraiseTerms.results && fundraiseTerms.results.length > 0 ? fundraiseTerms.results[0] : null;
                                      const preMoneyValuation = currentTerm ? parseFloat(currentTerm.pre_money_valuation) : 0;
                                      const raiseAmount = currentTerm ? parseFloat(currentTerm.raise_amount) : 0;
                                      const totalPaidInvestment = paidPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
                                      const equityPercentage = preMoneyValuation && raiseAmount ?
                                        ((totalPaidInvestment / (preMoneyValuation + raiseAmount)) * 100) : 0;
                                      backedCompanies.push({
                                        ...company,
                                        payments: paidPayments,
                                        preMoneyValuation: preMoneyValuation,
                                        raiseAmount: raiseAmount,
                                        equityPercentage: equityPercentage,
                                        invested: totalPaidInvestment,
                                        investedDate: paidPayments[0].payment_date,
                                        investmentHistory: paidPayments.map(payment => ({
                                          date: new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                                          value: parseFloat(payment.amount)
                                        }))
                                      });
                                    } catch (err) {
                                      continue;
                                    }
                                  }
                                  setAllCompanies(backedCompanies);
                                } catch (err) {
                                  setAllCompaniesError('Failed to load companies');
                                } finally {
                                  setAllCompaniesLoading(false);
                                }
                              };
                              fetchAllCompanies();
                            }}>
                              <RefreshIcon sx={{ color: '#888' }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, ml: 0.5 }}>
                              {allCompanies.length} companies
                            </Typography>
                            <Button variant="contained" onClick={() => setBackedPage(backedPage + 1)}>
                              Load More Companies
                            </Button>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 8,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1
                      }}>
                        <img
                          src="/images/company-illustration.jpg"
                          alt="No backed companies"
                          style={{
                            width: '200px',
                            height: 'auto',
                            marginBottom: '24px',
                            opacity: 0.8
                          }}
                        />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Backed Companies Yet
                        </Typography>
                        <Typography color="text.secondary" align="center" sx={{ maxWidth: '400px', mb: 3 }}>
                          Start your investment journey by backing your first company. Discover promising startups and become part of their growth story.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                {/* Community Tab */}
                {value === 3 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Community</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => {
                          // Refresh Community Posts
                          const loadPosts = async () => {
                            try {
                              const currentUser = authService.getCurrentUser();
                              if (currentUser?.access) {
                                const posts = await fetchCommunityPosts(currentUser.access);
                                setCommunityPosts(posts);
                              }
                            } catch (err) { }
                          };
                          loadPosts();
                        }}>
                          <RefreshIcon sx={{ color: '#888' }} />
                        </IconButton>
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, ml: 0.5 }}>
                          {communityPosts.filter(post =>
                            post.user && (typeof post.user === 'object'
                              ? post.user.id === userProfile?.id
                              : String(post.user) === String(userProfile?.id)
                            )
                          ).length} posts
                        </Typography>
                        {/* Notification Icon with Badge */}
                        <IconButton color="inherit" onClick={handleOpenNotificationPopup} sx={{ position: 'relative' }} aria-label="Show notifications">
                          <Badge badgeContent={unreadNotificationCount} color="error" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                            <NotificationsIcon sx={{ fontSize: 28 }} />
                          </Badge>
                        </IconButton>
                        {/*<Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon sx={{ fontSize: 22 }} />}
                          sx={{
                            fontWeight: 800,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                            px: 2.5,
                            py: 0.7,
                            fontSize: '0.98rem',
                            letterSpacing: 0.5,
                            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                            textTransform: 'uppercase',
                            minWidth: 0,
                            '&:hover': {
                              background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
                              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)'
                            }
                          }}
                          onClick={() => setOpenShareIdea(true)}
                        >
                          Share Post
                        </Button>*/}
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                          onClick={() => setOpenShareIdea(true)}
                        >
                          + Share Post
                        </Button>
                      </Box>
                    </Box>
                    {/* Search box with clear (cross) icon */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Search by title or tags..."
                        value={ideaSearch}
                        onChange={e => setIdeaSearch(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleCommunitySearch(); }}
                        sx={{
                          width: 320,
                          background: '#f7f9fb',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, pl: 1 },
                        }}
                        InputProps={{
                          sx: { background: '#f7f9fb', borderRadius: 2, fontSize: 16 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={ideaStatusFilter}
                          displayEmpty
                          onChange={e => { setIdeaStatusFilter(e.target.value); handleCommunitySearch(e.target.value, ideaVisibilityFilter); }}
                          sx={{ borderRadius: 2, background: '#fff' }}
                        >
                          <MenuItem value="">All Types</MenuItem>
                          <MenuItem value="Discussion">Discussion</MenuItem>
                          <MenuItem value="Project Update">Project Update</MenuItem>
                          <MenuItem value="Question">Question</MenuItem>
                          <MenuItem value="Idea">Idea</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                          <MenuItem value="Event">Event</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={ideaVisibilityFilter}
                          displayEmpty
                          onChange={e => { setIdeaVisibilityFilter(e.target.value); handleCommunitySearch(ideaStatusFilter, e.target.value); }}
                          sx={{ borderRadius: 2, background: '#fff' }}
                        >
                          <MenuItem value="">All Visibility</MenuItem>
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        sx={{
                          background: '#233876',
                          color: '#fff',
                          borderRadius: 2,
                          fontWeight: 700,
                          px: 3,
                          boxShadow: 'none',
                          textTransform: 'uppercase',
                          height: 40,
                          '&:hover': { background: '#1a285a' },
                        }}
                        startIcon={<SearchIcon />}
                        onClick={() => handleCommunitySearch(ideaStatusFilter, ideaVisibilityFilter)}
                      >
                        Filters
                      </Button>
                    </Box>
                    {/* My Posts Section (moved directly under search/filter) */}
                    {userProfile && (() => {
                      // Use filteredPosts instead of myPosts
                      const myPosts = filteredPosts;
                      return (
                        <Box sx={{ mb: 3, background: '#f7f9fb', borderRadius: 2, p: 2, border: '1px solid #e3e8ef' }}>
                          {/*<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>My Posts</Typography>*/}
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Title</TableCell>
                                  <TableCell>Post Type</TableCell>
                                  <TableCell>Visibility</TableCell>
                                  <TableCell>Post At</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {myPosts.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center" style={{ color: '#999' }}>No posts found for this user.</TableCell>
                                  </TableRow>
                                ) : myPosts
                                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                  .map(post => (
                                    <TableRow key={post.id}>
                                      <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={post.type}
                                          sx={{ bgcolor: '#f5f5f5', color: '#333', fontWeight: 600, borderRadius: 2, px: 1.5, fontSize: 14 }}
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={post.visibility}
                                          sx={{
                                            bgcolor: post.visibility === 'public' ? '#388e3c' : '#fbc02d',
                                            color: '#fff',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            px: 1.5,
                                            fontSize: 14
                                          }}
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {post.created_at ? format(new Date(post.created_at), 'MMM dd, yyyy hh:mm a') : ''}
                                      </TableCell>
                                      <TableCell>
                                        <IconButton color="primary" onClick={() => setViewPost(post)}><VisibilityIcon /></IconButton>
                                        <IconButton color="primary" onClick={() => { setEditPost(post); setEditForm({ title: post.title, type: post.type, description: post.description }); }}><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => setDeletePost(post)}><DeleteIcon /></IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      );
                    })()}
                  </Box>
                )}
                {/* Analysis Tab */}
                {value === 4 && (
                  <Analysis />
                )}
                {/* Chat Tab */}
                {value === 5 && (
                  <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#faf9f7', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                    {/* Left: Chat List */}
                    <Box sx={{
                      width: 420,
                      background: '#fcf8f3',
                      borderRight: '1px solid #eee',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Chats</Typography>
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          size="small"
                          placeholder="Search here..."
                          value={chatSearch}
                          onChange={handleChatSearchChange}
                          sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        {chatSuggestions.length > 0 && (
                          <Paper sx={{ position: 'absolute', zIndex: 10, width: '90%', left: '5%', mt: '-8px', maxHeight: 200, overflowY: 'auto' }}>
                            {chatSuggestions.filter(user => !authService.isAdmin(user)).map(user => (
                              <Box
                                key={user.id}
                                sx={{ p: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#f0f4fa' }, display: 'flex', alignItems: 'center', gap: 2 }}
                                onClick={() => handleChatSuggestionClick(user)}
                              >
                                <Avatar
                                  sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '1rem' }}
                                  src={user.profile_pic ? `${API_HOST}${user.profile_pic}` : undefined}
                                >
                                  {(!user.profile_pic && (user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()))}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0]}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {user.title || 'User'}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Paper>
                        )}
                      </Box>
                      <Tabs value={chatTab} onChange={(_, v) => setChatTab(v)} sx={{ mb: 2 }}>
                        <Tab label="CHATS" value="chats" sx={{ fontWeight: 700 }} />
                      </Tabs>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 1 }}>
                        <Button
                          variant={chatFilter === 'accepted' ? 'contained' : 'outlined'}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', flex: 1 }}
                          onClick={() => setChatFilter('accepted')}
                        >
                          Accepted
                        </Button>
                        <Button
                          variant={chatFilter === 'other' ? 'contained' : 'outlined'}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', flex: 1 }}
                          onClick={() => setChatFilter('other')}
                        >
                          Message Requests
                        </Button>
                      </Box>
                      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' } }}>
                        {usersLoading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>Loading users...</Typography>
                          </Box>
                        ) : usersError ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
                            <Alert severity="error" sx={{ mb: 2 }}>
                              {usersError}
                            </Alert>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={fetchUsers}
                              startIcon={<RefreshIcon />}
                            >
                              Retry
                            </Button>
                          </Box>
                        ) : chatUsers.length === 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
                            <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary">
                              No users found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Other users will appear here when they register
                            </Typography>
                          </Box>
                        ) : (
                          chatUsers
                            .filter(userItem => !authService.isAdmin(userItem))
                            .filter(userItem => {
                              const req = getRequestStatus(userItem.id);
                              if (chatFilter === 'accepted') {
                                return req && req.status === 'accepted';
                              } else {
                                return !req || req.status !== 'accepted';
                              }
                            })
                            .map((userItem) => {
                              const req = getRequestStatus(userItem.id);
                              return (
                                <Box
                                  key={userItem.id}
                                  onClick={() => {
                                    if (req && req.status === 'accepted') setSelectedChat(userItem);
                                  }}
                                  sx={{
                                    p: 2,
                                    cursor: req && req.status === 'accepted' ? 'pointer' : 'default',
                                    '&:hover': { bgcolor: req && req.status === 'accepted' ? 'rgba(0, 0, 0, 0.04)' : 'transparent' },
                                    bgcolor: selectedChat?.id === userItem.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                    borderRadius: 1,
                                    mb: 0.5
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: 'primary.main',
                                        fontSize: '1rem'
                                      }}
                                      src={userItem.profile_pic ? `${API_HOST}${userItem.profile_pic}` : undefined}
                                    >
                                      {(!userItem.profile_pic && (userItem.first_name ? userItem.first_name[0].toUpperCase() : userItem.email[0].toUpperCase()))}
                                    </Avatar>
                                    <Box sx={{ ml: 2, minWidth: 0 }}>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          fontWeight: 600
                                          // Removed whiteSpace, overflow, textOverflow to allow full name display
                                        }}
                                      >
                                        {userItem.first_name && userItem.last_name
                                          ? `${userItem.first_name} ${userItem.last_name}`
                                          : userItem.email.split('@')[0]}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'
                                        }}
                                      >
                                        {userItem.title || 'User'}
                                      </Typography>
                                    </Box>
                                    {/* Request logic UI */}
                                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {req ? (
                                        req.status === 'pending' && req.direction === 'sent' ? (
                                          <Button size="small" disabled>Pending Approval</Button>
                                        ) : req.status === 'pending' && req.direction === 'received' ? (
                                          <Stack direction="column" spacing={1} alignItems="flex-end" sx={{ ml: 2 }}>
                                            <Button size="small" color="success" variant="contained" onClick={e => { e.stopPropagation(); handleRespondRequest(req.request.id, 'accept'); }}>Accept</Button>
                                            <Button size="small" color="error" variant="contained" onClick={e => { e.stopPropagation(); handleRespondRequest(req.request.id, 'reject'); }}>Reject</Button>
                                          </Stack>
                                        ) : req.status === 'rejected' ? (
                                          <Stack direction="column" spacing={1} alignItems="flex-end" sx={{ ml: 2 }}>
                                            <Button size="small" disabled>Rejected</Button>
                                            <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleSendRequest(userItem.id); }}>Request Again</Button>
                                          </Stack>
                                        ) : req.status === 'accepted' ? null : null
                                      ) : (
                                        <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleSendRequest(userItem.id); }}>Request</Button>
                                      )}
                                      {/* Three-dot menu icon */}
                                      <IconButton
                                        size="small"
                                        onClick={e => {
                                          e.stopPropagation();
                                          setChatMenuAnchorEl(e.currentTarget);
                                          setChatMenuUser(userItem);
                                        }}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            })
                        )}
                      </Box>
                    </Box>
                    {/* Right: Chat Window */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#faf9f7', minHeight: 0 }}>
                      {selectedChat ? (
                        <>
                          {/* Chat Header */}
                          <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', p: 2, background: '#fff' }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                fontSize: '1rem'
                              }}
                              src={selectedChat.profile_pic ? `${API_HOST}${selectedChat.profile_pic}` : undefined}
                            >
                              {(!selectedChat.profile_pic && (selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()))}
                            </Avatar>
                            <Box sx={{ flex: 1, ml: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {selectedChat.first_name && selectedChat.last_name
                                  ? `${selectedChat.first_name} ${selectedChat.last_name}`
                                  : selectedChat.email.split('@')[0]}
                              </Typography>
                              <Typography variant="caption" color="success.main">
                                {selectedChat.title || 'User'}
                              </Typography>
                              {/* Removed active status indicator */}
                            </Box>
                            {/* Removed connection status, search, and more options icons */}
                          </Box>
                          {/* Show request status message above chat messages if not accepted */}
                          {selectedChat && getRequestStatus(selectedChat.id)?.status !== 'accepted' && (
                            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
                              {(() => {
                                const req = getRequestStatus(selectedChat.id);
                                if (!req) return 'You need to send a request to start messaging.';
                                if (req.status === 'pending' && req.direction === 'sent') return 'Your request is pending approval.';
                                if (req.status === 'pending' && req.direction === 'received') return 'This user wants to message you. Accept or reject the request.';
                                if (req.status === 'rejected') return 'Request was rejected. You can request again.';
                                return null;
                              })()}
                            </Box>
                          )}
                          {/* Chat Messages */}
                          <Box
                            ref={messagesContainerRef}
                            sx={{
                              flex: 1,
                              p: 3,
                              overflowY: 'auto',
                              background: '#faf9f7',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              minHeight: 0,
                              maxHeight: '100%'
                            }}
                          >
                            {/* Only show loading spinner when switching chats, not when sending a message */}
                            {loading && messages.length === 0 ? (
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                              </Box>
                            ) : messages.length === 0 ? (
                              <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'text.secondary'
                              }}>
                                <Typography variant="body1">No messages yet</Typography>
                                <Typography variant="body2">Start the conversation!</Typography>
                              </Box>
                            ) : (
                              (() => {
                                // Helper to format date header
                                const formatHeader = (dateObj) => {
                                  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
                                  const now = new Date();
                                  const isToday = dateObj.getDate() === now.getDate() && dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
                                  if (isToday) {
                                    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  } else {
                                    return `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()} AT ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                  }
                                };
                                // Group messages by header string
                                const groups = {};
                                messages.forEach(msg => {
                                  const header = formatHeader(msg.timestamp);
                                  if (!groups[header]) groups[header] = [];
                                  groups[header].push(msg);
                                });
                                return Object.entries(groups).map(([header, msgs]) => (
                                  <React.Fragment key={header}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                      <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 0.5, borderRadius: 1, background: '#e3e8ef', fontWeight: 600 }}>
                                        {header}
                                      </Typography>
                                    </Box>
                                    {msgs.map(msg => (
                                      <Box
                                        key={msg.id}
                                        ref={el => { messageRefs.current[msg.id] = el; }}
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: msg.self ? 'flex-end' : 'flex-start',
                                          alignItems: 'flex-end',
                                          width: '100%',
                                          mb: 0.5,
                                          position: 'relative',
                                        }}
                                      >
                                        {/* For received messages: avatar (left) */}
                                        {!msg.self && (
                                          <Avatar
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              bgcolor: 'primary.main',
                                              fontSize: '0.875rem',
                                              mr: 1,
                                              flexShrink: 0
                                            }}
                                            src={msg.sender_profile_pic ? `${API_HOST}${msg.sender_profile_pic}` : undefined}
                                            alt={selectedChat.first_name ? selectedChat.first_name[0].toUpperCase() : selectedChat.email[0].toUpperCase()}
                                          />
                                        )}
                                        {/* For sent messages: delete icon (left) */}
                                        {msg.self && !msg.text.includes('This message was deleted by') && (
                                          <IconButton
                                            size="small"
                                            onClick={e => {
                                              e.stopPropagation();
                                              setMessageMenuAnchorEl(e.currentTarget);
                                              setMessageMenuMsgId(msg.id);
                                              setEditMessageText(msg.text || ''); // Set the text for editing
                                            }}
                                            sx={{
                                              color: 'grey.700',
                                              mr: 1,
                                              alignSelf: 'center',
                                              transition: 'color 0.2s, background 0.2s',
                                              '&:hover': {
                                                color: 'primary.main',
                                                background: 'rgba(0,0,0,0.04)',
                                              },
                                              flexShrink: 0
                                            }}
                                          >
                                            <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
                                          </IconButton>
                                        )}
                                        {/* Message bubble */}
                                        <Box sx={{
                                          flex: '0 1 auto',
                                          width: 'fit-content',
                                          minWidth: '2.5em',
                                          maxWidth: msg.text && msg.text.length > 15 ? { xs: '80%', sm: '60%', md: '420px' } : 'none',
                                          px: 1.2,
                                          py: 0.7,
                                          borderRadius: msg.self ? '1.5em 1.5em 0.5em 1.5em' : '1.5em 1.5em 1.5em 0.5em',
                                          background: msg.self ? 'primary.main' : 'background.paper',
                                          color: msg.self ? 'white' : 'text.primary',
                                          boxShadow: 1,
                                          position: 'relative',
                                          wordBreak: 'break-word',
                                          overflow: 'hidden',
                                          minHeight: '2.5em',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          textAlign: 'center',
                                        }}>
                                          {/* Message text */}
                                          {editMessageId === msg.id ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                              <TextField
                                                value={editMessageText}
                                                onChange={e => setEditMessageText(e.target.value)}
                                                onKeyDown={async e => {
                                                  if (e.key === 'Enter') {
                                                    setMessages(prev =>
                                                      prev.map(m =>
                                                        m.id === msg.id ? { ...m, text: editMessageText } : m
                                                      )
                                                    );
                                                    await handleEditMessage(msg.id, editMessageText);
                                                    setEditMessageId(null);
                                                  } else if (e.key === 'Escape') {
                                                    setEditMessageId(null);
                                                  }
                                                }}
                                                size="small"
                                                autoFocus
                                                sx={{ width: '100%' }}
                                              />
                                              <IconButton
                                                color="primary"
                                                sx={{ ml: 1 }}
                                                onClick={async () => {
                                                  setMessages(prev =>
                                                    prev.map(m =>
                                                      m.id === msg.id ? { ...m, text: editMessageText } : m
                                                    )
                                                  );
                                                  await handleEditMessage(msg.id, editMessageText);
                                                  setEditMessageId(null);
                                                }}
                                              >
                                                <CheckIcon />
                                              </IconButton>
                                            </Box>
                                          ) : (
                                            msg.text && (
                                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0, width: '100%' }}>
                                                {msg.text}
                                              </Typography>
                                            )
                                          )}
                                          {/* File preview or download (only if not deleted) */}
                                          {msg.file && !msg.text.includes('This message was deleted by') && (
                                            msg.file.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                              <Box
                                                sx={{
                                                  mt: 1,
                                                  mb: 1,
                                                  display: 'flex',
                                                  flexDirection: msg.self ? 'row' : 'row-reverse',
                                                  alignItems: 'center'
                                                }}
                                              >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: msg.self ? 1 : 0, ml: msg.self ? 0 : 1 }}>
                                                  {/*<IconButton
                                                    component="a"
                                                    href={msg.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                      color: 'primary.main',
                                                      border: '1px solid',
                                                      borderColor: 'primary.main',
                                                      borderRadius: 1,
                                                      p: 0.5,
                                                      mb: 1
                                                    }}
                                                  >
                                                    <VisibilityIcon />
                                                  </IconButton>*/}
                                                  <IconButton
                                                    onClick={() => handleImageDownload(msg.file, msg.fileName)}
                                                    sx={{
                                                      color: 'primary.main',
                                                      border: '1px solid',
                                                      borderColor: 'primary.main',
                                                      borderRadius: 1,
                                                      p: 0.5
                                                    }}
                                                  >
                                                    <DownloadIcon />
                                                  </IconButton>
                                                </Box>
                                                <a href={msg.file} target="_blank" rel="noopener noreferrer">
                                                  <img
                                                    src={msg.file}
                                                    alt="attachment"
                                                    //style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
                                                    style={{ maxWidth: 220, maxHeight: 220, borderRadius: 12, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'block' }}
                                                  />
                                                </a>
                                              </Box>
                                            ) : (
                                              <Box sx={{ mt: 1, mb: 1 }}>
                                                <Button
                                                  component="a"
                                                  href={msg.file}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  variant="outlined"
                                                  size="small"
                                                  startIcon={<AttachFileIcon />}
                                                  sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                                                  download
                                                >
                                                  Download {msg.fileName || 'Attachment'}
                                                </Button>
                                              </Box>
                                            )
                                          )}
                                          {/* Status row, minimal margin */}
                                          <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            gap: 1,
                                            mt: 0.25 // minimal margin
                                          }}>
                                            {msg.self && (
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  color: msg.self ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 0.5
                                                }}
                                              >
                                                {msg.is_read ? 'Read' : 'Sent'}
                                              </Typography>
                                            )}
                                          </Box>
                                        </Box>
                                        {/* For sent messages: avatar (right) */}
                                        {msg.self && (
                                          <Avatar
                                            src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                                            alt="Profile"
                                            sx={{ width: 32, height: 32, bgcolor: 'grey.300', fontSize: '0.875rem', ml: 1, flexShrink: 0 }}
                                          />
                                        )}
                                      </Box>
                                    ))}
                                  </React.Fragment>
                                ));
                              })()
                            )}
                          </Box>
                          {/* Chat Input */}
                          <Box sx={{
                            flex: '0 0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            borderTop: '1px solid #eee',
                            p: 2,
                            background: '#fff',
                            gap: 1
                          }}>
                            {/* Attachment Icon */}
                            {selectedChat && getRequestStatus(selectedChat.id)?.status === 'accepted' && !pendingAttachment && (
                              <>
                                <IconButton onClick={handleAttachmentClick} sx={{ mr: 1 }}>
                                  <AttachFileIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={attachmentAnchorEl}
                                  open={Boolean(attachmentAnchorEl)}
                                  onClose={handleAttachmentClose}
                                >
                                  <MenuItem onClick={() => handleAttachmentOption('photo')}><InsertPhotoIcon sx={{ mr: 1 }} />Send Photo</MenuItem>
                                  <MenuItem onClick={() => handleAttachmentOption('document')}><AttachFileIcon sx={{ mr: 1 }} />Send Document</MenuItem>
                                </Menu>
                                <input
                                  ref={attachmentInputRef}
                                  type="file"
                                  accept={attachmentType === 'photo' ? 'image/*' : attachmentType === 'document' ? '.pdf,.doc,.docx,.xls,.xlsx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain' : '*/*'}
                                  style={{ display: 'none' }}
                                  onChange={handleAttachmentChange}
                                />
                              </>
                            )}
                            {pendingAttachment && (
                              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {pendingAttachment.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(pendingAttachment)}
                                    alt="preview"
                                    style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8, border: '1px solid #eee' }}
                                  />
                                ) : (
                                  <Typography variant="body2">{pendingAttachment.name}</Typography>
                                )}
                                <Button variant="outlined" color="error" size="small" onClick={handleCancelAttachment}>Cancel</Button>
                              </Box>
                            )}
                            <TextField
                              fullWidth
                              placeholder={selectedChat && getRequestStatus(selectedChat.id)?.status === 'accepted' ? 'Type your message...' : 'Request not accepted yet'}
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey && getRequestStatus(selectedChat.id)?.status === 'accepted' && !pendingAttachment) {
                                  e.preventDefault();
                                  handleSendChat();
                                }
                                // If Enter is pressed and there is a pending attachment, send the attachment
                                if (e.key === 'Enter' && !e.shiftKey && getRequestStatus(selectedChat.id)?.status === 'accepted' && pendingAttachment) {
                                  e.preventDefault();
                                  handleSendAttachment();
                                }
                              }}
                              multiline
                              maxRows={4}
                              disabled={!selectedChat || getRequestStatus(selectedChat.id)?.status !== 'accepted'}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  background: '#f7f9fb'
                                }
                              }}
                            />
                            <IconButton
                              color="primary"
                              onClick={pendingAttachment ? handleSendAttachment : handleSendChat}
                              disabled={(!chatInput.trim() && !pendingAttachment) || loading || !selectedChat || getRequestStatus(selectedChat.id)?.status !== 'accepted'}
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'primary.dark'
                                },
                                '&.Mui-disabled': {
                                  bgcolor: 'grey.300',
                                  color: 'grey.500'
                                }
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: 'text.secondary'
                        }}>
                          <ChatIcon sx={{ fontSize: 48, mb: 2 }} />
                          <Typography variant="h6">Select a chat to start messaging</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                {/* Settings Tab */}
                {value === 6 && (
                  <Box sx={{ background: '#fff', borderRadius: 3, p: 0, minHeight: 500 }}>
                    <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Paper elevation={3} sx={{ borderRadius: 3, p: 0 }}>
                        <Tabs value={settingsTab} onChange={handleSettingsTabChange}>
                          <Tab label="Personal Details" />
                          <Tab label="Change Password" />
                        </Tabs>
                        <Box sx={{ p: 3 }}>
                          {settingsTab === 0 && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                                  <Avatar
                                    src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                                    alt="Profile"
                                    sx={{ width: 120, height: 120, border: '2px solid #6c63ff' }}
                                  />
                                  <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="profile-image-upload"
                                    type="file"
                                    onChange={handleProfileImageChange}
                                  />
                                  <label htmlFor="profile-image-upload">
                                    <IconButton
                                      component="span"
                                      sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: '#6c63ff',
                                        color: 'white',
                                        '&:hover': {
                                          backgroundColor: '#574fd6',
                                        },
                                      }}
                                    >
                                      <PhotoCamera />
                                    </IconButton>
                                  </label>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="First Name"
                                  name="first_name"
                                  value={settingsFormData.first_name || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Last Name"
                                  name="last_name"
                                  value={settingsFormData.last_name || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Phone Number"
                                  name="phone"
                                  value={settingsFormData.phone || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PhoneIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Email Address"
                                  name="email"
                                  value={settingsFormData.email || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Joining Date"
                                  value={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : ''}
                                  InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <CalendarMonthIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                  sx={{ mb: 2 }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Date of Birth"
                                  name="dob"
                                  type="date"
                                  value={settingsFormData.dob || ''}
                                  onChange={handleSettingsChange}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
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
                                <TextField
                                  fullWidth
                                  label="Designation"
                                  name="title"
                                  value={settingsFormData.title || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <WorkIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Website"
                                  name="website"
                                  value={settingsFormData.website || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LanguageIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Address"
                                  name="address"
                                  value={settingsFormData.address || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <HomeIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="City"
                                  name="city"
                                  value={settingsFormData.city || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LocationCityIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Country"
                                  name="country"
                                  value={settingsFormData.country || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PublicIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Description"
                                  name="bio"
                                  multiline
                                  rows={3}
                                  value={settingsFormData.bio || ''}
                                  onChange={handleSettingsChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <InfoOutlinedIcon color="action" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
                                  onClick={handleSettingsUpdate}
                                  disabled={isUpdating}
                                  startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                  {isUpdating ? 'Updating...' : 'Update'}
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
                                  onClick={() => {
                                    if (userProfile) {
                                      setSettingsFormData({
                                        first_name: userProfile.first_name || '',
                                        last_name: userProfile.last_name || '',
                                        phone: userProfile.phone || '',
                                        email: userProfile.email || '',
                                        title: userProfile.title || '',
                                        company: userProfile.company || '',
                                        website: userProfile.website || '',
                                        city: userProfile.city || '',
                                        state: userProfile.state || '',
                                        bio: userProfile.bio || '',
                                        position: userProfile.position || '',
                                        address: userProfile.address || '',
                                        country: userProfile.country || '',
                                        skills: userProfile.skills || '',
                                        dob: userProfile.dob || ''
                                      });
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                            </Grid>
                          )}

                          {settingsTab === 1 && (
                            <Grid container spacing={2} alignItems="flex-end">
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Old Password*"
                                  placeholder="Enter current password"
                                  type={showOldPassword ? 'text' : 'password'}
                                  name="old_password"
                                  value={passwordData.old_password}
                                  onChange={handlePasswordInputChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockOutlinedIcon color="action" />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowOldPassword(!showOldPassword)}
                                          edge="end"
                                        >
                                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="New Password*"
                                  placeholder="Enter new password"
                                  type={showNewPassword ? 'text' : 'password'}
                                  name="new_password"
                                  value={passwordData.new_password}
                                  onChange={handlePasswordInputChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <VpnKeyIcon color="action" />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowNewPassword(!showNewPassword)}
                                          edge="end"
                                        >
                                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="Confirm Password*"
                                  placeholder="Confirm password"
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  name="confirm_password"
                                  value={passwordData.confirm_password}
                                  onChange={handlePasswordInputChange}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <CheckCircleIcon color="action" />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                          edge="end"
                                        >
                                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ mt: 1 }}>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate('/forgot-password');
                                    }}
                                    style={{ fontSize: 14, color: '#6c63ff', textDecoration: 'underline' }}
                                  >
                                    Forgot Password ?
                                  </a>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={8} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                {passwordError && (
                                  <Typography color="error" sx={{ mb: 1 }}>{passwordError}</Typography>
                                )}
                                {passwordSuccess && (
                                  <Typography color="success.main" sx={{ mb: 1 }}>{passwordSuccess}</Typography>
                                )}
                                <Button
                                  variant="contained"
                                  sx={{
                                    background: '#ff865a',
                                    color: '#fff',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 4,
                                    boxShadow: 'none',
                                    '&:hover': { background: '#ff6a3d' }
                                  }}
                                  onClick={handleChangePassword}
                                >
                                  Change Password
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      </Paper>
                    </Container>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {/* Share Idea Dialog */}
      <Dialog open={openShareIdea} onClose={() => setOpenShareIdea(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(80,80,180,0.10)',
            background: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          Share Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                    alt="Profile"
                    sx={{ width: 44, height: 44, bgcolor: 'primary.main', fontWeight: 700 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'User'} {userProfile?.last_name || ''}</Typography>
                    <Typography variant="body2" color="text.secondary">{userProfile?.title || 'Member'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Type"
                    value={shareIdeaForm.type || ''}
                    onChange={e => setShareIdeaForm(prev => ({ ...prev, type: e.target.value }))}
                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
                    helperText="What kind of post is this?"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LightbulbIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="Discussion">💬 Discussion</MenuItem>
                    <MenuItem value="Project Update">📢 Project Update</MenuItem>
                    <MenuItem value="Question">❓ Question</MenuItem>
                    <MenuItem value="Idea">🧠 Idea</MenuItem>
                    <MenuItem value="Other">🗂️ Other</MenuItem>
                    <MenuItem value="Event"><EventIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />Event</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Visibility"
                    value={shareIdeaForm.visibility || 'public'}
                    onChange={e => setShareIdeaForm(prev => ({ ...prev, visibility: e.target.value }))}
                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
                    helperText="Who can see this post?"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VisibilityIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="public">🌍 Public</MenuItem>
                    <MenuItem value="private">🔒 Private</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={shareIdeaForm.title}
                  onChange={e => setShareIdeaForm(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600, fontSize: '1.15rem' } }}
                  inputProps={{ maxLength: 100 }}
                  helperText="Give your post a clear, descriptive title."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleTagAdd}
                  onBlur={handleTagAdd}
                  placeholder="Add tags (e.g. #Fintech, #Africa, #StartupFunding)"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  helperText="Press Enter or comma to add a tag."
                  InputProps={{
                    //startAdornment: (shareIdeaForm.tags || []).map((tag, idx) => (
                    startAdornment: (
                      <InputAdornment position="start">
                        <LabelIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (shareIdeaForm.tags || []).map((tag, idx) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        onDelete={() => handleTagDelete(tag)}
                        sx={{ mx: 0.25 }}
                      />
                    ))
                  }}
                />
              </Grid>
              {shareIdeaForm.type === 'Event' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={shareIdeaForm.eventLocation || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventLocation: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><RoomIcon color="action" /></InputAdornment> }}
                      helperText="Where will the event take place? (e.g. Convention Center, City)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location Link"
                      value={shareIdeaForm.eventLocationLink || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventLocationLink: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      type="url"
                      placeholder="https://maps.example.com/..."
                      InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon color="action" /></InputAdornment> }}
                      helperText="Paste a Google Maps or website link for the location."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date & Time"
                      type="datetime-local"
                      value={shareIdeaForm.eventStartDateTime || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventStartDateTime: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment> }}
                      helperText="When does the event start?"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date & Time"
                      type="datetime-local"
                      value={shareIdeaForm.eventEndDateTime || ''}
                      onChange={e => setShareIdeaForm(prev => ({ ...prev, eventEndDateTime: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment> }}
                      helperText="When does the event end?"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={shareIdeaForm.description}
                  onChange={e => setShareIdeaForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="What's on your mind? Share your thoughts..."
                  helperText="Describe your post in detail."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InfoOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    mb: 1,
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: '#f7f9fb',
                    fontWeight: 600,
                    color: 'primary.main',
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: '#90caf9',
                    '&:hover': { borderColor: 'primary.main', bgcolor: '#e3f2fd' }
                  }}
                >
                  {shareIdeaForm.attachment ? 'Change Image' : 'Add Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file && !file.type.startsWith('image/')) {
                        setPostError('Community posts support image uploads only.');
                        e.target.value = '';
                        return;
                      }
                      setShareIdeaForm(prev => ({ ...prev, attachment: file || null }));
                    }}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  Share an image with your post. Images appear directly in the community feed.
                </Typography>
                {shareIdeaForm.attachment && (
                  <Box sx={{
                    mt: 2, mb: 1, p: 2, display: 'flex', alignItems: 'center', gap: 2,
                    border: '1.5px solid #1976d2', borderRadius: 2, bgcolor: '#f3f8fd',
                    boxShadow: 1, position: 'relative',
                    minHeight: 56
                  }}>
                    {shareIdeaForm.attachment.type && shareIdeaForm.attachment.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(shareIdeaForm.attachment)}
                        alt="preview"
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                      />
                    ) : null}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#233876', wordBreak: 'break-all' }}>{shareIdeaForm.attachment.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shareIdeaForm.attachment.type || 'File'}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setShareIdeaForm(prev => ({ ...prev, attachment: null }))}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={() => setOpenShareIdea(false)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, fontWeight: 700, boxShadow: 'none', background: '#1976d2', '&:hover': { background: '#115293' } }}
            onClick={handleSharePost}
            disabled={postLoading}
          >
            {postLoading ? 'Posting...' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Create Company Dialog */}
      <Dialog open={openCreateCompanyDialog} onClose={() => setOpenCreateCompanyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 24, textAlign: 'center', pt: 4 }}>Let's Start Fundraising!</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, py: 4, flexWrap: 'wrap' }}>
            {/* Step 1 */}
            <Box sx={{ border: '2px solid #007bff', borderRadius: 2, p: 4, minWidth: 280, textAlign: 'center', position: 'relative', boxShadow: 2 }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, background: '#ff4444', color: '#fff', px: 1.5, py: 0.5, fontSize: 12, borderRadius: 1, fontWeight: 700, transform: 'rotate(15deg)' }}>START HERE</Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 1</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Build your Funding Profile</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>You'll complete your funding profile using our setup wizards.</Typography>
              <Button variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 4 }} onClick={() => { setOpenCreateCompanyDialog(false); setOpenFundingSetup(true); }}>
                CONTINUE SETUP
              </Button>
            </Box>
            {/* Step 2 */}
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 4, minWidth: 280, textAlign: 'center', boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 2</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Submit for Review & Approval</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>Our team will review your fundraise within 2 business days.</Typography>
              <Button variant="contained" disabled sx={{ bgcolor: '#e9ecef', color: '#adb5bd', fontWeight: 700, borderRadius: 2, px: 4 }}>
                BUILD PROFILE FIRST
              </Button>
            </Box>
            {/* Step 3 */}
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 4, minWidth: 280, textAlign: 'center', boxShadow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Step 3</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Launch Your Fundraise</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>After approval, your fundraise is public and ready for promotion.</Typography>
              <Button variant="contained" disabled sx={{ bgcolor: '#e9ecef', color: '#adb5bd', fontWeight: 700, borderRadius: 2, px: 4 }}>
                NOT APPROVED YET
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setOpenCreateCompanyDialog(false)} sx={{ borderRadius: 2, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Funding Setup Dialog */}
      <Dialog open={openFundingSetup} onClose={() => setOpenFundingSetup(false)} maxWidth="xl" fullWidth scroll="body">
        <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
          <IconButton onClick={() => setOpenFundingSetup(false)} size="large" sx={{ fontSize: 28, color: '#888' }}>
            {/* Emoji X */}
            <span role="img" aria-label="close">✖</span>
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          <FundingSetup onSuccess={handleFundingSetupSuccess} />
        </DialogContent>
      </Dialog>
      {/* Company Details Dialog */}
      <Dialog
        open={companyDetailsOpen}
        onClose={() => setCompanyDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        {selectedCompany && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedCompany.name || selectedCompany.product_name || 'Company'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Investment Tracking Dashboard
                </Typography>
              </Box>
              {/*
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Contact Founder
                </Button>
              </Box>
              */}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {/* Notice from Track Progress */}
              {selectedCompany.notice && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#e3f2fd',
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  mb: 3,
                }}>
                  <InfoOutlinedIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0d2235' }}>
                    {selectedCompany.notice}
                  </Typography>
                </Box>
              )}
              {/* Investment Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Investment</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        `৳${selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toLocaleString()}`
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        `Invested on ${new Date(selectedCompany.payments[0].payment_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}`
                        : ''}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Ownership</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments ?
                        `${(selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                          (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100).toFixed(4)}%`
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany && selectedCompany.payments ?
                        `Total Investment: ৳${selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toLocaleString()}`
                        : ''}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Current Value</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments ?
                        `৳${((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                          (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                          parseFloat(selectedCompany.kpis.revenue) / 100).toLocaleString()}`
                        : selectedCompany?.payments ?
                          `৳${selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toLocaleString()}`
                          : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue ?
                        `Last updated: ${new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}` : ''}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">ROI</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments ?
                        `${((((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                          (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                          parseFloat(selectedCompany.kpis.revenue) / 100) -
                          selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100 /
                          selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)).toFixed(2)}%`
                        : 'N/A'}
                    </Typography>
                    {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue && selectedCompany.fundraise_terms && selectedCompany.fundraise_terms.pre_money_valuation && selectedCompany.payments && (
                      <Typography variant="caption" sx={{
                        display: 'block',
                        color: (() => {
                          const roi = ((((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                            (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                              selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                            parseFloat(selectedCompany.kpis.revenue) / 100) -
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100 /
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0));
                          return roi > 0 ? 'success.main' : roi < 0 ? 'error.main' : 'warning.main';
                        })()
                      }}>
                        {(() => {
                          const roi = ((((selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
                            (parseFloat(selectedCompany.fundraise_terms.pre_money_valuation) +
                              selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100) *
                            parseFloat(selectedCompany.kpis.revenue) / 100) -
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)) * 100 /
                            selectedCompany.payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0));
                          return roi > 0 ? '🟢 You made a profit' : roi < 0 ? '🔴 You lost money' : '🟡 You broke even';
                        })()}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                {/*<Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Investment Date</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        new Date(selectedCompany.payments[0].payment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCompany.payments && selectedCompany.payments.length > 0 ?
                        `Payment Date: ${new Date(selectedCompany.payments[0].payment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at ${new Date(selectedCompany.payments[0].payment_date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}`
                        : ''}
                    </Typography>
                  </Paper>
                </Grid>*/}
              </Grid>

              {/* Performance Graph and KPIs */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Investment Performance</Typography>
                    <Box sx={{ width: '100%', minWidth: 600, height: 350 }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top' },
                            title: { display: false },
                          },
                          scales: {
                            x: { title: { display: true, text: 'Date' } },
                            y: { title: { display: true, text: 'Value' }, beginAtZero: true },
                          },
                        }}
                        height={350}
                        width={900}
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Company KPIs</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Current Company Valuation</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.revenue != null ? `৳${Number(selectedCompany.kpis.revenue).toLocaleString()}` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Revenue Rate</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.revenueRate != null ? `${selectedCompany.kpis.revenueRate}` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Burn Rate</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.burnRate != null ? `৳${Number(selectedCompany.kpis.burnRate).toLocaleString()}` : 'N/A'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Retention Rate</TableCell>
                            <TableCell align="right">
                              {selectedCompany.kpis && selectedCompany.kpis.retention != null ? `${selectedCompany.kpis.retention}%` : 'N/A'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      {selectedCompany && selectedCompany.kpis && selectedCompany.kpis.revenue ?
                        `Last updated: ${new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}` : ''}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Updates and Documents */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Company Updates</Typography>
                    <List>
                      {(selectedCompany.updates || []).map((update, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                            <Box sx={{ mr: 2, mt: 0.5 }}>
                              <EventIcon color="primary" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {update.text}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {update.date}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              sx={{
                                borderRadius: '0.5rem',
                                color: '#6c63ff',
                                '&:hover': {
                                  backgroundColor: 'rgba(108, 99, 255, 0.04)',
                                  transform: 'scale(1.05)',
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Investment Documents</Typography>
                    <List>
                      {(selectedCompany.documents || []).map((doc, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <Button
                            onClick={() => {
                              // Extract filename from the preview URL
                              const filename = doc.preview.split('/').pop();
                              // Use the API URL from environment variable or fallback to localhost
                              const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
                              // Open the document in a new tab
                              window.open(`${apiUrl}/media/investment_documents/${filename}`, '_blank');
                            }}
                            variant="text"
                            startIcon={<DescriptionIcon />}
                          >
                            {doc.name}
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                onClick={() => setCompanyDetailsOpen(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
            mx: 'auto',
            p: 3
          }
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Box sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}>
            <DeleteIcon color="error" sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="h6" fontWeight={600} gutterBottom>
            Are you Sure ?
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '0.9375rem' }}>
            Are you Sure You want to Delete this {userToDelete ? 'User' : 'Post'} ?
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleDeleteCancel}
              sx={{
                textTransform: 'none',
                borderColor: '#D1D5DB',
                color: '#374151',
                borderRadius: '0.5rem',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#9CA3AF',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={userToDelete ? handleDeleteUser : handleDeleteConfirm}
              sx={{
                textTransform: 'none',
                backgroundColor: '#EF4444',
                borderRadius: '0.5rem',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
                boxShadow: 'none',
              }}
            >
              Yes, Delete It!
            </Button>
          </Box>
        </Box>
      </Dialog>



      {/* Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusClose}>
        <DialogTitle>Company Status</DialogTitle>
        <DialogContent>
          {statusCompany && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{statusCompany.product_name}</Typography>
              <Chip label={statusCompany.company_status} color={statusCompany.company_status === 'Approved' ? 'success' : statusCompany.company_status === 'Pending' ? 'warning' : 'error'} />
            </Box>
          )}
          <Typography sx={{ mt: 2 }}>
            {statusCompany && statusCompany.company_status === 'Pending' && 'Your company is pending approval. Once an admin approves, the status will change to Approved.'}
            {statusCompany && statusCompany.company_status === 'Approved' && 'Your company has been approved!'}
            {statusCompany && statusCompany.company_status === 'Rejected' && 'Your company was rejected.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Track Progress Update Dialog */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbar-anchorOriginTopCenter': {
            top: '24px',
          },
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          icon={snackbarSeverity === 'success' ? <CheckCircleIcon /> : <WarningAmberIcon />}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openTrackProgressDialog} onClose={() => setOpenTrackProgressDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} /> Update Track Progress
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {trackProgressLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Exit Event & KPIs Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, m: 0, mb: 3, boxShadow: '0 2px 8px rgba(80,80,180,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventAvailableIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notice</Typography>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      placeholder="e.g. Acquired by..."
                      value={trackProgressForm.exitEvent.notice}
                      onChange={e => handleTrackProgressExitChange('title', e.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InfoOutlinedIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Company KPIs</Typography>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Current Company Valuation"
                      placeholder="৳10,000"
                      value={trackProgressForm.kpis.revenue}
                      onChange={e => handleTrackProgressKPIChange('revenue', e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Revenue Rate"
                      placeholder="25%"
                      value={trackProgressForm.kpis.revenueRate}
                      onChange={e => handleTrackProgressKPIChange('revenueRate', e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TrendingUpIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Burn Rate"
                      placeholder="৳2,000"
                      value={trackProgressForm.kpis.burnRate}
                      onChange={e => handleTrackProgressKPIChange('burnRate', e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalFireDepartmentIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Retention Rate"
                      placeholder="85%"
                      value={trackProgressForm.kpis.retention}
                      onChange={e => handleTrackProgressKPIChange('retention', e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RepeatIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
              {/* Investment Documents Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, m: 0, mb: 3, background: '#f7fafd', boxShadow: '0 2px 8px rgba(80,80,180,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Investment Documents</Typography>
                </Box>
                <Box
                  sx={{
                    border: '2px dashed #90caf9',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    '&:hover': { background: '#bbdefb' },
                  }}
                  component="label"
                >
                  <CloudUploadIcon color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Drag & drop files here or click to upload
                  </Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleDocumentUpload}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {trackProgressForm.documents.map((doc, idx) => (
                    <Chip
                      key={idx}
                      label={doc.name}
                      onDelete={() => handleRemoveDocument(idx)}
                      sx={{ bgcolor: '#e3f2fd', fontWeight: 500 }}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Paper>
              {/* Company Updates Section */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, m: 0, mb: 3, background: '#f3f6fa', boxShadow: '0 2px 8px rgba(80,80,180,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Company Updates</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, background: '#fff' }}>
                      <TextField
                        label="Title"
                        placeholder="e.g. Launched MVP"
                        value={trackProgressForm.updates[0]?.text || ''}
                        onChange={e => {
                          const newArr = [{ ...trackProgressForm.updates[0], text: e.target.value }];
                          handleTrackProgressFormChange('updates', newArr);
                        }}
                        fullWidth
                        InputProps={{
                          sx: { fontWeight: 500 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTrackProgressDialog(false)} sx={{ borderRadius: 2, px: 3 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTrackProgress} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Permit Dialog */}
      <Dialog open={permitDialogOpen} onClose={handleClosePermitDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>Users Management</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search by name or email..."
              value={permitSearch}
              onChange={e => setPermitSearch(e.target.value)}
              sx={{ width: 320, background: '#f7f9fb', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, pl: 1 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={permitStatusFilter}
                displayEmpty
                onChange={e => setPermitStatusFilter(e.target.value)}
                sx={{ borderRadius: 2, background: '#fff' }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Filters</Button>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #f0f1f3' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permitLoading ? (
                  <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
                ) : permitError ? (
                  <TableRow><TableCell colSpan={5} align="center">{permitError}</TableCell></TableRow>
                ) : permitUsers.filter(u =>
                  (!permitSearch || (u.user.first_name + ' ' + u.user.last_name).toLowerCase().includes(permitSearch.toLowerCase()) || u.user.email.toLowerCase().includes(permitSearch.toLowerCase())) &&
                  (!permitStatusFilter || (u.company_permission === 'yes' && permitStatusFilter === 'Approved') || (u.company_permission === 'no' && permitStatusFilter !== 'Approved'))
                ).map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {(() => {
                          const profilePic = user.user.profile_picture || user.user.profile_pic;
                          const fullUrl = profilePic ?
                            (profilePic.startsWith('http') ? profilePic :
                              `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profilePic}`) :
                            null;

                          return (
                            <Avatar
                              src={fullUrl}
                              alt={`${user.user.first_name || ''} ${user.user.last_name || ''}`.trim()}
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: fullUrl ? 'transparent' : '#1976d2',
                                fontWeight: 700,
                                fontSize: fullUrl ? 'inherit' : '1rem'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = null;
                              }}
                            >
                              {!fullUrl && `${user.user.first_name?.[0]?.toUpperCase() || ''}${user.user.last_name?.[0]?.toUpperCase() || ''}`}
                            </Avatar>
                          );
                        })()}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user.user.first_name} {user.user.last_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.user.user_type}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.user.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.user.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      {user.address || user.user.address || user.user.city}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={user.company_permission === 'yes' ? 'Approved' : (user.company_permission === 'pending' ? 'Pending' : 'Rejected')}
                          onChange={e => handlePermitStatusChange(user.id, e.target.value)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            background:
                              user.company_permission === 'yes' ? '#e8f5e9' : (user.company_permission === 'pending' ? '#fffde7' : '#ffebee'),
                            color:
                              user.company_permission === 'yes' ? '#388e3c' : (user.company_permission === 'pending' ? '#f57c00' : '#d32f2f'),
                          }}
                        >
                          <MenuItem value="Approved" sx={{ color: '#388e3c', fontWeight: 700 }}>Approved</MenuItem>
                          <MenuItem value="Pending" sx={{ color: '#f57c00', fontWeight: 700 }}>Pending</MenuItem>
                          <MenuItem value="Rejected" sx={{ color: '#d32f2f', fontWeight: 700 }}>Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color="primary" onClick={() => handleViewPermitUser(user.id)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => {
                          setPermitUserToDelete(user);
                          setPermitDeleteDialogOpen(true);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermitDialog} sx={{ borderRadius: 2, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Permit User Detail Dialog */}
      <Dialog open={permitUserDetailOpen} onClose={() => setPermitUserDetailOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {permitUserDetail && (
            <>
              {/* Top: Image, Name, Title+Company, Location */}
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                {(() => {
                  const profilePic = permitUserDetail.profile_picture || permitUserDetail.profile_pic;
                  const fullUrl = profilePic ?
                    (profilePic.startsWith('http') ? profilePic :
                      `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profilePic}`) :
                    null;

                  return (
                    <Avatar
                      src={fullUrl}
                      alt={permitUserDetail.full_name || 'User'}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: fullUrl ? 'transparent' : '#1976d2',
                        fontSize: '2rem',
                        '& .MuiSvgIcon-root': {
                          fontSize: '2.5rem'
                        }
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = null;
                      }}
                    >
                      {!fullUrl && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="h4" component="div" sx={{
                            lineHeight: 1,
                            color: 'white',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {permitUserDetail.full_name?.split(' ').map(n => n[0]).join('')}
                          </Typography>
                        </Box>
                      )}
                    </Avatar>
                  );
                })()}
                <Box>
                  <Typography variant="h5">{permitUserDetail.full_name}</Typography>
                  <Typography variant="subtitle1">
                    {permitUserDetail.title}
                    {permitUserDetail.company ? `, ${permitUserDetail.company}` : ''}
                  </Typography>
                  <Typography variant="body2">
                    {permitUserDetail.location}
                  </Typography>
                </Box>
              </Box>
              {/* Info Section */}
              <Box mb={3}>
                <Typography variant="h6">Info</Typography>
                <Typography>Full Name: {permitUserDetail.full_name}</Typography>
                <Typography>Mobile: {permitUserDetail.mobile}</Typography>
                <Typography>Email: {permitUserDetail.email}</Typography>
                <Typography>Address: {permitUserDetail.address}</Typography>
                <Typography>Joining Date: {permitUserDetail.joining_date}</Typography>
              </Box>
              {/* About Section */}
              <Box mb={3}>
                <Typography variant="h6">About</Typography>
                <Typography>{permitUserDetail.about}</Typography>
                <Typography sx={{ mt: 2 }}><b>Designation:</b> {permitUserDetail.designation}</Typography>
                <Typography sx={{ mt: 2 }}>
                  <b>Website:</b> <a href={permitUserDetail.website} target="_blank" rel="noopener noreferrer">{permitUserDetail.website}</a>
                </Typography>
              </Box>
              {/* Custom Permission Fields */}
              <Box mb={3}>
                <Typography variant="h6">Briefly introduce yourself</Typography>
                <Typography>{permitUserDetail.user_intro}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="h6">Why are you interested in this company?</Typography>
                <Typography>{permitUserDetail.user_purpose}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermitUserDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={permitDeleteDialogOpen} onClose={() => setPermitDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, minWidth: 340 }}>
          <Box sx={{ background: '#ffeaea', borderRadius: '50%', p: 2, mb: 2 }}>
            <DeleteIcon sx={{ color: '#e53935', fontSize: 48 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Are you Sure ?</Typography>
          <Typography sx={{ mb: 3, color: '#555' }}>Are you Sure You want to Delete this User ?</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => setPermitDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              sx={{ fontWeight: 600 }}
              onClick={async () => {
                if (permitUserToDelete) {
                  await handlePermitUserDelete(permitUserToDelete.id);
                  setPermitDeleteSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
                }
                setPermitDeleteDialogOpen(false);
                setPermitUserToDelete(null);
              }}
            >
              Yes, Delete It!
            </Button>
          </Box>
        </Box>
      </Dialog>
      {/* Settings Snackbar */}
      <Snackbar
        open={settingsSnackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={settingsSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {settingsSnackbar.message}
        </Alert>
      </Snackbar>
      {/* Notification Popup Dialog */}
      <Dialog open={notificationPopupOpen} onClose={handleCloseNotificationPopup} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: 8, p: 0 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 20, pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon color="primary" sx={{ fontSize: 26, mr: 1 }} />
          {notificationPopupType === 'community' ? 'Community notifications' : 'Company notifications'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, minHeight: 120 }}>
          {notificationLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (notificationPopupType === 'community'
            ? communityNotifications.length === 0
            : companyNotifications.length === 0) ? (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>No notifications yet.</Typography>
          ) : (
            <List>
              {(notificationPopupType === 'community' ? communityNotifications : companyNotifications).map((notif) => (
                <ListItem key={`${notif.type || 'company'}-${notif.id}`} alignItems="flex-start" sx={{ bgcolor: notif.read === 'No' || notif.read === false ? '#e3f2fd' : 'inherit', borderRadius: 2, mb: 1, boxShadow: notif.read === 'No' || notif.read === false ? 1 : 0 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: notif.type === 'comment' ? '#1976d2' : '#43a047' }}>
                      {notif.user ? `${notif.user.first_name} ${notif.user.last_name} ` : ''}{notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notif.post?.title || 'Company notification'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {new Date(notif.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'space-between' }}>
          <Button onClick={handleCloseNotificationPopup} variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>Close</Button>
          {notificationPopupType === 'community' && notificationHasMore && (
            <Button onClick={handleViewMoreNotifications} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 3 }} disabled={notificationLoading}>
              View More
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Show post success/error message */}
      {postSuccess && (
        <Box sx={{ position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: 320, maxWidth: '80vw', display: 'flex', justifyContent: 'center' }}>
          <Alert severity="success" onClose={() => setPostSuccess(null)} sx={{ width: '100%', textAlign: 'center', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>{postSuccess}</Alert>
        </Box>
      )}
      {postError && (
        <Box sx={{ position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: 320, maxWidth: '80vw', display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error" onClose={() => setPostError(null)} sx={{ width: '100%', textAlign: 'center', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>{typeof postError === 'string' ? postError : JSON.stringify(postError)}</Alert>
        </Box>
      )}

      {/* View Post Dialog */}
      <Dialog open={!!viewPost} onClose={() => setViewPost(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, boxShadow: 12, p: 0, background: '#fafdff' } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 26, pb: 1.5, borderBottom: '1.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f5faff' }}>
          <VisibilityIcon color="primary" sx={{ fontSize: 32, mr: 1 }} /> View Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          {viewPost && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0 }}>{viewPost.title}</Typography>
                <Chip label={viewPost.type} color="primary" sx={{ fontWeight: 700, fontSize: 15, borderRadius: 1, bgcolor: '#e3f2fd', color: '#1976d2', ml: 1 }} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Visibility</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewPost.visibility}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Created At</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewPost.created_at ? viewPost.created_at.split('T')[0] : ''}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Tags</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {(() => {
                      let tags = viewPost.tags;
                      if (typeof tags === 'string') {
                        tags = tags.split(',').map(t => t.trim()).filter(Boolean);
                      }
                      if (!Array.isArray(tags)) tags = [];
                      return tags.length > 0 ? (
                        tags.map((tag, idx) => (
                          <Chip key={idx} label={`#${tag}`} size="small" sx={{ mr: 0.5, mt: 0.5, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700 }} />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No tags</Typography>
                      );
                    })()}
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mb: 3, p: 2.5, bgcolor: '#f7fafd', borderRadius: 2, border: '1px solid #e3e8ef', boxShadow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>Description</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 16 }}>{viewPost.description}</Typography>
              </Box>
              {viewPost.type === 'Event' && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f0f7fa', borderRadius: 2, border: '1px solid #b3e5fc', boxShadow: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0288d1', mb: 1 }}><EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Event Details</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><RoomIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />{viewPost.eventLocation || 'N/A'}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><LinkIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />{viewPost.eventLocationLink || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><EventIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />Start: {(() => {
                      const dt = viewPost.eventStartDateTime;
                      if (!dt) return 'N/A';
                      const d = new Date(dt);
                      if (isNaN(d)) return dt;
                      return format(d, 'MMM dd, yyyy, hh:mm a');
                    })()}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}><EventIcon sx={{ fontSize: 18, mr: 0.5, color: '#0288d1' }} />End: {(() => {
                      const dt = viewPost.eventEndDateTime;
                      if (!dt) return 'N/A';
                      const d = new Date(dt);
                      if (isNaN(d)) return dt;
                      return format(d, 'MMM dd, yyyy, hh:mm a');
                    })()}</Typography>
                  </Box>
                </Box>
              )}
              {viewPost.attachment && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f7fafd', borderRadius: 2, border: '1px solid #e3e8ef', boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box>
                    {(() => {
                      let fileUrl = '';
                      let fileName = '';
                      if (typeof viewPost.attachment === 'string') {
                        fileUrl = viewPost.attachment;
                        fileName = viewPost.attachment.split('/').pop();
                      } else if (viewPost.attachment && viewPost.attachment.url) {
                        fileUrl = viewPost.attachment.url;
                        fileName = viewPost.attachment.name || viewPost.attachment.url.split('/').pop();
                      } else if (viewPost.attachment && viewPost.attachment.name) {
                        fileName = viewPost.attachment.name;
                      }
                      if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                        fileUrl = fileUrl.replace(/^\/?media[\\/]/, '');
                        fileUrl = `${API_HOST}/media/${fileUrl}`;
                      }
                      if (fileUrl && fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
                        return (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                            <img src={fileUrl} alt={fileName} style={{ maxWidth: 90, maxHeight: 90, borderRadius: 8, border: '1px solid #eee', cursor: 'pointer', background: '#fff' }} />
                          </a>
                        );
                      } else if (fileUrl) {
                        return (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 700 }}>{fileName || 'View Attachment'}</a>
                        );
                      } else if (fileName) {
                        return <Typography variant="body2">{fileName}</Typography>;
                      } else {
                        return <Typography variant="body2">File attached</Typography>;
                      }
                    })()}
                  </Box>
                  {(() => {
                    let fileUrl = '';
                    if (typeof viewPost.attachment === 'string') {
                      fileUrl = viewPost.attachment;
                    } else if (viewPost.attachment && viewPost.attachment.url) {
                      fileUrl = viewPost.attachment.url;
                    }
                    if (fileUrl && !/^https?:\/\//.test(fileUrl)) {
                      fileUrl = fileUrl.replace(/^\/?media[\\/]/, '');
                      fileUrl = `${API_HOST}/media/${fileUrl}`;
                    }
                    return (
                      <IconButton
                        color="primary"
                        component="a"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ ml: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    );
                  })()}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#f5faff' }}>
          <Button onClick={() => setViewPost(null)} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={!!editPost} onClose={() => setEditPost(null)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(80,80,180,0.10)',
            background: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          Edit Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    src={profileImagePreview || profileImageUrl || "https://placehold.co/120x120"}
                    alt="Profile"
                    sx={{ width: 44, height: 44, bgcolor: 'primary.main', fontWeight: 700 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'User'} {userProfile?.last_name || ''}</Typography>
                    <Typography variant="body2" color="text.secondary">{userProfile?.title || 'Member'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Type"
                    value={editForm.type || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
                    helperText="What kind of post is this?"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LightbulbIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="Discussion">💬 Discussion</MenuItem>
                    <MenuItem value="Project Update">📢 Project Update</MenuItem>
                    <MenuItem value="Question">❓ Question</MenuItem>
                    <MenuItem value="Idea">🧠 Idea</MenuItem>
                    <MenuItem value="Other">🗂️ Other</MenuItem>
                    <MenuItem value="Event"><EventIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />Event</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    label="Visibility"
                    value={editForm.visibility || 'public'}
                    onChange={e => setEditForm(prev => ({ ...prev, visibility: e.target.value }))}
                    sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderRadius: 2 } }}
                    helperText="Who can see this post?"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VisibilityIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="public">🌍 Public</MenuItem>
                    <MenuItem value="private">🔒 Private</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editForm.title}
                  onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600, fontSize: '1.15rem' } }}
                  inputProps={{ maxLength: 100 }}
                  helperText="Give your post a clear, descriptive title."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={editTagInput}
                  onChange={e => setEditTagInput(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={handleEditTagAdd}
                  onBlur={handleEditTagAdd}
                  placeholder="Add tags (e.g. #Fintech, #Africa, #StartupFunding)"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  helperText="Press Enter or comma to add a tag."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LabelIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (editForm.tags || []).map((tag, idx) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        onDelete={() => handleEditTagDelete(tag)}
                        sx={{ mx: 0.25 }}
                      />
                    ))
                  }}
                />
              </Grid>
              {editForm.type === 'Event' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={editForm.eventLocation || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, eventLocation: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><RoomIcon color="action" /></InputAdornment> }}
                      helperText="Where will the event take place? (e.g. Convention Center, City)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location Link"
                      value={editForm.eventLocationLink || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, eventLocationLink: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      type="url"
                      placeholder="https://maps.example.com/..."
                      InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon color="action" /></InputAdornment> }}
                      helperText="Paste a Google Maps or website link for the location."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date & Time"
                      type="datetime-local"
                      value={editForm.eventStartDateTime || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, eventStartDateTime: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment> }}
                      helperText="When does the event start?"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date & Time"
                      type="datetime-local"
                      value={editForm.eventEndDateTime || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, eventEndDateTime: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment> }}
                      helperText="When does the event end?"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={editForm.description}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="What's on your mind? Share your thoughts..."
                  helperText="Describe your post in detail."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InfoOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    mb: 1,
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: '#f7f9fb',
                    fontWeight: 600,
                    color: 'primary.main',
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: '#90caf9',
                    '&:hover': { borderColor: 'primary.main', bgcolor: '#e3f2fd' }
                  }}
                >
                  {editForm.attachment ? 'Change Image' : 'Add Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file && !file.type.startsWith('image/')) {
                        setSettingsSnackbar({ open: true, message: 'Community posts support image uploads only.', severity: 'error' });
                        e.target.value = '';
                        return;
                      }
                      setEditForm(prev => ({ ...prev, attachment: file || null }));
                    }}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  Share an image with your post. Images appear directly in the community feed.
                </Typography>
                {editForm.attachment && (
                  <Box sx={{
                    mt: 2, mb: 1, p: 2, display: 'flex', alignItems: 'center', gap: 2,
                    border: '1.5px solid #1976d2', borderRadius: 2, bgcolor: '#f3f8fd',
                    boxShadow: 1, position: 'relative',
                    minHeight: 56
                  }}>
                    {editForm.attachment.type && editForm.attachment.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(editForm.attachment)}
                        alt="preview"
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                      />
                    ) : null}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#233876', wordBreak: 'break-all' }}>{editForm.attachment.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {editForm.attachment.type || 'File'}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setEditForm(prev => ({ ...prev, attachment: null }))}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setEditPost(null)} variant="outlined" color="error" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}>Cancel</Button>
          <Button onClick={handleEditPost} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, px: 4 }} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={!!deletePost} onClose={() => setDeletePost(null)} maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4, boxShadow: 8, p: 0, minWidth: 380 } }}>
        <DialogContent sx={{ pt: 5, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{
            background: '#ffe5e5',
            borderRadius: '50%',
            width: 100,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}>
            <DeleteIcon sx={{ color: '#e53935', fontSize: 54 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, textAlign: 'center', color: '#222' }}>Are you Sure ?</Typography>
          <Typography variant="body1" sx={{ color: '#888', mb: 4, textAlign: 'center', fontWeight: 500 }}>
            Are you Sure You want to Delete this Post ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4, gap: 2 }}>
          <Button onClick={() => setDeletePost(null)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 700, px: 5, color: '#444', borderColor: '#e0e0e0', background: '#fff', boxShadow: 'none', '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' } }}>Cancel</Button>
          <Button onClick={() => handleDeletePost(deletePost.id)} variant="contained" sx={{ borderRadius: 2, fontWeight: 700, px: 5, background: '#f44336', color: '#fff', boxShadow: 'none', '&:hover': { background: '#d32f2f' } }} disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Yes, Delete It!'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Company Users Dialog */}
      <Dialog open={openCompanyUsersDialog} onClose={() => setOpenCompanyUsersDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Company Users - {selectedCompanyForUsers?.product_name}</DialogTitle>
        <DialogContent>
          {companyUsersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
              <CircularProgress />
            </Box>
          ) : companyUsersError ? (
            <Typography color="error.main">{companyUsersError}</Typography>
          ) : companyUsers.length === 0 ? (
            <Typography color="text.secondary">No users found for this company.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyUsers
                    .filter(u => {
                      const name = `${u.user?.first_name || ''} ${u.user?.last_name || ''}`.toLowerCase();
                      const email = (u.user?.email || '').toLowerCase();
                      const search = companyUserSearch.toLowerCase();
                      const latestPayment = (u.payments && u.payments.length > 0) ? u.payments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0] : { amount: 0, payment_status: 'unpaid' };
                      const amount = parseFloat(latestPayment.amount) || 0;
                      return (
                        (!search || name.includes(search) || email.includes(search)) &&
                        amount >= companyUserAmountRange[0] &&
                        amount <= companyUserAmountRange[1]
                      );
                    })
                    .map(u => (
                      <TableRow key={u.user_id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {(() => {
                              const profilePic = u.user?.profile_picture || u.user?.profile_pic;
                              const fullUrl = profilePic ?
                                (profilePic.startsWith('http') ? profilePic :
                                  `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profilePic}`) :
                                null;

                              // Log the user object and profile picture URL for debugging
                              console.log('Company User Object:', u.user);
                              console.log('Profile Picture URL:', fullUrl);

                              return (
                                <Avatar
                                  src={fullUrl}
                                  alt={`${u.user?.first_name || ''} ${u.user?.last_name || ''}`.trim()}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: fullUrl ? 'transparent' : '#1976d2',
                                    fontWeight: 700,
                                    fontSize: fullUrl ? 'inherit' : '1rem'
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = null;
                                  }}
                                >
                                  {!fullUrl && `${u.user?.first_name?.[0]?.toUpperCase() || ''}${u.user?.last_name?.[0]?.toUpperCase() || ''}`}
                                </Avatar>
                              );
                            })()}
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{u.user?.first_name} {u.user?.last_name}</Typography>
                              <Typography variant="caption" color="text.secondary">{u.user?.user_type || 'User'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{u.user?.email}<br />{u.user?.phone}</TableCell>
                        <TableCell>
                          {[u.user?.address, u.user?.city, u.user?.country].filter(Boolean).join(', ')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={(u.payments && u.payments.length > 0) ? u.payments[0].payment_status : 'unpaid'}
                            color={(u.payments && u.payments.length > 0 && u.payments[0].payment_status === 'paid') ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {(u.payments && u.payments.length > 0) ? u.payments[0].amount : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleViewUserProfile(u.user)}>
                              <VisibilityIcon />
                            </IconButton>
                            {/* <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(u);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton> */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompanyUsersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* User Profile Dialog */}
      <Dialog open={openUserProfileDialog} onClose={() => setOpenUserProfileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {selectedUserProfile ? (
            <Box>
              <Typography variant="h6">{selectedUserProfile.first_name} {selectedUserProfile.last_name}</Typography>
              <Typography>Email: {selectedUserProfile.email}</Typography>
              <Typography>Phone: {selectedUserProfile.phone}</Typography>
              <Typography>Address: {selectedUserProfile.address || selectedUserProfile.city || '-'}</Typography>
              {/* Add more fields as needed */}
            </Box>
          ) : (
            <Typography color="text.secondary">No user selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserProfileDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* user Chat delete*/}
      {/* Chat user menu */}
      <Menu
        anchorEl={chatMenuAnchorEl}
        open={Boolean(chatMenuAnchorEl)}
        onClose={() => setChatMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            // Delete from chat
            setChatUsers(prev => prev.filter(u => u.id !== chatMenuUser.id));
            // Persist deleted user in localStorage
            const deletedChatUsers = JSON.parse(localStorage.getItem('deletedChatUsers') || '[]');
            if (!deletedChatUsers.includes(chatMenuUser.id)) {
              deletedChatUsers.push(chatMenuUser.id);
              localStorage.setItem('deletedChatUsers', JSON.stringify(deletedChatUsers));
            }
            setChatMenuAnchorEl(null);
            if (selectedChat?.id === chatMenuUser.id) setSelectedChat(null);
          }}
        >
          Delete from Chat
        </MenuItem>
      </Menu>
      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onSubmit={async (data) => {
          try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser?.access) {
              showSnackbar('Authentication token not found', 'error');
              return;
            }
            if (!data.company || !data.name || !data.amount || !data.paymentMethod) {
              showSnackbar('Please fill all fields', 'error');
              return;
            }
            const payload = {
              user_id: data.name.value,
              company_id: data.company.value,
              amount: data.amount,
              payment_method: data.paymentMethod,
            };
            const response = await axios.post(
              `${API_HOST}/api/company-add-user/add/`,
              payload,
              {
                headers: {
                  'Authorization': `Bearer ${currentUser.access}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            if (response.data && response.data.success) {
              showSnackbar('User added and payment recorded successfully!', 'success');
              if (selectedCompanyForUsers) {
                await handleOpenCompanyUsers(selectedCompanyForUsers);
              }
            } else {
              showSnackbar(response.data?.message || 'Failed to add user', 'error');
            }
          } catch (err) {
            showSnackbar(err.response?.data?.message || 'Error adding user', 'error');
          } finally {
            setAddUserDialogOpen(false);
          }
        }}
      />
      <CompanyUpdateLog open={updateLogOpen} onClose={() => setUpdateLogOpen(false)} company={updateLogCompany} />
      {/* Add Menu for message actions (outside the map, near the end of chat messages rendering) */}
      <Menu
        anchorEl={messageMenuAnchorEl}
        open={Boolean(messageMenuAnchorEl)}
        onClose={() => setMessageMenuAnchorEl(null)}
      >
        {(() => {
          const msg = messages.find(m => m.id === messageMenuMsgId);
          const now = new Date();
          const sentTime = msg?.timestamp ? new Date(msg.timestamp) : null;
          const canEdit = msg && msg.text && !msg.file && !msg.text.includes('This message was deleted by') &&
            sentTime && ((now - sentTime) / 1000 < 10); // less than 10 seconds
          //sentTime && ((now - sentTime) / 1000 < 60); // less than 60 seconds (1 minute)

          if (canEdit) {
            return (
              <MenuItem onClick={() => {
                setEditMessageId(messageMenuMsgId);
                setEditMessageText(msg.text || '');
                setMessageMenuAnchorEl(null);
              }}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit message
              </MenuItem>
            );
          }
          return null;
        })()}
        <MenuItem onClick={() => {
          setChatDeleteMessageId(messageMenuMsgId);
          setChatDeleteDialogOpen(true);
          setMessageMenuAnchorEl(null);
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete message
        </MenuItem>
      </Menu>
      {/* Add Dialog for delete confirmation (outside the map, near the end of chat messages rendering) */}
      <Dialog open={chatDeleteDialogOpen} onClose={() => setChatDeleteDialogOpen(false)}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>Are you sure you want to delete this message? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={async () => {
            await handleDeleteMessage(chatDeleteMessageId);
            setChatDeleteDialogOpen(false);
            setChatDeleteMessageId(null);
          }} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      {/* Permit Delete Snackbar */}
      <Snackbar
        open={permitDeleteSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setPermitDeleteSnackbar({ ...permitDeleteSnackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setPermitDeleteSnackbar({ ...permitDeleteSnackbar, open: false })}
          severity={permitDeleteSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {permitDeleteSnackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard; 
