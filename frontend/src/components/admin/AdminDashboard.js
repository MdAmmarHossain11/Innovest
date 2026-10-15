import { API_HOST } from '../../config';
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
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  TablePagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  Switch,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Stack,
  Dialog as MuiDialog,
  DialogContent as MuiDialogContent,
  styled,
  RadioGroup,
  FormControlLabel as MuiFormControlLabel,
  Radio,
  Link,
  Snackbar,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import * as XLSX from 'xlsx';
import { Link as RouterLink } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Visibility, VisibilityOff, CheckCircle, Cancel } from '@mui/icons-material';

// MUI Icons
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PlaceIcon from '@mui/icons-material/Place';
import LinkIcon from '@mui/icons-material/Link';
import LabelIcon from '@mui/icons-material/Label';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Menu from '@mui/material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import Icon from '@mui/material/Icon';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReportIcon from '@mui/icons-material/Report';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Import the outline delete icon
import GroupsIcon from '@mui/icons-material/Groups';
import RoomIcon from '@mui/icons-material/Room';
import EventIcon from '@mui/icons-material/Event';
import CompanyView from '../company/CompanyView';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import TitleIcon from '@mui/icons-material/Title';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RepeatIcon from '@mui/icons-material/Repeat';
import DescriptionIcon from '@mui/icons-material/Description';

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// MUI Lab
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

// Local imports
import authService from '../../services/authService';
import communityService from '../../services/communityService';
import userService from '../../services/userService';
import companyService from '../../services/companyService';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import KYCPage from './KYCPage';

const EventDateTimeField = ({ label, value, onChange, helperText }) => {
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value ? new Date(value) : null}
        onChange={date => onChange(date ? date.toISOString() : '')}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onAccept={() => setOpen(false)}
        closeOnSelect={false}
        inputFormat={'MM/dd/yyyy\nhh:mm a'}
        PopperProps={{
          placement: 'top-start',
          modifiers: [{ name: 'flip', enabled: false }],
        }}
        componentsProps={{
          actionBar: {
            actions: ['cancel', 'accept'],
          },
        }}
        localeText={{
          cancelButtonLabel: 'Cancel',
          okButtonLabel: 'Done',
        }}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            multiline
            rows={2}
            helperText={helperText}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

const API_URL = `${API_HOST}/api/`;
const API_BASE_URL = `${API_HOST}/api/auth`;
const CHANGE_PASSWORD_URL = `${API_URL}settings/change-password/`;

// Styled components
const ActivityDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 340,
    padding: theme.spacing(2),
  },
}));

const FilterDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
}));

function AdminDashboard() {
  // Mock activity log for the Activity Log section
  const [activityLog, setActivityLog] = useState([]);

  const [value, setValue] = useState(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    const requestedTabs = { users: 1, companies: 2, kyc: 3 };
    if (requestedTab && requestedTabs[requestedTab] !== undefined) {
      return requestedTabs[requestedTab];
    }
    const savedTab = localStorage.getItem('adminDashboardTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  // Add User dialog state
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '', // Add password confirmation field
    is_staff: '0',
    user_type: 'user',
    title: '',
    company: '',
    website: '',
    city: '',
    state: '',
    bio: '',
    phone: '',
    position: '',
    address: '',
    is_active: true,
    email_verified: false
  });

  // Pagination and filtering state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    userType: '',
    isActive: '',
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDeletePostsDialog, setOpenDeletePostsDialog] = useState(false);
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  const [adminNotificationError, setAdminNotificationError] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const fetchAdminNotifications = async (markRead = false) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.access) return;
    try {
      setAdminNotificationError(null);
      const response = await axios.get(
        `${API_HOST}/api/company-control/notifications/`,
        {
          headers: { Authorization: `Bearer ${currentUser.access}` },
          params: markRead ? { mark_read: true } : {},
        }
      );
      setAdminNotifications(response.data.results || []);
      setAdminUnreadCount(response.data.unread_count || 0);
    } catch (notificationError) {
      console.warn('Could not fetch admin notifications:', notificationError);
      setAdminNotificationError('Could not load notifications. Please try again.');
    }
  };

  useEffect(() => {
    fetchAdminNotifications();
    const interval = setInterval(() => fetchAdminNotifications(), 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAdminNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    fetchAdminNotifications(true);
  };
  const [openBatchDeleteConfirm, setOpenBatchDeleteConfirm] = useState(false); // State for user batch delete confirmation
  const [openSingleUserDeleteConfirm, setOpenSingleUserDeleteConfirm] = useState(false); // New state for single user delete confirmation
  const [userToDeleteId, setUserToDeleteId] = useState(null); // State to store the ID of the user to be deleted
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

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
        setUpcomingEvents([]);
        return;
      }
      const endpoints = [
        `${API_HOST}/api/events/upcoming/`,
        `${API_HOST}/api/events/`,
        `${API_HOST}/api/company-events/upcoming/`
      ];
      let eventsData = [];
      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${currentUser.access}`,
              'Content-Type': 'application/json'
            },
            params: {
              limit: 10,
              upcoming: true
            }
          });
          let rawEvents = [];
          if (Array.isArray(response.data)) {
            rawEvents = response.data;
          } else if (response.data.results) {
            rawEvents = response.data.results;
          } else if (response.data.data) {
            rawEvents = response.data.data;
          }
          eventsData = rawEvents.filter(event => {
            return event.registration_end && isRegistrationEndingSoon(event.registration_end);
          });
          eventsData.sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end));
          eventsData = eventsData.slice(0, 2);
          if (eventsData.length > 0) break;
        } catch (err) {
          lastError = err;
          continue;
        }
      }
      setUpcomingEvents(eventsData);
    } catch (error) {
      setUpcomingEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch upcoming events on mount
  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Companies state
  const [companies, setCompanies] = useState([]);
  const [companyFilters, setCompanyFilters] = useState({
    industry: '',
    status: '',
  });
  const [companyStatusFilter, setCompanyStatusFilter] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [companyIndustryFilter, setCompanyIndustryFilter] = useState('');
  const [showRequestedCompanies, setShowRequestedCompanies] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]); // State for selected companies
  const [openCompanyBatchDeleteConfirm, setOpenCompanyBatchDeleteConfirm] = useState(false); // New state for company batch delete confirmation
  const [openSingleCompanyDeleteConfirm, setOpenSingleCompanyDeleteConfirm] = useState(false); // New state for single company delete confirmation
  const [companyToDeleteId, setCompanyToDeleteId] = useState(null); // State to store the ID of the company to be deleted

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    autoLogout: 30,
  });

  // Company dialog states
  const [openAddCompanyDialog, setOpenAddCompanyDialog] = useState(false);
  const [openEditCompanyDialog, setOpenEditCompanyDialog] = useState(false);
  const [openDeleteCompanyDialog, setOpenDeleteCompanyDialog] = useState(false);
  const [openViewCompanyDialog, setOpenViewCompanyDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    industry: '',
    status: 'active',
    description: '',
    website: '',
    address: '',
    phone: '',
  });

  // Advanced filtering states
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: [null, null],
    userTypes: [],
    industries: [],
    status: [],
    searchFields: ['name', 'email', 'company'],
  });
  const [openAdvancedFilters, setOpenAdvancedFilters] = useState(false);

  // Activity logging state
  const [activityLogs, setActivityLogs] = useState([]);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  // Community posts states are defined elsewhere in the component

  // Company hierarchy states
  const [companyHierarchy, setCompanyHierarchy] = useState([]);
  const [showHierarchyView, setShowHierarchyView] = useState(false);
  const [parentCompany, setParentCompany] = useState(null);
  const [subsidiaries, setSubsidiaries] = useState([]);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    usersByType: [],
    usersByCompany: [],
    companiesByIndustry: [],
    activityByDate: [],
    totalEarnings: 559250,
    earningsChange: 1824,
    totalCompanies: 0, // Initialize total companies count
    companiesChange: 0, // Initialize companies change percentage
    totalUsers: 0, // Initialize total users count
    usersChange: 0, // Initialize users change percentage
    totalEvents: 0, // Initialize total events count
    eventsChange: 0, // Initialize events change percentage
    totalPosts: 0, // Initialize total posts count
    postsChange: 0, // Initialize posts change percentage
    totalPayments: 0, // Initialize total payments amount
    paymentsChange: 0, // Initialize payments change percentage
    myBalance: 0,
    balanceChange: 0,
    revenueOrders: 7585,
    revenueEarnings: 22890,
    revenueRefunds: 367,
    conversionRatio: 1892,
    revenueByMonth: [
      { name: 'Jan', Orders: 80, Earnings: 22, Refunds: 10 },
      { name: 'Feb', Orders: 100, Earnings: 25, Refunds: 12 },
      { name: 'Mar', Orders: 60, Earnings: 18, Refunds: 8 },
      { name: 'Apr', Orders: 110, Earnings: 30, Refunds: 15 },
      { name: 'May', Orders: 70, Earnings: 20, Refunds: 9 },
      { name: 'Jun', Orders: 85, Earnings: 23, Refunds: 11 },
      { name: 'Jul', Orders: 50, Earnings: 15, Refunds: 6 },
      { name: 'Aug', Orders: 30, Earnings: 10, Refunds: 3 },
      { name: 'Sep', Orders: 90, Earnings: 27, Refunds: 13 },
      { name: 'Oct', Orders: 95, Earnings: 28, Refunds: 14 },
    ],
    salesByLocation: [
      { name: 'Canada', percent: 75, color: '#233876' },
      { name: 'Greenland', percent: 47, color: '#82ca9d' },
      { name: 'Russia', percent: 82, color: '#f87171' },
      { name: 'Palestine', percent: 39, color: '#fbbf24' },
    ],
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Bulk import states
  const [openBulkImport, setOpenBulkImport] = useState(false);
  const [importType, setImportType] = useState('users');
  const [importFile, setImportFile] = useState(null);
  const [importErrors, setImportErrors] = useState([]);

  // Add a new state for the company view type
  const [companyView, setCompanyView] = useState('approved'); // 'approved', 'pending', 'rejected'

  // Fetch total number of users
  const fetchTotalUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      if (Array.isArray(users)) {
        setAnalyticsData(prev => ({
          ...prev,
          totalUsers: users.length,
          usersChange: 0 // Set a default change value
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch total number of companies
  const fetchTotalCompanies = async () => {
    try {
      const companies = await companyService.getCompanies();
      if (Array.isArray(companies)) {
        setAnalyticsData(prev => ({
          ...prev,
          totalCompanies: companies.length,
          companiesChange: 0 // Set a default change value
        }));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Fetch total number of events
  const fetchTotalEvents = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get(`${API_URL}events/`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        }
      });

      const events = response.data?.results || response.data || [];

      setAnalyticsData(prev => ({
        ...prev,
        totalEvents: Array.isArray(events) ? events.length : 0,
        eventsChange: 0 // Set a default change value
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      // Set default values if API call fails
      setAnalyticsData(prev => ({
        ...prev,
        totalEvents: 0,
        eventsChange: 0
      }));
    }
  };

  // Fetch total number of posts
  const fetchTotalPosts = async () => {
    try {
      const posts = await communityService.getPosts();
      setAnalyticsData(prev => ({
        ...prev,
        totalPosts: posts.length,
        postsChange: 0 // Set a default change value
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Set default values if API call fails
      setAnalyticsData(prev => ({
        ...prev,
        totalPosts: 0,
        postsChange: 0
      }));
    }
  };

  // Fetch total payment amount
  const fetchTotalPayments = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        console.error('No authentication token found');
        return;
      }

      console.log('Fetching payments from:', `${API_URL}payments/list/`);
      const response = await axios.get(`${API_URL}payments/list/`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Payments API response:', response.data);

      // The response should be an object with a 'payments' array
      const payments = response.data?.payments || [];

      if (!Array.isArray(payments)) {
        throw new Error('Invalid response format: payments is not an array');
      }

      const totalAmount = payments.reduce((sum, payment) => {
        // Only sum paid payments
        if (payment.payment_status === 'paid' || payment.payment_status === 'completed') {
          const amount = parseFloat(payment.amount || 0);
          console.log(`Adding payment: ${payment.payment_id}, amount: ${amount}, status: ${payment.payment_status}`);
          return sum + amount;
        }
        return sum;
      }, 0);

      console.log('Fetched payments:', {
        payments,
        totalAmount,
        paymentCount: payments.length,
        paidPayments: payments.filter(p => p.payment_status === 'paid' || p.payment_status === 'completed')
      });

      setAnalyticsData(prev => ({
        ...prev,
        totalPayments: totalAmount,
        paymentsChange: 0 // Set a default change value
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      // Set default values if API call fails
      setAnalyticsData(prev => ({
        ...prev,
        totalPayments: 0,
        paymentsChange: 0
      }));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTotalUsers();
    fetchTotalCompanies();
    fetchTotalEvents();
    fetchTotalPosts();
    fetchTotalPayments();
  }, []);

  // New state for the event creation dialog
  const [openCreateEventDialog, setOpenCreateEventDialog] = useState(false);
  const [eventCategoryMenuOpen, setEventCategoryMenuOpen] = useState(false);
  // Add state for event edit dialog
  const [openEditEventDialog, setOpenEditEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Add event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    coverImage: null,
    location: '',
    locationLink: '',
    categories: [],
    registration_form: '',
    publish: true,
    startAt: '',
    endAt: '',
    registrationEnd: ''
  });

  const eventCategories = [
    'Conference',
    'Workshop',
    'Seminar',
    'Networking',
    'Training',
    'Webinar',
    'Hackathon',
    'Other'
  ];

  // Add state for company events
  const [companyEvents, setCompanyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventError, setEventError] = useState(null);

  // Add state for event search and category filter
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState('');

  // Add state for user and company search/category
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const handleSettingsMenuOpen = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsMenuClose = () => setSettingsAnchorEl(null);

  const handleSettingsTabChange = (event, newValue) => {
    setSettingsTab(newValue);
  };

  // Add state for todo list
  const [todos, setTodos] = useState([]);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  // Add state for Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const emailTabs = ['Primary'];
  const [emailTab, setEmailTab] = useState(0);

  // Add state for settings tab
  const [settingsTab, setSettingsTab] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add state for shared ideas
  const [sharedIdeas, setSharedIdeas] = useState([
    { id: 1, title: 'Improve Dashboard UI', author: 'Mohen Khan', status: 'Pending', postAt: '2024-06-01' },
    { id: 2, title: 'Add Dark Mode', author: 'Innovest Admin', status: 'Approved', postAt: '2024-06-02' },
  ]);
  const [ideaSearch, setIdeaSearch] = useState('');
  const [ideaStatusFilter, setIdeaStatusFilter] = useState('');
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  // Live date and clock state
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Add function to fetch company events
  const fetchCompanyEvents = async () => {
    setLoadingEvents(true);
    setEventError(null);
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser?.access) {
        const response = await axios.get(`${API_HOST}/api/events/`, {
          headers: { Authorization: `Bearer ${currentUser.access}` }
        });

        // Sort events by end date in descending order (latest end dates first)
        const sortedEvents = response.data.sort((a, b) => {
          const dateA = new Date(a.end_at || a.registration_end || 0);
          const dateB = new Date(b.end_at || b.registration_end || 0);
          return dateB - dateA; // Descending order
        });

        setCompanyEvents(sortedEvents);
      }
    } catch (error) {
      console.error('Error fetching company events:', error);
      setEventError('Failed to fetch company events. Please try again.');
    } finally {
      setLoadingEvents(false);
    }
  };

  // Update useEffect to fetch events when tab changes
  useEffect(() => {
    if (value === 4) { // Events tab (index 4)
      fetchCompanyEvents();
    }
  }, [value]);

  // Add function to handle event deletion (modified to open dialog)
  const handleDeleteEvent = async (eventId) => {
    setEventToDeleteId(eventId);
    setOpenSingleEventDeleteConfirm(true);
  };

  // Add function to handle event status change
  const handleEventStatusChange = async (eventId, newStatus) => {
    try {
      const currentUser = authService.getCurrentUser();
      await axios.patch(`${API_HOST}/api/events/${eventId}/`, {
        privacy: newStatus
      }, {
        headers: { Authorization: `Bearer ${currentUser.access}` }
      });
      fetchCompanyEvents(); // Refresh the events list
    } catch (error) {
      console.error('Error updating event status:', error);
      setEventError('Failed to update event status. Please try again.');
    }
  };

  // Add this state at the top with other state declarations
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Update the fetchUserProfile function to handle profile picture
  const fetchUserProfile = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        console.log('No access token found');
        return;
      }

      const response = await axios.get(
        `${API_HOST}/api/settings/profile/`,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`
          }
        }
      );

      if (response.status === 200) {
        const userData = response.data;
        setUserProfile(userData);
        setSettingsFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          title: userData.title || '',
          company: userData.company || '',
          website: userData.website || '',
          city: userData.city || '',
          state: userData.state || '',
          bio: userData.bio || '',
          position: userData.position || '',
          address: userData.address || '',
          country: userData.country || ''
        });

        // Set profile image URL if it exists
        if (userData.profile_pic) {
          setProfileImageUrl(`${API_HOST}${userData.profile_pic}`);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch user profile',
        severity: 'error'
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const response = await axios.get(
        `${API_HOST}/api/user-control/users/`,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      setSnackbar({
        open: true,
        message: 'Error fetching users',
        severity: 'error'
      });
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = authService.getCurrentUser();

      if (!currentUser?.access) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await axios.get(`${API_HOST}/api/company-control/companies/`, {
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json'
        },
        params: {
          industry: companyFilters.industry || undefined,
          status: companyStatusFilter || undefined
        }
      });

      if (response.data.status === 'success') {
        const companiesData = response.data.data.map(company => ({
          id: company.id,
          name: company.product_name,
          industry: company.industry,
          city: company.city,
          state: company.state,
          country: company.country,
          location: `${company.city}, ${company.state}, ${company.country}`,
          status: company.company_status,
          description: company.quick_description,
          logo: company.cover_image,
          slide_image: company.slide_image,
          created_at: company.created_at,
          updated_at: company.updated_at,
          user_id: company.user,
          website: company.website,
          phone: company.phone
        }));
        setCompanies(companiesData);
      } else {
        setError('Failed to fetch companies data');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to fetch companies. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to fetch companies when filters change
  useEffect(() => {
    fetchCompanies();
  }, [companyStatusFilter, companyFilters.industry]);

  // Fetch company hierarchy
  const fetchCompanyHierarchy = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const response = await axios.get(
        `${API_URL}companies/hierarchy/`,
        {
          headers: { Authorization: `Bearer ${currentUser.access}` }
        }
      );
      setCompanyHierarchy(response.data);
    } catch (error) {
      console.error('Error fetching company hierarchy:', error);
      setError('Failed to fetch company hierarchy');
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, filters]);

  useEffect(() => {
    if (value === 1) {
      fetchCompanies();
    }
  }, [value]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  const handleSelectAllUsers = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleBatchOperation = async (operation) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'Only admin users can perform batch operations',
          severity: 'error'
        });
        return;
      }

      if (selectedUsers.length === 0) {
        setSnackbar({
          open: true,
          message: 'Please select users to perform the operation',
          severity: 'warning'
        });
        return;
      }

      if (operation === 'delete') {
        // Open the custom delete confirmation dialog
        setOpenBatchDeleteConfirm(true);
        // The actual deletion logic is moved to handleConfirmBatchDelete
      }
    } catch (error) {
      console.error('Batch operation error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to perform batch operations. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'An error occurred while performing the batch operation',
        severity: 'error'
      });
    }
  };

  // New function to handle the confirmed user batch deletion
  const handleConfirmBatchDelete = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'Only admin users can perform batch operations',
          severity: 'error'
        });
        return;
      }

      if (selectedUsers.length === 0) {
        // This case should ideally not happen if the dialog is only opened when users are selected
        setSnackbar({
          open: true,
          message: 'No users selected for deletion',
          severity: 'warning'
        });
        return;
      }

      // Delete each selected user
      const deletePromises = selectedUsers.map(userId => {
        // Find the user object for logging or other needs if necessary
        const user = users.find(u => u.id === userId);
        if (!user) return Promise.resolve(); // Skip if user not found (already deleted?)

        return axios.delete(
          `${API_HOST}/api/user-control/users/${userId}/`,
          {
            headers: {
              'Authorization': `Bearer ${currentUser.access}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      });

      await Promise.all(deletePromises);

      // Remove deleted users from the list
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setOpenBatchDeleteConfirm(false); // Close the dialog
      setSnackbar({
        open: true,
        message: `${selectedUsers.length} users deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Batch deletion error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete users. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'An error occurred while deleting users',
        severity: 'error'
      });
    } finally {
      // Always close the dialog even if there was an error with some deletions
      setOpenBatchDeleteConfirm(false);
      // You might want to refetch users here or show a more detailed error
      fetchUsers(); // Refresh user list
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('adminDashboardTab', newValue.toString());
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData(user);
    setOpenEditDialog(true);
  };

  // This handleDeleteUser is now updated to open the confirmation dialog
  const handleDeleteUser = async (userOrId) => {
    // This function will now just set the user ID and open the confirmation dialog
    // The actual deletion logic is moved to handleConfirmSingleUserDelete
    const userId = typeof userOrId === 'object' ? userOrId.id : userOrId;
    if (userId) {
      setUserToDeleteId(userId);
      setOpenSingleUserDeleteConfirm(true);
    }
  };

  // New function to handle the confirmed single user deletion
  const handleConfirmSingleUserDelete = async () => {
    if (!userToDeleteId) return; // Should not happen if dialog is opened correctly

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete users. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      const response = await axios.delete(
        `${API_HOST}/api/user-control/users/${userToDeleteId}/`,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Delete response:', response.data);

      // Remove the deleted user from the list
      setUsers(users.filter(u => u.id !== userToDeleteId));
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete users. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      // Handle not found errors
      if (error.response?.status === 404) {
        setSnackbar({
          open: true,
          message: 'User not found',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'An error occurred while deleting the user',
        severity: 'error'
      });
    } finally {
      setOpenSingleUserDeleteConfirm(false); // Always close the dialog
      setUserToDeleteId(null); // Clear the user ID
      fetchUsers(); // Refresh the user list
    }
  };

  // Add state for selected email
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Add state for company contacts, loading, and pagination
  const [companyContacts, setCompanyContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactPage, setContactPage] = useState(1);
  const [contactTotalPages, setContactTotalPages] = useState(0);

  // Utility function for logging
  const logError = (context, error) => {
    console.error(`Error in ${context}:`, error);

    // Detailed error logging
    if (error.response) {
      console.error('Response Error Details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
  };

  // Fetch company contacts
  const fetchCompanyContacts = async (page = 1, showAll = false) => {
    setIsLoadingContacts(true);
    try {
      // Get the access token using authService
      const accessToken = authService.getToken();

      // Log token details for debugging
      console.log('Access Token:', accessToken ? 'Present' : 'Missing');
      console.log('Tokens in localStorage:', {
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token')
      });

      // If no token, redirect to login or handle authentication
      if (!accessToken) {
        console.error('No access token found');
        // Optionally redirect to login page
        // window.location.href = '/login';
        return;
      }

      const params = showAll ? { page_size: 1000 } : { page: page };

      const response = await axios.get(`${API_HOST}/api/emails/company-contacts/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: params
      });

      if (showAll) {
        // When showing all, set all results and disable pagination
        setCompanyContacts(response.data.results);
        setContactTotalPages(1);
        setContactPage(1);
      } else {
        // Normal pagination
        setCompanyContacts(response.data.results);
        setContactTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
        setContactPage(page);
      }
    } catch (error) {
      console.error('Error fetching company contacts:', error);

      // Handle 401 Unauthorized error
      if (error.response?.status === 401) {
        console.log('Token expired, attempting to refresh...');

        try {
          const refreshToken = localStorage.getItem('refresh_token');

          if (refreshToken) {
            console.log('Attempting to refresh token...');
            const refreshResponse = await axios.post(`${API_HOST}/api/auth/token/refresh/`, {
              refresh: refreshToken
            });

            console.log('Token refresh response:', refreshResponse.data);

            // Update tokens in localStorage
            localStorage.setItem('access_token', refreshResponse.data.access);

            // Retry the original request with the new token
            const params = showAll ? { page_size: 1000 } : { page: page };
            const retryResponse = await axios.get(`${API_HOST}/api/emails/company-contacts/`, {
              headers: {
                'Authorization': `Bearer ${refreshResponse.data.access}`
              },
              params: params
            });

            if (showAll) {
              setCompanyContacts(retryResponse.data.results);
              setContactTotalPages(1);
              setContactPage(1);
            } else {
              setCompanyContacts(retryResponse.data.results);
              setContactTotalPages(Math.ceil(retryResponse.data.count / 10));
              setContactPage(page);
            }
          } else {
            // No refresh token available, redirect to login
            console.error('No refresh token available');
            // window.location.href = '/login';
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Handle refresh failure (e.g., redirect to login)
          // window.location.href = '/login';
        }
      }
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Add state for showing all contacts
  const [showingAllContacts, setShowingAllContacts] = useState(false);

  // Fetch contacts when Email tab is first opened or changed
  useEffect(() => {
    if (value === 7) { // Email tab (index 7)
      fetchCompanyContacts(1, false);
    }
  }, [value]);

  // Pagination handlers
  const handleNextPage = () => {
    if (contactPage < contactTotalPages) {
      fetchCompanyContacts(contactPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (contactPage > 1) {
      fetchCompanyContacts(contactPage - 1);
    }
  };

  // State for selected contact
  const [selectedContact, setSelectedContact] = useState(null);

  // Add this state at the top of the component
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [openContactBatchDeleteConfirm, setOpenContactBatchDeleteConfirm] = useState(false); // New state for contact batch delete confirmation

  // Render company contacts with pagination and detail view
  const renderCompanyContacts = () => (
    <Box sx={{ display: 'flex', height: 700, background: '#fff', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
      {/* Left: Folders/Labels */}
      <Box sx={{ width: 220, background: '#fcf8f3', borderRight: '1px solid #eee', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="contained"
          sx={{
            mb: 2,
            borderRadius: 3,
            fontWeight: 700,
            background: '#1f95f5',
            color: '#fff',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(31,149,245,0.10)',
            px: 3,
            py: 1.2,
            '&:hover': { background: '#1878c9' }
          }}
          onClick={() => setOpenCompose(true)}
        >
          + Compose
        </Button>
        <List>
          <ListItem button sx={{ borderRadius: 2, mb: 0.5, background: '#f0f0f0' }}>
            <ListItemIcon><EmailIcon /></ListItemIcon>
            <ListItemText primary="Company Contacts" />
            <Badge color="primary" badgeContent={companyContacts.length} />
          </ListItem>
        </List>
      </Box>

      {/* Right: Email List and Detail */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Email Toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #eee', background: '#fff', gap: 2 }}>
          <Checkbox
            style={{ marginLeft: '-11px' }}
            checked={companyContacts.length > 0 && selectedContactIds.length === companyContacts.length}
            indeterminate={selectedContactIds.length > 0 && selectedContactIds.length < companyContacts.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedContactIds(companyContacts.map(contact => contact.id));
              } else {
                setSelectedContactIds([]);
              }
            }}
          />
          <IconButton
            onClick={() => {
              handleBulkDeleteContacts(); // Use the updated handler to open the custom dialog
            }}
            disabled={selectedContactIds.length === 0}
          >
            <DeleteIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Button
            variant={showingAllContacts ? "contained" : "outlined"}
            size="small"
            onClick={() => {
              if (showingAllContacts) {
                setShowingAllContacts(false);
                fetchCompanyContacts(1, false);
              } else {
                setShowingAllContacts(true);
                fetchCompanyContacts(1, true);
              }
            }}
            sx={{ mr: 1 }}
          >
            {showingAllContacts ? "Show Paginated" : "Show All"}
          </Button>
          <IconButton onClick={() => fetchCompanyContacts(1, showingAllContacts)}><RefreshIcon /></IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {companyContacts.length} contacts
          </Typography>
        </Box>

        {/* Split view for contact list and details */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* Contact List */}
          <TableContainer
            sx={{
              width: selectedContact ? '50%' : '100%',
              borderRight: selectedContact ? '1px solid #eee' : 'none',
              maxHeight: 700,
              overflowY: 'auto',
            }}
          >
            <Table>
              <TableBody>
                {isLoadingContacts ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  companyContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      hover
                      selected={selectedContact?.id === contact.id}
                      onClick={() => setSelectedContact(contact)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedContactIds.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContactIds(prev => [...prev, contact.id]);
                            } else {
                              setSelectedContactIds(prev => prev.filter(id => id !== contact.id));
                            }
                          }}
                          onClick={e => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {contact.name.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {contact.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contact.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {contact.subject || 'No Subject'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {format(parseISO(contact.created_at), 'MMM d')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Contact Detail View */}
          {selectedContact && (
            <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', height: 1, background: '#f9fbfd', p: 0 }}>
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Contact Details</Typography>
                  <IconButton onClick={() => setSelectedContact(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                    {selectedContact.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedContact.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedContact.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Contact Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{selectedContact.phone || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Subject</Typography>
                      <Typography variant="body1">{selectedContact.subject || 'No Subject'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Message</Typography>
                  <Typography variant="body2" sx={{
                    p: 2,
                    background: '#f0f0f0',
                    borderRadius: 2,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 350,
                    minHeight: 120,
                    overflowY: 'auto',
                    fontSize: '1rem',
                  }}>
                    {selectedContact.message || 'No message provided'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Received on: {format(parseISO(selectedContact.created_at), 'MMMM d, yyyy h:mm a')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, p: 2, borderTop: '1px solid #eee', background: '#fff' }}>
                {/*<Button variant="contained" color="primary" startIcon={<ReplyIcon />} >
                  Reply
                </Button>
                <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} >
                  Delete
                </Button>*/}
              </Box>
            </Box>
          )}
        </Box>

        {/* Pagination Controls */}
        {!showingAllContacts && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderTop: '1px solid #eee' }}>
            <Button
              onClick={handlePreviousPage}
              disabled={contactPage === 1}
              size="small"
              variant="outlined"
            >
              Previous
            </Button>
            <Typography variant="body2" color="text.secondary">
              Page {contactPage} of {contactTotalPages}
            </Typography>
            <Button
              onClick={handleNextPage}
              disabled={contactPage === contactTotalPages}
              size="small"
              variant="outlined"
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  // Default email values (commented out)
  const emailData = [
    // { from: 'Peter, me', subject: 'Hello – Trip home from Colombo has been arranged, then Jenna will co...', date: 'Mar 7' },
    // { from: 'Susanna', subject: 'Freelance - Since you asked... and i'm inconceivably bored at the train ...', date: 'Mar 7' },
    // { from: 'Web Support Dennis (7)', subject: 'Re: New mail settings – Will you answer him asap?', date: 'Mar 5' },
    // { from: 'Peter', subject: 'Support - Off on Thursday – Eff that place, you might as well stay here ...', date: 'Mar 4' },
    // { from: 'Miller, me (5)', subject: 'Family - Last pic over my village – Yeah i'd like that! Do you remember ...', date: 'Feb 27' }
  ];

  const handleBulkDeleteContacts = async () => {
    // Open the custom confirmation dialog
    if (selectedContactIds.length > 0) {
      setOpenContactBatchDeleteConfirm(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Please select contacts to delete',
        severity: 'warning'
      });
    }
  };

  // New function to handle confirmed contact batch deletion
  const handleConfirmBulkDeleteContacts = async () => {
    try {
      await axios.post(`${API_HOST}/api/emails/bulk-delete/`, {
        ids: selectedContactIds,
      });
      fetchCompanyContacts(1, showingAllContacts);
      setSelectedContactIds([]);
      setOpenContactBatchDeleteConfirm(false); // Close the dialog
      setSnackbarMessage(`${selectedContactIds.length} contact${selectedContactIds.length > 1 ? 's' : ''} deleted successfully!`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete contacts.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setOpenContactBatchDeleteConfirm(false); // Close the dialog even on error
    }
  };

  // Add User Form State
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: '',
    is_staff: false,
    // Default values for other fields
    title: 'Mr.',
    company: '',
    website: '',
    city: 'Dhaka',
    state: 'Dhaka',
    bio: 'Welcome to Innovest!',
    phone: '',
    position: '',
    address: ''
  });
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkPasswordStrength = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewUser({ ...newUser, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  const isAddUserPasswordValid =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  const PasswordRequirements = () => (
    <List dense sx={{ mt: 1, mb: 2 }}>
      <ListItem>
        <ListItemIcon>
          {passwordRequirements.length ? <CheckCircle color="success" /> : <Cancel color="error" />}
        </ListItemIcon>
        <ListItemText primary="At least 8 characters long" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {passwordRequirements.uppercase ? <CheckCircle color="success" /> : <Cancel color="error" />}
        </ListItemIcon>
        <ListItemText primary="Include at least one uppercase letter" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {passwordRequirements.lowercase ? <CheckCircle color="success" /> : <Cancel color="error" />}
        </ListItemIcon>
        <ListItemText primary="Include at least one lowercase letter" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {passwordRequirements.number ? <CheckCircle color="success" /> : <Cancel color="error" />}
        </ListItemIcon>
        <ListItemText primary="Include at least one number" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {passwordRequirements.special ? <CheckCircle color="success" /> : <Cancel color="error" />}
        </ListItemIcon>
        <ListItemText primary={'Include at least one special character (!@#$%^&*(),.?":{}|<>)'} />
      </ListItem>
    </List>
  );

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Language and theme states
  const [language, setLanguage] = useState('en');
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Chat states
  const [chatTab, setChatTab] = useState('chats');
  const [chatUsers] = useState([
    { id: 1, name: 'Lisa Parker', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', online: true, unread: 0 },
    { id: 2, name: 'Frank Thomas', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', online: false, unread: 8 },
    { id: 3, name: 'Clifford Taylor', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', online: false, unread: 8 },
    { id: 4, name: 'Janette Caster', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', online: false, unread: 0 },
    { id: 5, name: 'Sarah Beattie', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', online: false, unread: 5 },
    { id: 6, name: 'Nellie Cornett', avatar: 'https://randomuser.me/api/portraits/women/6.jpg', online: false, unread: 0 },
  ]);
  const [selectedChat, setSelectedChat] = useState(chatUsers[0]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Email compose states
  const [openCompose, setOpenCompose] = useState(false);
  const [composeTo, setComposeTo] = useState([]);
  const [composeCc, setComposeCc] = useState([]);
  const [composeBcc, setComposeBcc] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Idea states
  const [openAddIdeaDialog, setOpenAddIdeaDialog] = useState(false);
  const [ideaForm, setIdeaForm] = useState({
    image: null,
    title: '',
    description: '',
    categories: [],
  });
  const [ideaCategories] = useState([
    'UI/UX',
    'Feature',
    'Performance',
    'Integration',
    'Other'
  ]);

  // Event states
  const [openViewEventDialog, setOpenViewEventDialog] = useState(false);

  // Language and theme handlers
  const handleLangMenuOpen = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangMenuClose = () => setLangAnchorEl(null);
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLangAnchorEl(null);
  };
  const handleToggleDarkMode = () => setDarkMode(prev => !prev);

  // Chat handlers
  const handleSendChat = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { from: 'Me', text: chatInput, time: '09:02' }]);
      setChatInput('');
    }
  };

  // Email handlers
  const handleSendEmail = async () => {
    try {
      if (!composeTo.length || !composeSubject || !composeBody) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      const emailData = {
        recipient: composeTo[0],
        cc: composeCc.length > 0 ? composeCc[0] : null,
        bcc: composeBcc.length > 0 ? composeBcc[0] : null,
        subject: composeSubject,
        body: composeBody
      };

      const response = await fetch(`${API_HOST}/api/mailer/send-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setComposeTo([]);
      setComposeCc([]);
      setComposeBcc([]);
      setComposeSubject('');
      setComposeBody('');
      setOpenCompose(false);
      setSnackbar({
        open: true,
        message: data.message || 'Email sent successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send email. Please try again.',
        severity: 'error'
      });
    }
  };

  // Company handlers
  const handleCompanyStatusChange = async (companyId, newStatus) => {
    // Find the company before the async call
    const changedCompany = companies.find(c => c.id === companyId);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await axios.patch(
        `${API_HOST}/api/company-control/companies/${companyId}/update_status/`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setCompanies(prevCompanies =>
          prevCompanies.map(company =>
            company.id === companyId
              ? { ...company, status: newStatus }
              : company
          )
        );
        // Use the company found before the async call
        if (changedCompany && (newStatus === 'Approved' || newStatus === 'Rejected')) {
          setActivityLog(prev => [
            {
              type: 'company-status',
              action: newStatus,
              company: changedCompany.name,
              time: new Date().toISOString()
            },
            ...prev
          ]);
        }
      } else {
        setError('Failed to update company status');
      }
    } catch (error) {
      console.error('Error updating company status:', error);
      setError('Failed to update company status. Please try again.');
    }
  };

  // Event handlers
  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      coverImage: null,
      location: event.location || '',
      locationLink: event.location_link || '',
      categories: event.categories ? (Array.isArray(event.categories) ? event.categories :
        (typeof event.categories === 'string' && event.categories.startsWith('[') ?
          JSON.parse(event.categories) : [event.categories])) : [],
      registration_form: event.registration_form || '',
      publish: event.privacy === 'publish',
      startAt: event.start_at || '',
      endAt: event.end_at || '',
      registrationEnd: event.registration_end || ''
    });
    setOpenEditEventDialog(true);
  };

  // Advanced filter handlers
  const handleAdvancedFilterChange = (filterType, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Export handler
  const exportData = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    logActivity('data_exported', `Exported ${filename} data`);
  };

  // Add logActivity function
  const logActivity = (action, details) => {
    const activity = {
      action,
      details,
      timestamp: new Date().toISOString(),
      user: userProfile?.email || 'Unknown'
    };
    setActivityLogs(prev => [activity, ...prev]);
  };

  // Add handleEditSubmit function
  const handleEditSubmit = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'Only admin users can update other users',
          severity: 'error'
        });
        return;
      }

      // Prepare the data for update
      const updateData = {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        user_type: editFormData.user_type,
        title: editFormData.title || '',
        company: editFormData.company || '',
        website: editFormData.website || '',
        city: editFormData.city || '',
        state: editFormData.state || '',
        bio: editFormData.bio || '',
        phone: editFormData.phone || '',
        position: editFormData.position || '',
        address: editFormData.address || '',
        is_staff: editFormData.is_staff === 'yes' || editFormData.is_staff === true,
        email_verified: true
      };

      // Only include password if it's being changed
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      // Log the request details for debugging
      console.log('Updating user:', selectedUser.id);
      console.log('Update data:', updateData);
      console.log('Current user type:', currentUser.user_type);

      const response = await axios.put(
        `${API_HOST}/api/user-control/users/${selectedUser.id}/`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.data) {
        // Update the users list with the updated user data
        setUsers(users.map(u => u.id === selectedUser.id ? response.data : u));
        setOpenEditDialog(false);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to update users. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error updating user',
        severity: 'error'
      });
    }
  };

  // Add handleDeleteConfirm function (This is no longer used for single user delete, can be removed or kept if used elsewhere)
  const handleDeleteConfirm = async () => {
    // This function was likely for the old native confirm dialog. It's not needed for the new custom dialog.
    // You can remove this function if it's not used elsewhere for single deletes.
    // For now, I'll keep it but its calls have been replaced.
    console.log("handleDeleteConfirm called - this should not happen for single user delete with custom dialog");
  };

  // Add handleAddCompany function
  const handleAddCompany = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/company-control/companies/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyFormData)
      });

      if (response.ok) {
        const newCompany = await response.json();
        setCompanies([...companies, newCompany]);
        setOpenAddCompanyDialog(false);
        setSnackbar({
          open: true,
          message: 'Company added successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.detail || 'Failed to add company',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error adding company:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while adding the company',
        severity: 'error'
      });
    }
  };

  // Add handleEditCompany function
  const handleEditCompany = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/company-control/companies/${selectedCompany.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: companyFormData.name,
          quick_description: companyFormData.description,
          industry: companyFormData.industry,
          city: companyFormData.city,
          state: companyFormData.state,
          country: companyFormData.country,
          company_status: companyFormData.status,
          // logo, slide_image, etc. can be added if needed
        })
      });

      if (response.ok) {
        setCompanies(companies.map(c => c.id === selectedCompany.id ? { ...c, ...companyFormData } : c));
        setOpenEditCompanyDialog(false);
        setSnackbar({
          open: true,
          message: 'Company updated successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.detail || 'Failed to update company',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating company:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the company',
        severity: 'error'
      });
    }
  };

  // Add handleDeleteCompany function (modified to open dialog)
  const handleDeleteCompany = async (companyId) => {
    setCompanyToDeleteId(companyId);
    setOpenSingleCompanyDeleteConfirm(true);
  };

  // New function to handle confirmed single company deletion
  const handleConfirmSingleCompanyDelete = async () => {
    if (!companyToDeleteId) return; // Should not happen if dialog is opened correctly

    try {
      const response = await fetch(`${API_HOST}/api/company-control/companies/${companyToDeleteId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCompanies(companies.filter(c => c.id !== companyToDeleteId));
        setSnackbar({
          open: true,
          message: 'Company deleted successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.detail || errorData.message || 'Failed to delete company',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while deleting the company',
        severity: 'error'
      });
    } finally {
      setOpenSingleCompanyDeleteConfirm(false); // Always close the dialog
      setCompanyToDeleteId(null); // Clear the company ID
      fetchCompanies(); // Refresh the companies list
    }
  };

  // Add handleAddUser function
  const handleAddUser = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'Only admin users can create new users',
          severity: 'error'
        });
        return;
      }

      // Prepare the data for new user
      const newUserData = {
        first_name: addUserForm.first_name,
        last_name: addUserForm.last_name,
        email: addUserForm.email,
        password: addUserForm.password,
        user_type: addUserForm.user_type,
        title: addUserForm.title || '',
        company: addUserForm.company || '',
        website: addUserForm.website || '',
        city: addUserForm.city || '',
        state: addUserForm.state || '',
        bio: addUserForm.bio || '',
        phone: addUserForm.phone || '',
        position: addUserForm.position || '',
        address: addUserForm.address || '',
        is_staff: addUserForm.is_staff === 'yes' || addUserForm.is_staff === true,
        email_verified: true
      };

      // Log the request details for debugging
      console.log('Creating new user');
      console.log('User data:', newUserData);
      console.log('Current user type:', currentUser.user_type);
      console.log('Current user:', currentUser);

      const response = await axios.post(
        `${API_HOST}/api/user-control/users/`,
        newUserData,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Create response:', response.data);

      if (response.data) {
        // Add the new user to the list
        setUsers([...users, response.data.user]);
        setOpenAddUserDialog(false);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Add user error:', error);
      console.error('Add user error details:', error.response?.data);
      console.error('Add user error status:', error.response?.status);
      console.error('Current user:', authService.getCurrentUser());

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to create users. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error creating user',
        severity: 'error'
      });
    }
  };

  // Add handleCreateEvent function
  const handleCreateEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const formData = new FormData();
      Object.keys(eventForm).forEach(key => {
        if (key === 'coverImage' && eventForm[key]) {
          formData.append('cover_image', eventForm[key]);
        } else if (key === 'categories') {
          formData.append('categories', JSON.stringify(eventForm[key]));
        } else if (key === 'locationLink') {
          formData.append('location_link', eventForm[key]);
        } else if (key === 'startAt') {
          formData.append('start_at', eventForm[key]);
        } else if (key === 'endAt') {
          formData.append('end_at', eventForm[key]);
        } else if (key === 'registrationEnd') {
          formData.append('registration_end', eventForm[key]);
        } else if (key === 'publish') {
          formData.append('privacy', eventForm[key] ? 'publish' : 'hidden');
        } else {
          formData.append(key, eventForm[key]);
        }
      });

      const response = await fetch(`${API_HOST}/api/events/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const newEvent = await response.json();
        setCompanyEvents([...companyEvents, newEvent]);
        setOpenCreateEventDialog(false);
        setEventForm({
          title: '',
          description: '',
          coverImage: null,
          location: '',
          locationLink: '',
          categories: [],
          registration_form: '',
          publish: true,
          startAt: '',
          endAt: '',
          registrationEnd: ''
        });
        setSnackbar({
          open: true,
          message: 'Event created successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        const detail = typeof errorData.detail === 'string'
          ? errorData.detail
          : errorData.detail
            ? Object.entries(errorData.detail)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ')
            : '';
        setSnackbar({
          open: true,
          message: detail || errorData.error || 'Failed to create event',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while creating the event',
        severity: 'error'
      });
    }
  };

  // Add handleEditEvent function
  const handleEditEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const formData = new FormData();
      Object.keys(eventForm).forEach(key => {
        if (key === 'coverImage' && eventForm[key]) {
          formData.append('cover_image', eventForm[key]);
        } else if (key === 'categories') {
          formData.append('categories', JSON.stringify(eventForm[key]));
        } else if (key === 'locationLink') {
          formData.append('location_link', eventForm[key]);
        } else if (key === 'startAt') {
          formData.append('start_at', eventForm[key]);
        } else if (key === 'endAt') {
          formData.append('end_at', eventForm[key]);
        } else if (key === 'registrationEnd') {
          formData.append('registration_end', eventForm[key]);
        } else if (key === 'publish') {
          formData.append('privacy', eventForm[key] ? 'publish' : 'hidden');
        } else {
          formData.append(key, eventForm[key]);
        }
      });

      const response = await fetch(`${API_HOST}/api/events/${selectedEvent.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setCompanyEvents(companyEvents.map(e => e.id === selectedEvent.id ? updatedEvent : e));
        setOpenEditEventDialog(false);
        setSnackbar({
          open: true,
          message: 'Event updated successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.error || 'Failed to update event',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the event',
        severity: 'error'
      });
    }
  };

  // Add new state for selected companies
  // const [selectedCompanies, setSelectedCompanies] = useState([]); // REMOVE THIS DUPLICATE DECLARATION

  // Add handler for selecting all companies
  const handleSelectAllCompanies = (event) => {
    const filteredCompanies = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(companySearch.toLowerCase()));
      const matchesIndustry = !companyIndustryFilter || company.industry === companyIndustryFilter;
      return matchesSearch && matchesIndustry;
    });

    if (event.target.checked) {
      setSelectedCompanies(filteredCompanies.map(company => company.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  // Add handler for selecting individual company
  const handleSelectCompany = (companyId) => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
  };

  // Update handleViewCompany to use the dialog
  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setOpenViewCompanyDialog(true);
  };

  const handleCloseViewCompanyDialog = () => {
    setOpenViewCompanyDialog(false);
    setSelectedCompany(null);
  };

  // Add new state for selected events
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [openEventBatchDeleteConfirm, setOpenEventBatchDeleteConfirm] = useState(false); // New state for event batch delete confirmation
  const [openSingleEventDeleteConfirm, setOpenSingleEventDeleteConfirm] = useState(false); // New state for single event delete confirmation
  const [eventToDeleteId, setEventToDeleteId] = useState(null); // State to store the ID of the event to be deleted

  // Handler for selecting all events
  const handleSelectAllEvents = (event) => {
    const filteredEvents = companyEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(eventSearch.toLowerCase()));
      const matchesCategory = !eventCategory || (event.categories && event.categories.includes(eventCategory));
      return matchesSearch && matchesCategory;
    });
    if (event.target.checked) {
      setSelectedEvents(filteredEvents.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  // Handler for selecting individual event
  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  // Bulk delete handler for events
  const handleBulkDeleteEvents = async () => {
    // Open the custom confirmation dialog instead of window.confirm
    if (selectedEvents.length > 0) {
      setOpenEventBatchDeleteConfirm(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Please select events to delete',
        severity: 'warning'
      });
    }
  };

  // New function to handle confirmed event batch deletion
  const handleConfirmEventBatchDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Perform deletion for each selected event
      for (const id of selectedEvents) {
        const response = await fetch(`${API_HOST}/api/events/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error deleting event:', errorData);
          // Continue with other deletions but show an error for this one
          setSnackbar({
            open: true,
            message: `Failed to delete event with ID ${id}: ${errorData.error || 'Unknown error'}`,
            severity: 'error'
          });
        }
      }

      // After attempting all deletions, refresh the event list and clear selection
      fetchCompanyEvents();
      setSelectedEvents([]);
      setOpenEventBatchDeleteConfirm(false);

      // Show success message if at least one event was selected
      if (selectedEvents.length > 0) {
        setSnackbar({
          open: true,
          message: `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} deleted successfully`,
          severity: 'success'
        });
      }

    } catch (error) {
      console.error('Error during batch event deletion:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred during batch deletion',
        severity: 'error'
      });
    } finally {
      setOpenEventBatchDeleteConfirm(false); // Ensure dialog closes
      setSelectedEvents([]); // Clear selection
      fetchCompanyEvents(); // Always refresh list just in case
    }
  };

  // Add this state near the top with other state declarations
  const [settingsFormData, setSettingsFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
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
    dob: ''
  });

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add these state variables at the top with other state declarations
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Add this handler function with other handlers
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the handleSettingsUpdate function to handle file upload
  const handleSettingsUpdate = async () => {
    try {
      console.log('Update button clicked');
      const currentUser = authService.getCurrentUser();
      console.log('Current user:', currentUser);

      if (!currentUser?.access) {
        console.log('No access token found');
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Create a FormData object for file upload
      const formData = new FormData();

      // Add profile image if it exists
      if (profileImage) {
        formData.append('profile_pic', profileImage);
      }

      // Add other form fields
      const updateData = { ...settingsFormData };

      // Validate required fields
      if (!updateData.first_name?.trim()) {
        setSnackbar({
          open: true,
          message: 'First name is required',
          severity: 'error'
        });
        return;
      }

      if (!updateData.last_name?.trim()) {
        setSnackbar({
          open: true,
          message: 'Last name is required',
          severity: 'error'
        });
        return;
      }

      // Compare with current user data to only send changed fields
      const changedFields = {};

      // Always include first_name and last_name as they are required
      changedFields.first_name = updateData.first_name;
      changedFields.last_name = updateData.last_name;

      // Check other fields for changes
      const fieldsToCheck = [
        'phone', 'title', 'company', 'website', 'city',
        'state', 'bio', 'position', 'address', 'country', 'dob'
      ];

      fieldsToCheck.forEach(field => {
        if (field === 'website') {
          if (updateData.website) {
            if (!updateData.website.startsWith('http://') && !updateData.website.startsWith('https://')) {
              changedFields.website = `https://${updateData.website}`;
            } else {
              changedFields.website = updateData.website;
            }
          } else if (updateData.website === '') {
            changedFields.website = null;
          }
        } else {
          if (updateData[field] !== currentUser[field]) {
            changedFields[field] = updateData[field];
          }
        }
      });

      // Add all changed fields to FormData
      Object.keys(changedFields).forEach(key => {
        formData.append(key, changedFields[key]);
      });

      // Use the correct API endpoint
      const apiUrl = `${API_HOST}/api/settings/profile/`;

      console.log('Sending update data:', changedFields);
      console.log('API URL:', apiUrl);
      console.log('Auth token:', currentUser.access);

      const response = await axios.put(
        apiUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        // Reset profile image state
        setProfileImage(null);
        setProfileImagePreview(null);
        // Refresh user data
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response);

      let errorMessage = 'Failed to update profile';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.errors) {
          errorMessage = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const message = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${field}: ${message}`;
            })
            .join('\n');
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Add this useEffect to initialize form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      console.log('User Profile Data:', userProfile); // Debug log
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
  }, [userProfile]);

  // Add this handler function with other handlers
  const handleAddUserFormChange = (e) => {
    const { name, value } = e.target;
    setAddUserForm(prev => {
      const updated = { ...prev, [name]: value };
      // If the password field is being updated, check strength
      if (name === 'password') {
        checkPasswordStrength(value);
      }
      return updated;
    });
  };

  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async () => {
    try {
      // Clear previous messages
      setPasswordError('');
      setPasswordSuccess('');

      // Validate required fields
      if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
        setPasswordError('All fields are required');
        return;
      }

      // Validate password match
      if (passwordData.new_password !== passwordData.confirm_password) {
        setPasswordError('New password and confirm password do not match');
        return;
      }

      setLoading(true);
      const token = authService.getToken();
      if (!token) {
        setPasswordError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.post(CHANGE_PASSWORD_URL, {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear form and show success message
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setPasswordSuccess('Password changed successfully');

      // Show success snackbar
      setSnackbar({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.response?.data?.detail || 'Failed to change password');
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to change password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // New function to handle confirmed company batch deletion
  const handleConfirmCompanyBatchDelete = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin (companies can only be deleted by admin)
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete companies. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      if (selectedCompanies.length === 0) {
        setSnackbar({
          open: true,
          message: 'No companies selected for deletion',
          severity: 'warning'
        });
        return;
      }

      // Delete each selected company
      const deletePromises = selectedCompanies.map(companyId => {
        return axios.delete(
          `${API_HOST}/api/company-control/companies/${companyId}/`,
          {
            headers: {
              'Authorization': `Bearer ${currentUser.access}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      });

      await Promise.all(deletePromises);

      // Remove deleted companies from the list
      setCompanies(companies.filter(company => !selectedCompanies.includes(company.id)));
      setSelectedCompanies([]);
      setOpenCompanyBatchDeleteConfirm(false); // Close the dialog
      setSnackbar({
        open: true,
        message: `${selectedCompanies.length} compan${selectedCompanies.length > 1 ? 'ies' : 'y'} deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Batch company deletion error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete companies. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'An error occurred while deleting companies',
        severity: 'error'
      });
    } finally {
      // Always close the dialog
      setOpenCompanyBatchDeleteConfirm(false);
      // Refresh company list
      fetchCompanies();
    }
  };

  // New function to handle confirmed single event deletion
  const handleConfirmSingleEventDelete = async () => {
    if (!eventToDeleteId) return; // Should not happen if dialog is opened correctly

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const response = await fetch(`${API_HOST}/api/events/${eventToDeleteId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCompanyEvents(companyEvents.filter(e => e.id !== eventToDeleteId));
        setSnackbar({
          open: true,
          message: 'Event deleted successfully',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.error || 'Failed to delete event',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while deleting the event',
        severity: 'error'
      });
    } finally {
      setOpenSingleEventDeleteConfirm(false); // Always close the dialog
      setEventToDeleteId(null); // Clear the event ID
      fetchCompanyEvents(); // Refresh the events list
    }
  };

  const [communityPosts, setCommunityPosts] = useState([]);
  const [postSearch, setPostSearch] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('');
  const [postVisibilityFilter, setPostVisibilityFilter] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postError, setPostError] = useState(null);
  const [viewPost, setViewPost] = useState(null);

  // Add this with other useEffect hooks
  useEffect(() => {
    if (value === 5) { // Community tab
      fetchCommunityPosts();
    }
  }, [value]);

  const fetchCommunityPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await communityService.getPosts();
      setCommunityPosts(response);
      setPostError(null);
    } catch (error) {
      setPostError('Failed to fetch community posts');
      console.error('Error fetching community posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // State for single community post deletion confirmation
  const [openSinglePostDeleteConfirm, setOpenSinglePostDeleteConfirm] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);

  // New function to handle single community post delete click
  const handleDeletePostClick = (postId) => {
    setPostToDeleteId(postId);
    setOpenSinglePostDeleteConfirm(true);
  };

  // New function to handle the confirmed single community post deletion
  const handleConfirmSinglePostDelete = async () => {
    if (!postToDeleteId) return; // Should not happen if dialog is opened correctly

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.access) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      // Check if current user is admin
      if (!authService.isAdmin(currentUser)) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete posts. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      // TODO: Replace with actual community post deletion API endpoint
      const response = await axios.delete(
        `${API_HOST}/api/community/posts/${postToDeleteId}/`, // Assuming this endpoint
        {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Delete post response:', response.data);

      // Remove the deleted post from the list
      setCommunityPosts(communityPosts.filter(post => post.id !== postToDeleteId));
      setSnackbar({
        open: true,
        message: 'Community post deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting community post:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: 'Authentication failed. Please log in again.',
          severity: 'error'
        });
        return;
      }

      // Handle permission errors
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'You do not have permission to delete posts. Only admin users can perform this action.',
          severity: 'error'
        });
        return;
      }

      // Handle not found errors
      if (error.response?.status === 404) {
        setSnackbar({
          open: true,
          message: 'Community post not found',
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'An error occurred while deleting the community post',
        severity: 'error'
      });
    } finally {
      setOpenSinglePostDeleteConfirm(false); // Always close the dialog
      setPostToDeleteId(null); // Clear the post ID
      fetchCommunityPosts(); // Refresh the post list
    }
  };

  return (
    <Box sx={{ background: '#f8fafd', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'flex-end', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/*<IconButton color="inherit" onClick={handleLangMenuOpen}>
              <LanguageIcon />
            </IconButton>
            <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={handleLangMenuClose}>
              <MenuItem selected={language === 'en'} onClick={() => handleLanguageChange('en')}>English</MenuItem>
              <MenuItem selected={language === 'bn'} onClick={() => handleLanguageChange('bn')}>Bangla</MenuItem>
            </Menu>
            
            <IconButton color="inherit" onClick={handleToggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>*/}

            <IconButton color="inherit" onClick={handleOpenAdminNotifications} aria-label="Open notifications">
              <Badge badgeContent={adminUnreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={() => setNotificationsAnchorEl(null)}
              PaperProps={{ sx: { width: 360, maxHeight: 420 } }}
            >
              {adminNotificationError ? (
                <MenuItem disabled>{adminNotificationError}</MenuItem>
              ) : adminNotifications.length === 0 ? (
                <MenuItem disabled>No notifications yet.</MenuItem>
              ) : adminNotifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => {
                    const tabByCategory = {
                      dashboard: 0,
                      user: 1,
                      users: 1,
                      company: 2,
                      companies: 2,
                      kyc: 3,
                      event: 4,
                      events: 4,
                      community: 5,
                      chat: 6,
                      email: 7,
                      settings: 8,
                    };
                    const routeTabByCategory = {
                      user: 'users',
                      users: 'users',
                      company: 'companies',
                      companies: 'companies',
                      kyc: 'kyc',
                    };
                    const targetTab = tabByCategory[notification.category];
                    const routeTab = routeTabByCategory[notification.category];
                    if (targetTab !== undefined) {
                      setValue(targetTab);
                      localStorage.setItem('adminDashboardTab', targetTab.toString());
                    }
                    navigate(
                      notification.target_url
                      || (routeTab ? `/admin-dashboard?tab=${routeTab}` : '/admin-dashboard')
                    );
                    setNotificationsAnchorEl(null);
                  }}
                  sx={{ alignItems: 'flex-start', whiteSpace: 'normal', py: 1.25, bgcolor: notification.read ? 'transparent' : '#eef6ff' }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: notification.read ? 500 : 700 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            <Avatar
              src={profileImageUrl || "https://placehold.co/40x40"}
              alt="Profile"
              sx={{ width: 40, height: 40, ml: 1, border: '2px solid #6c63ff' }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'Innovest'} {userProfile?.last_name || 'Admin'}</Typography>
              <Typography variant="caption" color="text.secondary">{userProfile?.title || 'Title'}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
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
                  icon={<BarChartIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Dashboard"
                />
                <Tab
                  icon={<PeopleIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Users"
                />
                <Tab
                  icon={<BusinessIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Companies"
                />
                <Tab
                  icon={<ShieldIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="KYC"
                />
                <Tab
                  icon={<EventIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Events"
                />
                <Tab
                  icon={<GroupsIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Community"
                />
                <Tab
                  icon={<ChatIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Chat"
                />
                <Tab
                  icon={<EmailIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Email"
                />
                <Tab
                  icon={<SettingsIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Settings"
                />
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
                          {/*
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                            onClick={() => setOpenAddTask(true)}
                          >
                            Add Task
                          </Button>
                          */}
                        </Grid>
                      </Grid>
                    </Container>
                    {/* Summary Cards Row */}
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {analyticsData.totalUsers.toLocaleString()}
                            </Typography>

                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">Total Companies</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              {analyticsData.totalCompanies?.toLocaleString() || '0'}
                            </Typography>

                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">Events</Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
                                    {analyticsData.totalEvents?.toLocaleString() || '0'}
                                  </Typography>

                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">Posts</Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
                                    {analyticsData.totalPosts?.toLocaleString() || '0'}
                                  </Typography>

                                </Box>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: '#fff', border: '1px solid #f0f1f3' }}>
                            <Typography variant="subtitle2" color="text.secondary">Total Transactions</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                              ৳{analyticsData.totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                              {(activityLog && activityLog.length === 0) ? (
                                <Typography color="text.secondary">No recent activity.</Typography>
                              ) : (
                                (activityLog || []).map((activity, idx) => (
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
                                          : activity.type === 'company-status'
                                            ? `You ${activity.action} ${activity.company} company`
                                            : activity.type === 'post'
                                              ? `You posted an idea: "${activity.title || 'No title'}"`
                                              : ''}
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
                    {/* 
                    <Container maxWidth={false} disableGutters sx={{ mb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
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
                                <TextField size="small" value={editTaskText} onChange={e => setEditTaskText(e.target.value)} onBlur={handleSaveEditTask} onKeyDown={e => { if (e.key === 'Enter') handleSaveEditTask(); }} autoFocus sx={{ mr: 2 }} />
                              ) : (
                                <Typography sx={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 1 }}>{todo.text}</Typography>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Container>
                    */}
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

                {/* Users Tab */}
                {value === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                      <Typography variant="h6">
                        Users Management
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <IconButton onClick={fetchUsers} title="Refresh">
                          <RefreshIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                          {(() => {
                            const filteredUsers = users.filter(user => {
                              const matchesSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                                (user.email && user.email.toLowerCase().includes(userSearch.toLowerCase()));
                              const matchesType = !userTypeFilter || user.user_type === userTypeFilter;
                              return matchesSearch && matchesType;
                            });
                            return `${filteredUsers.length} users`;
                          })()}
                        </Typography>
                        {selectedUsers.length > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleBatchOperation('delete')} // Call handleBatchOperation to open dialog
                            startIcon={<DeleteIcon />}
                          >
                            Delete Selected ({selectedUsers.length})
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2,
                            //px: 3
                          }}
                          onClick={() => setOpenAddUserDialog(true)}
                        >
                          + Add User
                        </Button>
                      </Box>
                    </Box>
                    {/* Search and User Type Filter UI */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Search by name or email..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        sx={{
                          width: 320,
                          background: '#f7f9fb',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                        InputProps={{
                          sx: { background: '#f7f9fb', borderRadius: 2 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                          value={userTypeFilter}
                          displayEmpty
                          onChange={e => setUserTypeFilter(e.target.value)}
                          sx={{ borderRadius: 2, background: '#fff' }}
                        >
                          <MenuItem value="">Select User Type</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="user">User</MenuItem>
                          {/*<MenuItem value="company">Company</MenuItem>*/}
                        </Select>
                      </FormControl>
                    </Box>
                    {/* Filtered Users Table */}
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">
                              <Checkbox
                                indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                                checked={users.length > 0 && selectedUsers.length === users.length}
                                onChange={handleSelectAllUsers}
                              />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <CircularProgress />
                              </TableCell>
                            </TableRow>
                          ) : (() => {
                            // Filter users by search and user type
                            const filteredUsers = users.filter(user => {
                              const matchesSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                                (user.email && user.email.toLowerCase().includes(userSearch.toLowerCase()));
                              const matchesType = !userTypeFilter || user.user_type === userTypeFilter;
                              return matchesSearch && matchesType;
                            });
                            if (filteredUsers.length === 0) {
                              return (
                                <TableRow>
                                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No users found
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            return filteredUsers.map(user => (
                              <TableRow key={user.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {(() => {
                                      console.log('User profile data:', {
                                        id: user.id,
                                        email: user.email,
                                        hasProfilePic: !!(user.profile_picture || user.profile_pic),
                                        profile_picture: user.profile_picture,
                                        profile_pic: user.profile_pic,
                                        allKeys: Object.keys(user)
                                      });

                                      const profilePic = user.profile_picture || user.profile_pic;
                                      const fullUrl = profilePic ?
                                        (profilePic.startsWith('http') ? profilePic :
                                          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profilePic}`) :
                                        null;

                                      return fullUrl ? (
                                        <Avatar
                                          src={fullUrl}
                                          alt={`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                                          sx={{ mr: 2, width: 40, height: 40 }}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = null; // This will make it fall through to the default avatar
                                          }}
                                        />
                                      ) : (
                                        <Avatar
                                          sx={{
                                            mr: 2,
                                            width: 40,
                                            height: 40,
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                          }}
                                        >
                                          {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                                        </Avatar>
                                      );
                                    })()}
                                    <Box>
                                      <Typography variant="subtitle2">
                                        {user.first_name} {user.last_name}
                                      </Typography>
                                      {user.user_type && (
                                        <Typography variant="body2" color="text.secondary">
                                          {user.user_type}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box>
                                    <Typography variant="subtitle2">
                                      {user.email}
                                    </Typography>
                                    {console.log('User data in render:', user)}
                                    {user.phone && (
                                      <Typography variant="body2" color="text.secondary">
                                        {user.phone}
                                      </Typography>
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>{`${user.address}, ${user.city}, ${user.country}`}</TableCell>
                                <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                  <Tooltip title="View">
                                    <IconButton onClick={() => handleViewUser(user)} color="primary">
                                      <VisibilityIcon />
                                    </IconButton>
                                  </Tooltip>
                                  {/*<Tooltip title="Edit">
                                    <IconButton
                                      color="primary"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setEditFormData(user);
                                        setOpenEditDialog(true);
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>*/}
                                  <Tooltip title="Delete">
                                    <IconButton onClick={() => handleDeleteUser(user)} color="error">
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ));
                          })()}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      component="div"
                      count={totalUsers}
                      page={page}
                      onPageChange={handlePageChange}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                  </Box>
                )}
                {/* Companies Tab */}
                {value === 2 && (
                  <Box>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        Companies Management
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <IconButton onClick={fetchCompanies} title="Refresh">
                          <RefreshIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                          {(() => {
                            const filteredCompanies = companies.filter(company => {
                              const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
                                (company.description && company.description.toLowerCase().includes(companySearch.toLowerCase()));
                              const matchesIndustry = !companyIndustryFilter || company.industry === companyIndustryFilter;
                              return matchesSearch && matchesIndustry;
                            });
                            return `${filteredCompanies.length} companies`;
                          })()}
                        </Typography>
                        {selectedCompanies.length > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setOpenCompanyBatchDeleteConfirm(true)} // Open company batch delete dialog
                            startIcon={<DeleteIcon />}
                          >
                            Delete Selected ({selectedCompanies.length})
                          </Button>
                        )}
                        {/*<Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => setOpenAddCompanyDialog(true)}
                        >
                          + Add Company
                        </Button>*/}
                      </Box>
                    </Box>
                    {/* Search and Industry Filter UI */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Search by company name ..."
                        value={companySearch}
                        onChange={e => setCompanySearch(e.target.value)}
                        sx={{
                          width: 320,
                          background: '#f7f9fb',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, pl: 1 }
                        }}
                        InputProps={{
                          sx: { background: '#f7f9fb', borderRadius: 2 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    {/* Filtered Companies Table */}
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedCompanies.length === companies.length && companies.length > 0}
                                indeterminate={selectedCompanies.length > 0 && selectedCompanies.length < companies.length}
                                onChange={handleSelectAllCompanies}
                              />
                            </TableCell>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Industry</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                <CircularProgress />
                              </TableCell>
                            </TableRow>
                          ) : (() => {
                            // Filter companies by search and industry
                            const filteredCompanies = companies.filter(company => {
                              const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
                                (company.description && company.description.toLowerCase().includes(companySearch.toLowerCase()));
                              const matchesIndustry = !companyIndustryFilter || company.industry === companyIndustryFilter;
                              return matchesSearch && matchesIndustry;
                            });

                            if (filteredCompanies.length === 0) {
                              return (
                                <TableRow>
                                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    No companies found
                                  </TableCell>
                                </TableRow>
                              );
                            }

                            return filteredCompanies.map(company => (
                              <TableRow key={company.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedCompanies.includes(company.id)}
                                    onChange={() => handleSelectCompany(company.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {company.logo && (
                                      <Avatar
                                        src={company.logo || `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/company_covers/default_company_cover.jpg`}
                                        alt={company.name}
                                        sx={{ mr: 2, width: 40, height: 40 }}
                                      />
                                    )}
                                    <Box>
                                      <Typography variant="subtitle2">
                                        {company.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {company.description?.substring(0, 50)}
                                        {company.description?.length > 50 ? '...' : ''}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>{company.industry}</TableCell>
                                <TableCell>{company.location}</TableCell>
                                <TableCell>
                                  <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                      value={company.status}
                                      onChange={(e) => handleCompanyStatusChange(company.id, e.target.value)}
                                      size="small"
                                      sx={{
                                        '& .MuiSelect-select': {
                                          py: 0.5,
                                          px: 1,
                                          borderRadius: 1,
                                          backgroundColor:
                                            company.status === 'Approved' ? '#e8f5e9' :
                                              company.status === 'Pending' ? '#fff3e0' :
                                                '#ffebee',
                                          color:
                                            company.status === 'Approved' ? '#2e7d32' :
                                              company.status === 'Pending' ? '#f57c00' :
                                                '#c62828',
                                          fontWeight: 500
                                        }
                                      }}
                                    >
                                      <MenuItem value="Approved">Approved</MenuItem>
                                      <MenuItem value="Pending">Pending</MenuItem>
                                      <MenuItem value="Rejected">Rejected</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  {format(new Date(company.created_at), 'PP')}
                                </TableCell>
                                <TableCell>
                                  {companyView === 'pending' ? (
                                    <>
                                      <Tooltip title="View">
                                        <IconButton
                                          color="primary"
                                          onClick={() => {
                                            handleViewCompany(company);
                                          }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Approve">
                                        <IconButton
                                          color="success"
                                          onClick={() => handleCompanyStatusChange(company.id, 'Approved')}
                                        >
                                          <CheckIcon />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Reject">
                                        <IconButton
                                          color="error"
                                          onClick={() => handleCompanyStatusChange(company.id, 'Rejected')}
                                        >
                                          <CloseIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    <>
                                      {/*<Tooltip title="View">
                                        <IconButton
                                          color="primary"
                                          onClick={() => {
                                            handleViewCompany(company);
                                          }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                      </Tooltip>*/}
                                      <Tooltip title="View">
                                        <IconButton
                                          color="primary"
                                          onClick={() => {
                                            handleViewCompany(company);
                                          }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                      </Tooltip>
                                      {/*<Tooltip title="Edit">
                                        <IconButton
                                          color="primary"
                                          onClick={() => {
                                            setSelectedCompany(company);
                                            setCompanyFormData({
                                              id: company.id,
                                              name: company.name,
                                              industry: company.industry,
                                              city: company.city,
                                              state: company.state,
                                              country: company.country,
                                              status: company.status,
                                              description: company.description,
                                              logo: company.logo,
                                              website: company.website,
                                              phone: company.phone
                                            });
                                            setOpenEditCompanyDialog(true);
                                          }}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                      </Tooltip>*/}
                                      <Tooltip title="Delete">
                                        <IconButton
                                          color="error"
                                          onClick={() => handleDeleteCompany(company.id)} // Call handleDeleteCompany which now opens the dialog
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ));
                          })()}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                {/* Events Tab */}
                {value === 4 && (
                  <Box>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        Events Management
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <IconButton onClick={fetchCompanyEvents} title="Refresh">
                          <RefreshIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                          {(() => {
                            const filteredEvents = companyEvents.filter(event => {
                              const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                (event.description && event.description.toLowerCase().includes(eventSearch.toLowerCase()));
                              const matchesCategory = !eventCategory || (event.categories && event.categories.includes(eventCategory));
                              return matchesSearch && matchesCategory;
                            });
                            return `${filteredEvents.length} events`;
                          })()}
                        </Typography>
                        {selectedEvents.length > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleBulkDeleteEvents} // Call handleBulkDeleteEvents which now opens the dialog
                            startIcon={<DeleteIcon />}
                          >
                            Delete Selected ({selectedEvents.length})
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            // Reset the form data before opening the dialog
                            setEventForm({
                              title: '',
                              description: '',
                              coverImage: null,
                              location: '',
                              locationLink: '',
                              categories: [],
                              registration_form: '',
                              publish: true,
                              startAt: '',
                              endAt: '',
                              registrationEnd: ''
                            });
                            setOpenCreateEventDialog(true);
                          }}
                        >
                          + Create Event
                        </Button>
                      </Box>
                    </Box>
                    {/* Search and Category Filter UI */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Search by event name..."
                        value={eventSearch}
                        onChange={e => setEventSearch(e.target.value)}
                        sx={{
                          width: 320,
                          background: '#f7f9fb',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, pl: 1 }
                        }}
                        InputProps={{
                          sx: { background: '#f7f9fb', borderRadius: 2 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                          value={eventCategory}
                          displayEmpty
                          onChange={e => setEventCategory(e.target.value)}
                          sx={{ borderRadius: 2, background: '#fff' }}
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          {eventCategories.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    {/* Filtered Events Table */}
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedEvents.length === companyEvents.filter(event => {
                                  const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                    (event.description && event.description.toLowerCase().includes(eventSearch.toLowerCase()));
                                  const matchesCategory = !eventCategory || (event.categories && event.categories.includes(eventCategory));
                                  return matchesSearch && matchesCategory;
                                }).length && companyEvents.length > 0}
                                indeterminate={selectedEvents.length > 0 && selectedEvents.length < companyEvents.filter(event => {
                                  const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                    (event.description && event.description.toLowerCase().includes(eventSearch.toLowerCase()));
                                  const matchesCategory = !eventCategory || (event.categories && event.categories.includes(eventCategory));
                                  return matchesSearch && matchesCategory;
                                }).length}
                                onChange={handleSelectAllEvents}
                              />
                            </TableCell>
                            <TableCell>Event Title</TableCell>
                            <TableCell sx={{ width: 120, maxWidth: 120 }}>Event Type</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Timeline</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loadingEvents ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                <CircularProgress />
                              </TableCell>
                            </TableRow>
                          ) : (() => {
                            const filteredEvents = companyEvents.filter(event => {
                              const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                                (event.description && event.description.toLowerCase().includes(eventSearch.toLowerCase()));
                              const matchesCategory = !eventCategory || (event.categories && event.categories.includes(eventCategory));
                              return matchesSearch && matchesCategory;
                            });
                            if (filteredEvents.length === 0) {
                              return (
                                <TableRow>
                                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    No events found
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            return filteredEvents.map(event => (
                              <TableRow key={event.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedEvents.includes(event.id)}
                                    onChange={() => handleSelectEvent(event.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                      src={event.cover_image
                                        ? (event.cover_image.startsWith('http')
                                          ? event.cover_image
                                          : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${event.cover_image}`)
                                        : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/event_images/default_event_cover.jpg`}
                                      alt={event.title}
                                      sx={{ width: 40, height: 40 }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/event_images/default_event_cover.jpg`;
                                      }}
                                    />
                                    <Box>
                                      <Typography variant="subtitle2">{event.title}</Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {event.description?.substring(0, 50)}{event.description?.length > 50 ? '...' : ''}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ width: 120, maxWidth: 120 }}>
                                  <Typography noWrap title={event.categories || ''}>
                                    {event.categories || 'N/A'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box>
                                    <Typography>{event.location}</Typography>
                                    {event.location_link && (
                                      <a
                                        href={event.location_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 12, color: '#1976d2', textDecoration: 'underline' }}
                                      >
                                        View on Map
                                      </a>
                                    )}
                                  </Box>
                                </TableCell>

                                <TableCell>
                                  <Chip
                                    label={event.privacy === 'publish' ? 'Published' : 'Hidden'}
                                    color={event.privacy === 'publish' ? 'success' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography component="span" color="text.secondary" sx={{ minWidth: 100 }}>
                                        Start:
                                      </Typography>
                                      {format(new Date(event.start_at), 'PPp')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography component="span" color="text.secondary" sx={{ minWidth: 100 }}>
                                        End:
                                      </Typography>
                                      {format(new Date(event.end_at), 'PPp')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography component="span" color="text.secondary" sx={{ minWidth: 100 }}>
                                        Reg End:
                                      </Typography>
                                      {event.registration_end ? format(new Date(event.registration_end), 'PPp') : 'N/A'}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="View Details">
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                          setSelectedEvent(event);
                                          setOpenViewEventDialog(true);
                                        }}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Event">
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEditClick(event)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={event.privacy === 'publish' ? 'Hide from users' : 'Show to users'}>
                                      <IconButton
                                        color={event.privacy === 'publish' ? 'default' : 'success'}
                                        size="small"
                                        onClick={() => handleEventStatusChange(
                                          event.id,
                                          event.privacy === 'publish' ? 'hidden' : 'publish'
                                        )}
                                      >
                                        {event.privacy === 'publish' ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Event">
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteEvent(event.id)} // Call handleDeleteEvent which now opens the dialog
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ));
                          })()}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                {/* Community Tab (now value === 5) */}
                {value === 5 && (
                  <Box>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">Community</Typography>

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <IconButton onClick={() => fetchCommunityPosts()} title="Refresh">
                          <RefreshIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                          {(() => {
                            const filteredPosts = communityPosts.filter(post => {
                              const matchesSearch = post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
                                post.tags.toLowerCase().includes(postSearch.toLowerCase());
                              const matchesType = !postTypeFilter || post.type === postTypeFilter;
                              const matchesVisibility = !postVisibilityFilter || post.visibility === postVisibilityFilter;
                              return matchesSearch && matchesType && matchesVisibility;
                            });
                            return `${filteredPosts.length} posts`;
                          })()}
                        </Typography>
                        {selectedPosts.length > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setOpenDeletePostsDialog(true)}
                            startIcon={<DeleteIcon />}
                          >
                            Delete Selected ({selectedPosts.length})
                          </Button>
                        )}
                        {/*<Button
                        variant="contained"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                        onClick={() => setOpenAddIdeaDialog(true)}
                      >
                          + Share Post
                      </Button>*/}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Search by title or tags..."
                        value={postSearch}
                        onChange={e => setPostSearch(e.target.value)}
                        sx={{
                          width: 320,
                          background: '#f7f9fb',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 16, pl: 1 },
                        }}
                        InputProps={{
                          sx: { background: '#f7f9fb', borderRadius: 2 },
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                          value={postTypeFilter}
                          displayEmpty
                          onChange={e => setPostTypeFilter(e.target.value)}
                          sx={{ borderRadius: 2, background: '#fff' }}
                        >
                          <MenuItem value="">All Types</MenuItem>
                          <MenuItem value="Discussion">💬 Discussion</MenuItem>
                          <MenuItem value="Project Update">📢 Project Update</MenuItem>
                          <MenuItem value="Question">❓ Question</MenuItem>
                          <MenuItem value="Idea">🧠 Idea</MenuItem>
                          <MenuItem value="Other">🗂️ Other</MenuItem>
                          <MenuItem value="Event"><EventIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />Event</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                          value={postVisibilityFilter}
                          displayEmpty
                          onChange={e => setPostVisibilityFilter(e.target.value)}
                          sx={{ borderRadius: 2, background: '#fff' }}
                        >
                          <MenuItem value="">All Visibility</MenuItem>
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    {loadingPosts ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : postError ? (
                      <Alert severity="error" sx={{ mx: { xs: 1, sm: 3, md: 6 } }}>{postError}</Alert>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  indeterminate={selectedPosts.length > 0 && selectedPosts.length < communityPosts.length}
                                  checked={communityPosts.length > 0 && selectedPosts.length === communityPosts.length}
                                  onChange={e => {
                                    if (e.target.checked) setSelectedPosts(communityPosts.map(post => post.id));
                                    else setSelectedPosts([]);
                                  }}
                                />
                              </TableCell>
                              <TableCell>Author</TableCell>
                              <TableCell>Title</TableCell>
                              <TableCell>Post Type</TableCell>
                              <TableCell>Visibility</TableCell>
                              <TableCell>Post At</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {communityPosts
                              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                              .filter(post => {
                                const matchesSearch = post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
                                  post.tags.toLowerCase().includes(postSearch.toLowerCase());
                                const matchesType = !postTypeFilter || post.type === postTypeFilter;
                                const matchesVisibility = !postVisibilityFilter || post.visibility === postVisibilityFilter;
                                return matchesSearch && matchesType && matchesVisibility;
                              }).map(post => (
                                <TableRow key={post.id}>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedPosts.includes(post.id)}
                                      onChange={() => {
                                        setSelectedPosts(prev =>
                                          prev.includes(post.id)
                                            ? prev.filter(id => id !== post.id)
                                            : [...prev, post.id]
                                        );
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {post.user ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {(console.log('User Object:', post.user), null)}
                                        <Avatar
                                          src={post.user?.profile_picture ||
                                            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/profile_pics/default_profile.png`}
                                          alt={`${post.user.first_name} ${post.user.last_name}`}
                                          sx={{ width: 40, height: 40 }}
                                          onError={(e) => {
                                            console.error('Error loading profile image:', e.target.src);
                                            e.target.onerror = null;
                                            e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/profile_pics/default_profile.png`;
                                          }}
                                        />
                                        <Typography variant="subtitle2">
                                          {post.user.first_name} {post.user.last_name}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Unknown User
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>{post.title}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={post.type}
                                      size="small"
                                      color={
                                        post.type === 'event' ? 'primary' :
                                          post.type === 'discussion' ? 'secondary' :
                                            'default'
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={post.visibility}
                                      size="small"
                                      color={post.visibility === 'public' ? 'success' : 'warning'}
                                    />
                                  </TableCell>
                                  <TableCell>{format(new Date(post.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                                  <TableCell>
                                    <Tooltip title="View">
                                      <IconButton color="primary" onClick={() => setViewPost(post)}>
                                        <VisibilityIcon />
                                      </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip title="Edit">
                                  <IconButton color="primary">
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip> */}
                                    <Tooltip title="Delete">
                                      <IconButton color="error" onClick={() => handleDeletePostClick(post.id)}>
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                )}
                {/* Chat Tab (now value === 6) */}
                {value === 6 && (
                  <Box>
                  </Box>
                )}
                {value === 7 && (
                  <Box>
                    {/* Render Company Contacts */}
                    {renderCompanyContacts()}
                  </Box>
                )}
                {/* Settings Tab */}
                {value === 8 && (
                  <Box sx={{ background: '#fff', borderRadius: 3, p: 0, minHeight: 500 }}>
                    {/* Modern Profile Cover + Avatar */}
                    {/*<Box sx={{ position: 'relative', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                
                <Box sx={{ position: 'absolute', left: '50%', bottom: 4, transform: 'translateX(-50%)', zIndex: 2, textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar src={userProfile?.profile_pic ? `/images/profile_pic/${userProfile.profile_pic}` : 'https://randomuser.me/api/portraits/men/32.jpg'} sx={{ width: 112, height: 112, border: '4px solid #fff', boxShadow: 2, bgcolor: '#fff', objectFit: 'cover' }} />
                    <IconButton sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: '#fff', boxShadow: 1 }} size="small">
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'center', mt: 2, mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{userProfile?.first_name || 'Anna'} {userProfile?.last_name || 'Adame'}</Typography>
                <Typography variant="body2" color="text.secondary">{userProfile?.title || 'Lead Designer / Developer'}</Typography>
              </Box>*/}
                    {/* Main Content: Tabs and Form */}
                    <Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4, px: { xs: 1, sm: 3, md: 6 } }}>
                      <Paper elevation={3} sx={{ borderRadius: 3, p: 0 }}>
                        {/*<Tabs value={settingsTab} onChange={(_, v) => setSettingsTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>*/}
                        <Tabs value={settingsTab} onChange={(event, newValue) => setSettingsTab(newValue)}>
                          <Tab label="Personal Details" />
                          <Tab label="Change Password" />
                          {/*<Tab label="Experience" />*/}
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
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon color="action" />
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
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <VpnKeyIcon color="action" />
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
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <CheckCircleIcon color="action" />
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
                {/* KYC Tab */}
                {value === 3 && (
                  <KYCPage />
                )}
              </Box>
            </Paper>

            {/* View User Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>User Details</DialogTitle>
              <DialogContent>
                {selectedUser && (
                  <Box sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                      {/* Profile Picture */}
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {(() => {
                          const profilePic = selectedUser.profile_picture || selectedUser.profile_pic;
                          const fullUrl = profilePic ?
                            (profilePic.startsWith('http') ? profilePic :
                              `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profilePic}`) :
                            null;

                          return fullUrl ? (
                            <Avatar
                              src={fullUrl}
                              alt={`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim()}
                              sx={{ width: 100, height: 100 }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = null;
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontSize: '2.5rem'
                              }}
                            >
                              {selectedUser.first_name?.[0]?.toUpperCase()}{selectedUser.last_name?.[0]?.toUpperCase()}
                            </Avatar>
                          );
                        })()}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
                        <Typography variant="body1">{selectedUser.first_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
                        <Typography variant="body1">{selectedUser.last_name}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{selectedUser.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{selectedUser.phone || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">User Type</Typography>
                        <Typography variant="body1">{selectedUser.user_type}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Typography variant="body1">{selectedUser.is_active ? 'Active' : 'Inactive'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body1">{selectedUser.address || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">City</Typography>
                        <Typography variant="body1">{selectedUser.city || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Country</Typography>
                        <Typography variant="body1">{selectedUser.country || 'Not provided'}</Typography>
                      </Grid>
                      {selectedUser.title && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                          <Typography variant="body1">{selectedUser.title}</Typography>
                        </Grid>
                      )}
                      {selectedUser.company && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                          <Typography variant="body1">{selectedUser.company}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Edit User</DialogTitle>
              <DialogContent>
                <Box sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={editFormData.first_name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={editFormData.last_name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={editFormData.title || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={editFormData.company || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
              </DialogActions>
            </Dialog>

            {/* Delete User Dialog (Keep this for single user delete if needed, or remove if batch delete replaces it) */}
            {/* You might want to reuse this for single delete if you have a separate single delete button */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
              <DialogTitle>Delete User</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this user? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                {/* Ensure this calls the correct delete handler for a single user */}
                <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
              </DialogActions>
            </Dialog>

            {/* Delete Posts Confirmation Dialog */}
            <Dialog
              open={openDeletePostsDialog}
              onClose={() => setOpenDeletePostsDialog(false)}
              aria-labelledby="delete-posts-dialog-title"
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  p: 2,
                  maxWidth: '400px'
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#FEE9E9',
                    borderRadius: '50%',
                    width: 80,
                    height: 80,
                    mb: 3
                  }}
                >
                  <DeleteIcon sx={{ color: '#E53935', fontSize: 40 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                  Are you Sure?
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                  Are you Sure You want to Delete {selectedPosts.length} {selectedPosts.length === 1 ? 'Post' : 'Posts'} ?
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setOpenDeletePostsDialog(false)}
                    sx={{ borderRadius: '4px', py: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={async () => {
                      try {
                        // Track successful and failed deletions
                        let successCount = 0;
                        let errorCount = 0;

                        // Delete each selected post using the community service
                        const deletePromises = selectedPosts.map(postId =>
                          communityService.deletePost(postId)
                            .then(() => successCount++)
                            .catch(err => {
                              console.error(`Failed to delete post ${postId}:`, err);
                              errorCount++;
                              return null; // Continue with other deletes even if one fails
                            })
                        );

                        // Wait for all deletes to complete
                        await Promise.all(deletePromises);

                        // Show a single consolidated message
                        let message = '';
                        if (successCount > 0 && errorCount === 0) {
                          message = `${successCount} Post deleted successfully!${successCount !== 1 ? 's' : ''}`;
                        } else if (successCount > 0) {
                          message = `${successCount} Post deleted successfully!${successCount !== 1 ? 's' : ''}, ${errorCount} failed`;
                        } else {
                          message = `${errorCount} Failed to delete post${errorCount !== 1 ? 's' : ''}`;
                        }

                        setSnackbar({
                          open: true,
                          message: message,
                          severity: errorCount === 0 ? 'success' : errorCount === selectedPosts.length ? 'error' : 'warning'
                        });

                        // Refresh the posts list if the function exists
                        if (typeof fetchCommunityPosts === 'function') {
                          await fetchCommunityPosts();
                        }
                      } catch (error) {
                        console.error('Error in batch delete:', error);
                        setSnackbar({
                          open: true,
                          message: 'Error deleting posts. Please try again.',
                          severity: 'error'
                        });
                      } finally {
                        // Always clear selection and close dialog
                        setSelectedPosts([]);
                        setOpenDeletePostsDialog(false);
                      }
                    }}
                    sx={{ borderRadius: '4px', py: 1, bgcolor: '#FF3B30' }}
                  >
                    Yes, Delete It!
                  </Button>
                </Box>
              </Box>
            </Dialog>

            {/* Add Company Dialog */}
            <Dialog
              open={openAddCompanyDialog}
              onClose={() => setOpenAddCompanyDialog(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <DialogTitle sx={{
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Add New Company
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Box component="form" sx={{ mt: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{
                            flexShrink: 0,
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          {companyFormData.logo ? 'Change Logo' : 'Upload Logo'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={e => setCompanyFormData(prev => ({ ...prev, logo: e.target.files[0] }))}
                          />
                        </Button>
                        {companyFormData.logo && (
                          <Box sx={{ position: 'relative', width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                            <img
                              src={companyFormData.logo instanceof File
                                ? URL.createObjectURL(companyFormData.logo)
                                : typeof companyFormData.logo === 'string' && companyFormData.logo.startsWith('http')
                                  ? companyFormData.logo
                                  : `${API_HOST}${companyFormData.logo}`}
                              alt="logo preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <Button
                              size="small"
                              color="error"
                              sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.5 }}
                              onClick={() => setCompanyFormData(prev => ({ ...prev, logo: null }))}
                            >
                              ✕
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        value={companyFormData.name}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Industry</InputLabel>
                        <Select
                          value={companyFormData.industry}
                          onChange={(e) => setCompanyFormData(prev => ({ ...prev, industry: e.target.value }))}
                          label="Industry"
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <MenuItem value="Technology">Technology</MenuItem>
                          <MenuItem value="Finance">Finance</MenuItem>
                          <MenuItem value="Healthcare">Healthcare</MenuItem>
                          <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                          <MenuItem value="Retail">Retail</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={companyFormData.status}
                          onChange={(e) => setCompanyFormData(prev => ({ ...prev, status: e.target.value }))}
                          label="Status"
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={companyFormData.description}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, description: e.target.value }))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Website"
                        value={companyFormData.website}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, website: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><LinkIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={companyFormData.address}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, address: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={companyFormData.phone}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  onClick={() => setOpenAddCompanyDialog(false)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCompany}
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Add Company
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit Company Dialog */}
            <Dialog
              open={openEditCompanyDialog}
              onClose={() => setOpenEditCompanyDialog(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              <DialogTitle sx={{
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Edit Company
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Box component="form" sx={{ mt: 1 }}>
                  <Grid container spacing={3}>
                    {/* Cover Image Upload */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{
                            flexShrink: 0,
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          {companyFormData.cover_image ? 'Change Cover Image' : 'Upload Cover Image'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                // Validate file type
                                if (!file.type.startsWith('image/')) {
                                  alert('Please select an image file');
                                  return;
                                }
                                // Validate file size (5MB max)
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('File size should be less than 5MB');
                                  return;
                                }
                                setCompanyFormData(prev => ({ ...prev, cover_image: file }));
                              }
                            }}
                          />
                        </Button>
                        {companyFormData.cover_image && (
                          <Box sx={{ position: 'relative', width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                            <img
                              src={typeof companyFormData.cover_image === 'string'
                                ? companyFormData.cover_image
                                : companyFormData.cover_image instanceof File
                                  ? URL.createObjectURL(companyFormData.cover_image)
                                  : ''}
                              alt="cover preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <Button
                              size="small"
                              color="error"
                              sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.5 }}
                              onClick={() => setCompanyFormData(prev => ({ ...prev, cover_image: null }))}
                            >
                              ✕
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Company Name */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Company Name"
                        value={companyFormData.name || ''}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Description"
                        multiline
                        rows={4}
                        value={companyFormData.description || ''}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, description: e.target.value }))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>

                    {/* Industry */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Industry"
                        value={companyFormData.industry || ''}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, industry: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>

                    {/* Location Fields */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="City"
                        value={companyFormData.city || ''}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, city: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="State"
                        value={companyFormData.state || ''}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, state: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="Country"
                        value={companyFormData.country || ''}
                        onChange={(e) => setCompanyFormData(prev => ({ ...prev, country: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>

                    {/* Company Status */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Company Status</InputLabel>
                        <Select
                          value={companyFormData.status || 'Pending'}
                          onChange={(e) => setCompanyFormData(prev => ({ ...prev, status: e.target.value }))}
                          label="Company Status"
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  onClick={() => setOpenEditCompanyDialog(false)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEditCompany}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Company Dialog */}
            <Dialog open={openDeleteCompanyDialog} onClose={() => setOpenDeleteCompanyDialog(false)}>
              <DialogTitle>Delete Company</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this company? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteCompanyDialog(false)}>Cancel</Button>
                <Button onClick={handleDeleteCompany} color="error" variant="contained">Delete</Button>
              </DialogActions>
            </Dialog>

            {/* Advanced Filters Dialog */}
            <FilterDialog
              open={openAdvancedFilters}
              onClose={() => setOpenAdvancedFilters(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Advanced Filters</DialogTitle>
              <DialogContent>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Start Date"
                        value={advancedFilters.dateRange[0] ? format(new Date(advancedFilters.dateRange[0]), 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          handleAdvancedFilterChange('dateRange', [
                            e.target.value ? parseISO(e.target.value) : null,
                            advancedFilters.dateRange[1]
                          ]);
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="End Date"
                        value={advancedFilters.dateRange[1] ? format(new Date(advancedFilters.dateRange[1]), 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          handleAdvancedFilterChange('dateRange', [
                            advancedFilters.dateRange[0],
                            e.target.value ? parseISO(e.target.value) : null
                          ]);
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <FormControl fullWidth>
                    <InputLabel>Search Fields</InputLabel>
                    <Select
                      multiple
                      value={advancedFilters.searchFields}
                      onChange={(e) => handleAdvancedFilterChange('searchFields', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>User Types</InputLabel>
                    <Select
                      multiple
                      value={advancedFilters.userTypes}
                      onChange={(e) => handleAdvancedFilterChange('userTypes', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Industries</InputLabel>
                    <Select
                      multiple
                      value={advancedFilters.industries}
                      onChange={(e) => handleAdvancedFilterChange('industries', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="technology">Technology</MenuItem>
                      <MenuItem value="manufacturing">Manufacturing</MenuItem>
                      <MenuItem value="finance">Finance</MenuItem>
                      <MenuItem value="healthcare">Healthcare</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      multiple
                      value={advancedFilters.status}
                      onChange={(e) => handleAdvancedFilterChange('status', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAdvancedFilters(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenAdvancedFilters(false);
                    // Trigger filter application
                    if (value === 0) {
                      fetchUsers();
                    } else if (value === 1) {
                      fetchCompanies();
                    }
                  }}
                >
                  Apply Filters
                </Button>
              </DialogActions>
            </FilterDialog>

            {/* Activity Logging Drawer */}
            <ActivityDrawer
              anchor="right"
              open={showActivityDrawer}
              onClose={() => setShowActivityDrawer(false)}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Activity Log
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent administrative actions
                </Typography>
              </Box>

              <List>
                {activityLogs.map((log, index) => (
                  <React.Fragment key={log.id}>
                    <ListItem>
                      <ListItemIcon>
                        <TimelineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={log.description}
                        secondary={format(new Date(log.timestamp), 'PPpp')}
                      />
                    </ListItem>
                    {index < activityLogs.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </ActivityDrawer>

            {/* Add Export and Activity Log buttons to the toolbar */}
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 1,
              }}
            >
              <Tooltip title="View Activity Log">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowActivityDrawer(true)}
                  startIcon={<HistoryIcon />}
                >
                  Activity Log
                </Button>
              </Tooltip>
              <Tooltip title="Export Data">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (value === 0) {
                      exportData(users, 'users');
                    } else if (value === 1) {
                      exportData(companies, 'companies');
                    }
                  }}
                  startIcon={<FileDownloadIcon />}
                >
                  Export
                </Button>
              </Tooltip>
            </Box>

            {/* View Company Dialog */}
            <Dialog
              open={openViewCompanyDialog}
              onClose={handleCloseViewCompanyDialog}
              maxWidth="lg"
              fullWidth
              sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '1200px', height: '90vh' } }}
            >
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6">Company Details</Typography>
                <IconButton edge="end" color="inherit" onClick={handleCloseViewCompanyDialog} aria-label="close">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                {selectedCompany && (
                  <Box sx={{ height: '100%', overflowY: 'auto' }}>
                    <CompanyView
                      id={selectedCompany.id}
                      isDialog={true}
                      onClose={handleCloseViewCompanyDialog}
                    />
                  </Box>
                )}
              </DialogContent>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog
              open={openAddUserDialog}
              onClose={() => setOpenAddUserDialog(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(80,80,180,0.10)',
                  background: '#fff',
                }
              }}
            >
              <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 1 }}>
                Add New User
              </DialogTitle>
              <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={addUserForm.password}
                      name="password"
                      onChange={handleAddUserFormChange}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <PasswordRequirements />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={addUserForm.first_name}
                      onChange={(e) => setAddUserForm({ ...addUserForm, first_name: e.target.value })}
                      InputLabelProps={{ shrink: true }}
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
                      value={addUserForm.last_name}
                      onChange={(e) => setAddUserForm({ ...addUserForm, last_name: e.target.value })}
                      InputLabelProps={{ shrink: true }}
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
                    <FormControl fullWidth>
                      <InputLabel>User Type</InputLabel>
                      <Select
                        value={addUserForm.user_type}
                        label="User Type"
                        onChange={e => setAddUserForm({ ...addUserForm, user_type: e.target.value })}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Staff Status</InputLabel>
                      <Select
                        value={addUserForm.is_staff ? "yes" : "no"}
                        label="Staff Status"
                        onChange={e => setAddUserForm({ ...addUserForm, is_staff: e.target.value === "yes" })}
                      >
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2, pt: 3 }}>
                <Button onClick={() => setOpenAddUserDialog(false)} sx={{ color: "#1976d2" }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
                  disabled={!isAddUserPasswordValid}
                >
                  Add User
                </Button>
              </DialogActions>
            </Dialog>

            {/* Email Compose Dialog */}
            <Dialog open={openCompose} onClose={() => setOpenCompose(false)} maxWidth="md" fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(31,149,245,0.10)',
                  background: '#f9fbfd',
                  p: 0
                }
              }}
            >
              <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0, background: '#eaf4fd', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: '#1f95f5', color: '#fff', fontWeight: 700 }}>U</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20, color: '#1f95f5' }}>New Message</Typography>
                    <Typography variant="caption" color="text.secondary">Innovest Mail</Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setOpenCompose(false)}><CloseIcon /></IconButton>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ pt: 3, background: '#f9fbfd' }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={composeTo}
                      onChange={(_, newValue) => setComposeTo(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="filled" color="primary" label={option} {...getTagProps({ index })} sx={{ borderRadius: 2, fontWeight: 600 }} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="To" placeholder="Add recipient..." sx={{ borderRadius: 2, background: '#fff' }} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Tooltip title="Add Cc">
                      <Button size="small" variant={showCc ? 'contained' : 'outlined'} onClick={() => setShowCc(v => !v)} sx={{ borderRadius: 2, minWidth: 48, fontWeight: 700, color: '#1f95f5', borderColor: '#1f95f5', background: showCc ? '#eaf4fd' : '#fff' }}>Cc</Button>
                    </Tooltip>
                    <Tooltip title="Add Bcc">
                      <Button size="small" variant={showBcc ? 'contained' : 'outlined'} onClick={() => setShowBcc(v => !v)} sx={{ borderRadius: 2, minWidth: 48, fontWeight: 700, color: '#1f95f5', borderColor: '#1f95f5', background: showBcc ? '#eaf4fd' : '#fff' }}>Bcc</Button>
                    </Tooltip>
                  </Grid>
                  {showCc && (
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={composeCc}
                        onChange={(_, newValue) => setComposeCc(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="filled" color="info" label={option} {...getTagProps({ index })} sx={{ borderRadius: 2, fontWeight: 600 }} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Cc" placeholder="Add Cc..." sx={{ borderRadius: 2, background: '#fff' }} />
                        )}
                      />
                    </Grid>
                  )}
                  {showBcc && (
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={composeBcc}
                        onChange={(_, newValue) => setComposeBcc(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="filled" color="secondary" label={option} {...getTagProps({ index })} sx={{ borderRadius: 2, fontWeight: 600 }} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Bcc" placeholder="Add Bcc..." sx={{ borderRadius: 2, background: '#fff' }} />
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Subject"
                      value={composeSubject}
                      onChange={e => setComposeSubject(e.target.value)}
                      sx={{ background: '#fff', borderRadius: 2, fontWeight: 600 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ReactQuill theme="snow" value={composeBody} onChange={setComposeBody} style={{ height: 180, marginBottom: 8, background: '#fff', borderRadius: 12, fontSize: 16 }} />
                  </Grid>
                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ px: 4, pb: 3, background: '#eaf4fd', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, justifyContent: 'space-between' }}>
                <Button color="error" onClick={() => setOpenCompose(false)} sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}>Discard</Button>
                <Button variant="contained" onClick={handleSendEmail} sx={{ borderRadius: 3, fontWeight: 800, px: 5, py: 1.2, fontSize: '1.1rem', background: '#1f95f5', color: '#fff', boxShadow: '0 2px 8px rgba(31,149,245,0.10)', '&:hover': { background: '#1878c9' } }}>Send</Button>
              </DialogActions>
            </Dialog>

            {/* Global Snackbar for notifications */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>

          </Grid>
        </Grid>
      </Container>

      {/* Create Event Dialog */}
      <Dialog open={openCreateEventDialog} onClose={() => setOpenCreateEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{ flexShrink: 0 }}
                  >
                    {eventForm.coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            alert('Please select an image file');
                            return;
                          }
                          // Validate file size (5MB max)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size should be less than 5MB');
                            return;
                          }
                          setEventForm(f => ({ ...f, coverImage: file }));
                        }
                      }}
                    />
                  </Button>
                  {eventForm.coverImage && (
                    <Box sx={{ position: 'relative', width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee', ml: 2 }}>
                      <img
                        src={URL.createObjectURL(eventForm.coverImage)}
                        alt="cover preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.5 }}
                        onClick={() => setEventForm(f => ({ ...f, coverImage: null }))}
                      >
                        ✕
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  value={eventForm.title}
                  onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LabelIcon color="action" /></InputAdornment> }}
                  helperText="Event name, e.g. 'Innovest 2024'"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Box sx={{
                  '& .ql-container': {
                    height: '200px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  },
                  '& .ql-toolbar': {
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  },
                  '& .ql-container': {
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px'
                  }
                }}>
                  <ReactQuill
                    value={eventForm.description || ''}
                    onChange={(content) => {
                      setEventForm(f => ({ ...f, description: content }));
                    }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    placeholder="Briefly describe your event..."
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  fullWidth
                  value={eventForm.location}
                  onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment> }}
                  helperText="Venue or city, e.g. 'New York'"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location Link"
                  fullWidth
                  value={eventForm.locationLink}
                  onChange={e => setEventForm(f => ({ ...f, locationLink: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon color="action" /></InputAdornment> }}
                  helperText="Google Maps or event link (optional)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={eventForm.categories}
                    open={eventCategoryMenuOpen}
                    onOpen={() => setEventCategoryMenuOpen(true)}
                    onClose={() => setEventCategoryMenuOpen(false)}
                    onChange={e => setEventForm(f => ({ ...f, categories: e.target.value }))}
                    label="Categories"
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {eventCategories.map(cat => (
                      <MenuItem key={cat} value={cat}>
                        <Checkbox checked={eventForm.categories.indexOf(cat) > -1} />
                        {cat}
                      </MenuItem>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1 }}>
                      <Button size="small" variant="contained" onClick={() => setEventCategoryMenuOpen(false)}>
                        Done
                      </Button>
                    </Box>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Registration Form Link"
                  fullWidth
                  value={eventForm.registration_form}
                  onChange={e => setEventForm(f => ({ ...f, registration_form: e.target.value }))}
                  helperText="Enter survey or registration form link"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={eventForm.publish}
                      onChange={e => setEventForm(f => ({ ...f, publish: e.target.checked }))}
                    />
                  }
                  label="Publish"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EventDateTimeField
                  label="Start At"
                  value={eventForm.startAt}
                  onChange={newStartAt => {
                    // If registration end is after new start date, clear it
                    if (eventForm.registrationEnd && new Date(eventForm.registrationEnd) > new Date(newStartAt)) {
                      setEventForm(f => ({ ...f, startAt: newStartAt, registrationEnd: '' }));
                    } else {
                      setEventForm(f => ({ ...f, startAt: newStartAt }));
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EventDateTimeField
                  label="End At"
                  value={eventForm.endAt}
                  onChange={endAt => setEventForm(f => ({ ...f, endAt }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EventDateTimeField
                  label="Registration End"
                  value={eventForm.registrationEnd}
                  onChange={newRegistrationEnd => {
                    // Validate that registration end is before start date
                    if (eventForm.startAt && new Date(newRegistrationEnd) > new Date(eventForm.startAt)) {
                      alert('Registration end date must be before event start date');
                      return;
                    }
                    setEventForm(f => ({ ...f, registrationEnd: newRegistrationEnd }));
                  }}
                  helperText="Must be before event start date"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateEventDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateEvent}
            disabled={!eventForm.title || !eventForm.startAt || !eventForm.endAt}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Idea Dialog */}
      <Dialog open={openAddIdeaDialog} onClose={() => setOpenAddIdeaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Idea</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{ flexShrink: 0 }}
                  >
                    {ideaForm.image ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={e => setIdeaForm(f => ({ ...f, image: e.target.files[0] }))}
                    />
                  </Button>
                  {ideaForm.image && (
                    <Box sx={{ position: 'relative', width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee', ml: 2 }}>
                      <img
                        src={URL.createObjectURL(ideaForm.image)}
                        alt="idea preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.5 }}
                        onClick={() => setIdeaForm(f => ({ ...f, image: null }))}
                      >
                        ✕
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  value={ideaForm.title}
                  onChange={e => setIdeaForm(f => ({ ...f, title: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LabelIcon color="action" /></InputAdornment> }}
                  helperText="Idea title, e.g. 'Improve Dashboard UI'"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Box sx={{
                  '& .ql-container': {
                    height: '200px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  },
                  '& .ql-toolbar': {
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  },
                  '& .ql-container': {
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px'
                  }
                }}>
                  <ReactQuill
                    value={ideaForm.description || ''}
                    onChange={(content) => {
                      setIdeaForm(f => ({ ...f, description: content }));
                    }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    placeholder="Describe your idea..."
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={ideaForm.categories}
                    onChange={e => setIdeaForm(f => ({ ...f, categories: e.target.value }))}
                    label="Categories"
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {ideaCategories.map(cat => (
                      <MenuItem key={cat} value={cat}>
                        <Checkbox checked={ideaForm.categories.indexOf(cat) > -1} />
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddIdeaDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Add Idea
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={openEditEventDialog} onClose={() => setOpenEditEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{ flexShrink: 0 }}
                  >
                    {eventForm.coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            alert('Please select an image file');
                            return;
                          }
                          // Validate file size (5MB max)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size should be less than 5MB');
                            return;
                          }
                          setEventForm(f => ({ ...f, coverImage: file }));
                        }
                      }}
                    />
                  </Button>
                  {eventForm.coverImage && (
                    <Box sx={{ position: 'relative', width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee', ml: 2 }}>
                      <img
                        src={eventForm.coverImage instanceof File ? URL.createObjectURL(eventForm.coverImage) : selectedEvent?.cover_image
                          ? `${API_HOST}${selectedEvent.cover_image}`
                          : ''}
                        alt="cover preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.5 }}
                        onClick={() => setEventForm(f => ({ ...f, coverImage: null }))}
                      >
                        ✕
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  value={eventForm.title}
                  onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LabelIcon color="action" /></InputAdornment> }}
                  helperText="Event name, e.g. 'Innovest 2024'"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Box sx={{
                  '& .ql-container': {
                    height: '200px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  },
                  '& .ql-toolbar': {
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                    backgroundColor: '#f5f5f5'
                  },
                  '& .ql-container': {
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px'
                  }
                }}>
                  <ReactQuill
                    value={eventForm.description || ''}
                    onChange={(content) => {
                      setEventForm(f => ({ ...f, description: content }));
                    }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    placeholder="Briefly describe your event..."
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  fullWidth
                  value={eventForm.location}
                  onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment> }}
                  helperText="Venue or city, e.g. 'New York'"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location Link"
                  fullWidth
                  value={eventForm.locationLink}
                  onChange={e => setEventForm(f => ({ ...f, locationLink: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon color="action" /></InputAdornment> }}
                  helperText="Google Maps or event link (optional)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={eventForm.categories}
                    open={eventCategoryMenuOpen}
                    onOpen={() => setEventCategoryMenuOpen(true)}
                    onClose={() => setEventCategoryMenuOpen(false)}
                    onChange={e => setEventForm(f => ({ ...f, categories: e.target.value }))}
                    label="Categories"
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {eventCategories.map(cat => (
                      <MenuItem key={cat} value={cat}>
                        <Checkbox checked={eventForm.categories.indexOf(cat) > -1} />
                        {cat}
                      </MenuItem>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1 }}>
                      <Button size="small" variant="contained" onClick={() => setEventCategoryMenuOpen(false)}>
                        Done
                      </Button>
                    </Box>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Registration Form Link"
                  fullWidth
                  value={eventForm.registration_form}
                  onChange={e => setEventForm(f => ({ ...f, registration_form: e.target.value }))}
                  helperText="Enter survey or registration form link"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={eventForm.publish}
                      onChange={e => setEventForm(f => ({ ...f, publish: e.target.checked }))}
                    />
                  }
                  label="Publish"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EventDateTimeField
                  label="Start At"
                  value={eventForm.startAt}
                  onChange={newStartAt => {
                    // If registration end is after new start date, clear it
                    if (eventForm.registrationEnd && new Date(eventForm.registrationEnd) > new Date(newStartAt)) {
                      setEventForm(f => ({ ...f, startAt: newStartAt, registrationEnd: '' }));
                    } else {
                      setEventForm(f => ({ ...f, startAt: newStartAt }));
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EventDateTimeField
                  label="End At"
                  value={eventForm.endAt}
                  onChange={endAt => setEventForm(f => ({ ...f, endAt }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EventDateTimeField
                  label="Registration End"
                  value={eventForm.registrationEnd}
                  onChange={newRegistrationEnd => {
                    // Validate that registration end is before start date
                    if (eventForm.startAt && new Date(newRegistrationEnd) > new Date(eventForm.startAt)) {
                      alert('Registration end date must be before event start date');
                      return;
                    }
                    setEventForm(f => ({ ...f, registrationEnd: newRegistrationEnd }));
                  }}
                  helperText="Must be before event start date"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditEventDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditEvent}
            disabled={!eventForm.title || !eventForm.startAt || !eventForm.endAt}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog
        open={openViewEventDialog}
        onClose={() => {
          setOpenViewEventDialog(false);
          setSelectedEvent(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Event Details</Typography>
            <IconButton onClick={() => {
              setOpenViewEventDialog(false);
              setSelectedEvent(null);
            }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Event Cover Image */}
                {selectedEvent.cover_image && (
                  <Grid item xs={12}>
                    <Box sx={{
                      width: '100%',
                      height: 200,
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={selectedEvent.cover_image.startsWith('http')
                          ? selectedEvent.cover_image
                          : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${selectedEvent.cover_image}`}
                        alt={selectedEvent.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/event_images/default_event_cover.jpg`;
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Event Title and Status */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{selectedEvent.title}</Typography>
                    <Chip
                      label={selectedEvent.privacy === 'publish' ? 'Published' : 'Hidden'}
                      color={selectedEvent.privacy === 'publish' ? 'success' : 'default'}
                    />
                  </Box>
                </Grid>

                {/* Event Description */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                  <Typography variant="body1">{selectedEvent.description}</Typography>
                </Grid>

                {/* Event Categories */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Categories</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedEvent.categories && (Array.isArray(selectedEvent.categories) ? selectedEvent.categories :
                      (typeof selectedEvent.categories === 'string' && selectedEvent.categories.startsWith('[') ?
                        JSON.parse(selectedEvent.categories) : [selectedEvent.categories])).map((category, index) => (
                          <Chip key={index} label={category} />
                        ))}
                  </Box>
                </Grid>

                {/* Event Registration Form Link */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Registration Form Link
                  </Typography>
                  {selectedEvent.registration_form && (
                    <Link
                      href={selectedEvent.registration_form}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body1"
                    >
                      {selectedEvent.registration_form}
                    </Link>
                  )}
                </Grid>

                {/* Event Location */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Location</Typography>
                  <Typography variant="body1">{selectedEvent.location}</Typography>
                  {selectedEvent.location_link && (
                    <Link
                      href={selectedEvent.location_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      View on Map
                    </Link>
                  )}
                </Grid>

                {/* Event Timeline */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Timeline</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Start Date</Typography>
                      <Typography variant="body1">{format(new Date(selectedEvent.start_at), 'PPp')}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">End Date</Typography>
                      <Typography variant="body1">{format(new Date(selectedEvent.end_at), 'PPp')}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Registration Deadline</Typography>
                      <Typography variant="body1">
                        {selectedEvent.registration_end ? format(new Date(selectedEvent.registration_end), 'PPp') : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Contacts Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Contacts</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected contacts? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmBulkDeleteContacts} // Call the new confirmation handler
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Company Details Dialog */}
      <Dialog open={openViewCompanyDialog} onClose={() => setOpenViewCompanyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          {selectedCompany && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedCompany.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Industry</Typography>
                  <Typography variant="body1">{selectedCompany.industry}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedCompany.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{selectedCompany.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Typography variant="body1">{selectedCompany.status}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                  <Typography variant="body1">{selectedCompany.website}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedCompany.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body1">{selectedCompany.created_at ? format(new Date(selectedCompany.created_at), 'PPpp') : ''}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewCompanyDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Custom Batch Delete Confirmation Dialog for Users */}
      <Dialog open={openBatchDeleteConfirm} onClose={() => setOpenBatchDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            {/* Using Avatar for a circular background around the icon */}
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} /> {/* Red trash icon */}
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete {selectedUsers.length} Account{selectedUsers.length > 1 ? 's' : ''} ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenBatchDeleteConfirm(false);
              setSelectedUsers([]); // Clear selection on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400 ',
              '&:hover': { background: '#ef4444' }
            }}
            onClick={handleConfirmBatchDelete} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Batch Delete Confirmation Dialog for Companies */}
      <Dialog open={openCompanyBatchDeleteConfirm} onClose={() => setOpenCompanyBatchDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete {selectedCompanies.length} Compan{selectedCompanies.length > 1 ? 'ies' : 'y'} ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenCompanyBatchDeleteConfirm(false);
              setSelectedCompanies([]); // Clear selection on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Use the specific red color from the image
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmCompanyBatchDelete} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Batch Delete Confirmation Dialog for Events */}
      <Dialog open={openEventBatchDeleteConfirm} onClose={() => setOpenEventBatchDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete {selectedEvents.length} Event{selectedEvents.length > 1 ? 's' : ''} ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenEventBatchDeleteConfirm(false);
              setSelectedEvents([]); // Clear selection on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Use the specific red color from the image
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmEventBatchDelete} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Batch Delete Confirmation Dialog for Contacts */}
      <Dialog open={openContactBatchDeleteConfirm} onClose={() => setOpenContactBatchDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete {selectedContactIds.length} Contact{selectedContactIds.length > 1 ? 's' : ''} ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenContactBatchDeleteConfirm(false);
              setSelectedContactIds([]); // Clear selection on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Use the specific red color from the image
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmBulkDeleteContacts} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Single User Delete Confirmation Dialog */}
      <Dialog open={openSingleUserDeleteConfirm} onClose={() => setOpenSingleUserDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete this Account ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenSingleUserDeleteConfirm(false);
              setUserToDeleteId(null); // Clear the user ID on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Specific red color
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmSingleUserDelete} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Single Event Delete Confirmation Dialog */}
      <Dialog open={openSingleEventDeleteConfirm} onClose={() => setOpenSingleEventDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete this Event ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenSingleEventDeleteConfirm(false);
              setEventToDeleteId(null); // Clear the event ID on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Specific red color
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmSingleEventDelete} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Single Company Delete Confirmation Dialog */}
      <Dialog open={openSingleCompanyDeleteConfirm} onClose={() => setOpenSingleCompanyDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete this Company ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenSingleCompanyDeleteConfirm(false);
              setCompanyToDeleteId(null); // Clear the company ID on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Specific red color
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmSingleCompanyDelete} // Call the new confirmation handler
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* State for single community post deletion confirmation */}
      <Dialog open={openSinglePostDeleteConfirm} onClose={() => setOpenSinglePostDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: '#ffebee', width: 80, height: 80 }}>
              <DeleteOutlineIcon sx={{ color: '#c62828', fontSize: 40 }} />
            </Avatar>
          </Box>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: 20 }}>
            Are you Sure ?
          </DialogTitle>
          <Typography variant="body1" color="text.secondary">
            Are you Sure You want to Delete this Post ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              borderColor: '#ced4da',
              color: '#495057'
            }}
            onClick={() => {
              setOpenSinglePostDeleteConfirm(false);
              setPostToDeleteId(null); // Clear the post ID on cancel
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: 120,
              background: '#f01400', // Specific red color
              '&:hover': { background: '#c62828' } // Darker shade on hover
            }}
            onClick={handleConfirmSinglePostDelete}
          >
            Yes, Delete It!
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Company Dialog */}
      <Dialog
        open={openViewCompanyDialog}
        onClose={handleCloseViewCompanyDialog}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '1200px', height: '90vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">Company Details</Typography>
          <IconButton edge="end" color="inherit" onClick={handleCloseViewCompanyDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {selectedCompany && (
            <Box sx={{ height: '100%', overflowY: 'auto' }}>
              <CompanyView
                id={selectedCompany.id}
                isDialog={true}
                onClose={handleCloseViewCompanyDialog}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
