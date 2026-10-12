import { API_HOST } from '../../config';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  FormGroup,
  Checkbox,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import authService from '../../services/authService';
import companyService from '../../services/companyService';
import axios from 'axios';

const steps = [
  'Authentication & KYC',
  'Deal Details',
  'Legal Agreements',
  'Investment Amount',
  'Payment',
  'Confirmation',
];

function InvestmentFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [company, setCompany] = useState(null);
  const [fundraiseTerms, setFundraiseTerms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // KYC form state
  const [showKycForm, setShowKycForm] = useState(false);
  const user = authService.getCurrentUser?.();
  const [kycForm, setKycForm] = useState({
    name: user?.first_name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    phoneNumber: user?.phone || '',
    dateOfBirth: user?.dob || '',
    idType: '',
    idNumber: '',
    idDocument: null,
    sourceOfFunds: '',
    otherSourceOfFunds: '',
    declaration: false,
    termsAgreement: false,
    verificationConsent: false,
    signature: null
  });
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [kycError, setKycError] = useState(null);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [kycStatusLoading, setKycStatusLoading] = useState(true);
  const [kycStatusError, setKycStatusError] = useState(null);

  const [agreements, setAgreements] = useState({
    shareholder: false,
    terms: false,
    risk: false,
  });
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentError, setInvestmentError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const allChecked = agreements.shareholder && agreements.terms && agreements.risk;

  const [paymentDetails, setPaymentDetails] = useState(null);

  const fetchKycStatus = useCallback(async () => {
    const token = authService.getToken();
    if (!token) {
      setKycStatusLoading(false);
      return;
    }

    setKycStatusLoading(true);
    setKycStatusError(null);
    try {
      const response = await axios.get(`${API_HOST}/api/kyc/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKycCompleted(Boolean(response.data.submitted));
      if (response.data.kyc) {
        const existingKyc = response.data.kyc;
        setKycForm((previous) => ({
          ...previous,
          name: existingKyc.name || previous.name,
          email: existingKyc.email || previous.email,
          phoneNumber: existingKyc.phone_number || previous.phoneNumber,
          dateOfBirth: existingKyc.date_of_birth || previous.dateOfBirth,
          address: existingKyc.address || previous.address,
          city: existingKyc.city || previous.city,
          country: existingKyc.country || previous.country,
          idType: existingKyc.id_type || previous.idType,
          addressProofType: existingKyc.address_proof_type || previous.addressProofType,
          businessName: existingKyc.business_name || previous.businessName,
          businessRegistrationNumber: existingKyc.business_registration_number || previous.businessRegistrationNumber,
          entityType: existingKyc.entity_type || previous.entityType,
          sourceOfFunds: existingKyc.source_of_funds || previous.sourceOfFunds,
        }));
      }
    } catch (statusError) {
      console.error('Error checking KYC status:', statusError);
      setKycStatusError(statusError.response?.data?.detail || 'Could not check your KYC status. Please try again.');
    } finally {
      setKycStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  const handleKycChange = (e) => {
    const { name, value, files } = e.target;
    setKycForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setKycError(null);

    const requiredFiles = [
      ['idDocument', 'identity document'],
      ['addressProof', 'address proof'],
      ['signature', 'signature']
    ];
    const missingFiles = requiredFiles
      .filter(([field]) => !kycForm[field])
      .map(([, label]) => label);
    if (missingFiles.length > 0) {
      setKycError(`Please attach the required file(s): ${missingFiles.join(', ')}.`);
      return;
    }

    setKycSubmitting(true);

    try {
      // Create FormData object for file uploads
      const formData = new FormData();

      // Add file fields
      if (kycForm.idDocument) {
        formData.append('id_document', kycForm.idDocument);
      }
      if (kycForm.addressProof) {
        formData.append('address_proof', kycForm.addressProof);
      }
      if (kycForm.signature) {
        formData.append('signature', kycForm.signature);
      }

      // Add other KYC data
      const kycData = {
        company_id: id, // Company ID from URL params
        name: kycForm.name,
        email: kycForm.email,
        phone_number: kycForm.phoneNumber,
        date_of_birth: kycForm.dateOfBirth,
        address: kycForm.address,
        city: kycForm.city,
        country: kycForm.country,
        id_type: kycForm.idType,
        address_proof_type: kycForm.addressProofType,
        business_name: kycForm.businessName || '',
        business_registration_number: kycForm.businessRegistrationNumber || '',
        entity_type: kycForm.entityType || '',
        source_of_funds: kycForm.sourceOfFunds,
        declaration: kycForm.declaration ? 'agree' : 'disagree'
      };

      // Add all KYC data to FormData
      Object.keys(kycData).forEach(key => {
        formData.append(key, kycData[key]);
      });

      // Store in session storage for payment success handling
      sessionStorage.setItem('kyc_data', JSON.stringify(kycData));

      // Get the authentication token
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Send KYC data to backend
      const response = await axios.post(
        `${API_HOST}/api/kyc/submit/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setKycSubmitting(false);
        setKycSuccess(true);
        setKycCompleted(true);
        setTimeout(() => {
          setShowKycForm(false);
          setKycSuccess(false);
          handleNext();
        }, 1200);
      } else {
        throw new Error(response.data.message || 'Failed to submit KYC data');
      }
    } catch (error) {
      console.error('Error submitting KYC data:', error);
      if (error.response?.status === 401) {
        // Handle authentication error
        authService.logout();
        setKycError('Your session has expired. Please log in again.');
      } else {
        setKycError(error.response?.data?.message || error.message || 'Failed to submit KYC data. Please try again.');
      }
      setKycSubmitting(false);
    }
  };

  const handleInvestmentChange = (e) => {
    const value = e.target.value;
    setInvestmentAmount(value);

    // Clear error when user starts typing
    if (investmentError) {
      setInvestmentError('');
    }

    // Validate input is a number
    if (value && isNaN(value)) {
      setInvestmentError('Please enter a valid number');
      return;
    }

    // Convert to number for validation
    const amount = Number(value);

    if (amount < 0) {
      setInvestmentError('Amount cannot be negative');
      return;
    }

    if (fundraiseTerms) {
      const minAmount = Number(fundraiseTerms.min_investment_amount);
      const maxAmount = Number(fundraiseTerms.raise_amount);

      if (amount < minAmount) {
        setInvestmentError(`Minimum investment amount is ৳${minAmount.toLocaleString()}`);
      } else if (amount > maxAmount) {
        setInvestmentError(`Maximum investment amount is ৳${maxAmount.toLocaleString()}`);
      }
    }
  };

  const isInvestmentValid = () => {
    if (!investmentAmount || investmentError) return false;
    const amount = Number(investmentAmount);
    if (!fundraiseTerms) return false;

    const minAmount = Number(fundraiseTerms.min_investment_amount);
    const maxAmount = Number(fundraiseTerms.raise_amount);

    return amount >= minAmount && amount <= maxAmount;
  };

  // Add payment success handling
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      // Check for success parameters in URL
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const tran_id = urlParams.get('tran_id');

      if (status === 'VALID' || window.location.pathname === '/payment/success') {
        try {
          // Check if payment was already verified
          const storedPaymentInfo = sessionStorage.getItem('payment_success_info');
          if (storedPaymentInfo) {
            const paymentInfo = JSON.parse(storedPaymentInfo);
            if (paymentInfo.transaction_id === tran_id) {
              // Payment already verified, just move to confirmation step
              setPaymentDetails(paymentInfo);
              setActiveStep(5);
              // Update URL without page reload
              window.history.pushState({}, '', `/investment/${id}`);
              return;
            }
          }

          // Verify the payment
          const response = await axios.post(`${API_HOST}/api/payments/verify_payment/`, {
            tran_id: tran_id,
            investment_id: id,
            amount: investmentAmount,
            status: 'VALID',
          }, {
            headers: {
              'Authorization': `Bearer ${authService.getToken()}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.data.success) {
            // Store payment info in sessionStorage
            const paymentInfo = {
              company_name: response.data.company_name,
              amount: response.data.amount,
              date: response.data.date,
              transaction_id: response.data.transaction_id
            };
            sessionStorage.setItem('payment_success_info', JSON.stringify(paymentInfo));

            // Update payment details state
            setPaymentDetails(paymentInfo);

            // Move to confirmation step
            setActiveStep(5);
            // Update URL without page reload
            window.history.pushState({}, '', `/investment/${id}`);
          } else {
            setPaymentError('Payment verification failed. Please contact support.');
            setActiveStep(4);
            const amount = urlParams.get('amount') || investmentAmount;
            setInvestmentAmount(amount);
            window.history.pushState({}, '', `/investment/${id}?amount=${encodeURIComponent(amount)}`);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          // Check if the error is due to payment already being verified
          if (error.response?.status === 400 && error.response?.data?.message?.includes('already verified')) {
            // Payment already verified, move to confirmation step
            setActiveStep(5);
            window.history.pushState({}, '', `/investment/${id}`);
          } else {
            setPaymentError('Failed to verify payment. Please contact support.');
            setActiveStep(4);
            const amount = urlParams.get('amount') || investmentAmount;
            setInvestmentAmount(amount);
            window.history.pushState({}, '', `/investment/${id}?amount=${encodeURIComponent(amount)}`);
          }
        }
      } else if (status === 'FAILED' || window.location.pathname === '/payment/fail') {
        setPaymentError('Payment failed. Please try again.');
        setActiveStep(4);
        const amount = urlParams.get('amount') || investmentAmount;
        setInvestmentAmount(amount);
        window.history.pushState({}, '', `/investment/${id}?amount=${encodeURIComponent(amount)}`);
      } else if (status === 'CANCELLED' || window.location.pathname === '/payment/cancel') {
        setPaymentError('Payment was cancelled.');
        setActiveStep(4);
        const amount = urlParams.get('amount') || investmentAmount;
        setInvestmentAmount(amount);
        window.history.pushState({}, '', `/investment/${id}?amount=${encodeURIComponent(amount)}`);
      }
    };

    handlePaymentSuccess();
  }, [id, company, investmentAmount]);

  const initiatePayment = async () => {
    if (!investmentAmount || !isInvestmentValid()) {
      setPaymentError('Please enter a valid investment amount first');
      return;
    }

    if (!kycForm.phoneNumber) {
      setPaymentError('Please enter your phone number');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Please log in to continue');
      }

      const user = authService.getCurrentUser();
      const token = authService.getToken();

      if (!user || !token) {
        throw new Error('Authentication failed. Please log in again.');
      }

      // Store payment information in localStorage before redirect
      const paymentInfo = {
        investment_id: id,
        amount: investmentAmount,
        company_id: id,
        user_id: user.id
      };
      localStorage.setItem('payment_info', JSON.stringify(paymentInfo));

      // Create the success URL with all required parameters
      const successUrl = new URL(`${window.location.origin}/payment/success`);
      successUrl.searchParams.append('investment_id', id);
      successUrl.searchParams.append('amount', investmentAmount);

      // Create the fail URL with all required parameters
      const failUrl = new URL(`${window.location.origin}/payment/fail`);
      failUrl.searchParams.append('investment_id', id);
      failUrl.searchParams.append('amount', investmentAmount);

      // Create the cancel URL with all required parameters
      const cancelUrl = new URL(`${window.location.origin}/payment/cancel`);
      cancelUrl.searchParams.append('investment_id', id);
      cancelUrl.searchParams.append('amount', investmentAmount);

      const requestData = {
        amount: Number(investmentAmount),
        payment_method: 'mobile',
        company_id: id,
        user_id: user.id,
        phone_number: kycForm.phoneNumber,
        success_url: successUrl.toString(),
        fail_url: failUrl.toString(),
        cancel_url: cancelUrl.toString(),
        cus_name: user.first_name + ' ' + user.last_name,
        cus_email: user.email,
        cus_add1: kycForm.address || 'Not Provided',
        cus_city: kycForm.city || 'Not Provided',
        cus_postcode: kycForm.postal_code || '1204',
        cus_country: kycForm.country || 'Bangladesh',
        shipping_method: 'NO',
        product_name: company?.product_name || 'Investment',
        product_profile: 'general',
        product_amount: Number(investmentAmount),
        address: kycForm.address || 'Not Provided',
        city: kycForm.city || 'Not Provided',
        postal_code: kycForm.postal_code || '1204',
        country: kycForm.country || 'Bangladesh'
      };

      console.log('Initiating payment with data:', requestData);

      const response = await axios.post(`${API_HOST}/api/payments/initiate/`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.data.gateway_url) {
        window.location.href = response.data.gateway_url;
      } else {
        throw new Error('Payment gateway URL not received');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      if (error.response) {
        if (error.response.status === 401) {
          authService.logout();
          setPaymentError('Session expired. Please log in again.');
        } else {
          const errorData = error.response.data;
          let errorMessage = 'Failed to initiate payment';

          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.details) {
              errorMessage += `: ${errorData.details}`;
            }
          }

          setPaymentError(errorMessage);
        }
      } else if (error.request) {
        setPaymentError('No response from server. Please try again.');
      } else {
        setPaymentError(error.message);
      }
      setPaymentProcessing(false);
    }
  };

  // Always call hooks first!
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [companyData, fundraiseTermsData] = await Promise.all([
          companyService.getCompanyById(id),
          companyService.getFundraiseTerms(id),
        ]);
        const data = companyData.data || companyData;
        setCompany(data);
        const terms = fundraiseTermsData?.results?.[0];
        if (!terms) {
          throw new Error('This company has not configured its investment terms yet.');
        }
        setFundraiseTerms(terms);
      } catch (err) {
        setError(err.response?.data?.detail || err.detail || err.message || 'Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const amount = new URLSearchParams(window.location.search).get('amount');
    if (amount) {
      setInvestmentAmount(amount);
    }
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const isStepValid = () => {
    switch (activeStep) {
      case 2:
        return allChecked;
      case 3:
        return isInvestmentValid();
      default:
        return true;
    }
  };

  // Fallback if no id is present
  if (!id) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          No company selected. Please access this page from a company deal link.
        </Typography>
      </Box>
    );
  }

  // Add a function to check if all declarations are accepted
  const areAllDeclarationsAccepted = () => {
    return kycForm.declaration && kycForm.termsAgreement && kycForm.verificationConsent;
  };

  const getStepContent = (step) => {
    const user = authService.getCurrentUser?.();

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    switch (step) {
      case 0:
        if (!user) {
          return (
            <Card elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
              <VerifiedUserIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Authentication Required
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please log in or create an account to proceed with your investment.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ minWidth: 200 }}
              >
                Login / Register
              </Button>
            </Card>
          );
        }
        if (kycStatusLoading) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          );
        }
        if (kycStatusError) {
          return (
            <Box maxWidth={600} mx="auto">
              <Alert severity="error" sx={{ mb: 2 }}>{kycStatusError}</Alert>
              <Button variant="contained" onClick={fetchKycStatus}>
                Retry KYC status check
              </Button>
            </Box>
          );
        }
        if (!kycCompleted) {
          if (showKycForm) {
            return (
              <Box maxWidth={600} mx="auto" textAlign="left">
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                  KYC/AML Verification
                </Typography>
                {kycSuccess ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    KYC submitted successfully! We will review your information soon.
                  </Alert>
                ) : (
                  <form onSubmit={handleKycSubmit} encType="multipart/form-data">
                    {/* Section 1: Personal Information */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Section 1: Personal Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={kycForm.name}
                            onChange={handleKycChange}
                            required
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={kycForm.email}
                            onChange={handleKycChange}
                            required
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={kycForm.phoneNumber}
                            onChange={handleKycChange}
                            required
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={kycForm.dateOfBirth}
                            onChange={handleKycChange}
                            required
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Residential Address
                          </Typography>
                          <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={kycForm.address}
                            onChange={handleKycChange}
                            required
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={kycForm.city}
                                onChange={handleKycChange}
                                required
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={kycForm.country}
                                onChange={handleKycChange}
                                required
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Section 2: Identity Verification */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Section 2: Identity Verification
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Upload any ONE of the following government-issued photo IDs:
                      </Typography>
                      <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <RadioGroup
                          name="idType"
                          value={kycForm.idType}
                          onChange={handleKycChange}
                          row
                        >
                          <FormControlLabel
                            value="passport"
                            control={<Radio />}
                            label="Passport"
                          />
                          <FormControlLabel
                            value="national_id"
                            control={<Radio />}
                            label="National ID Card"
                          />
                          <FormControlLabel
                            value="driver_license"
                            control={<Radio />}
                            label="Driver's License"
                          />
                        </RadioGroup>
                      </FormControl>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Upload ID Document
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{ width: '100%', py: 1.5 }}
                        >
                          Choose File
                          <input
                            type="file"
                            name="idDocument"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleKycChange}
                            required
                            hidden
                          />
                        </Button>
                        {kycForm.idDocument && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            Selected file: {kycForm.idDocument.name}
                          </Typography>
                        )}
                      </Box>
                    </Paper>

                    {/* Section 3: Proof of Address */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Section 3: Proof of Address
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Upload any ONE of the following documents (dated within the last 3 months):
                      </Typography>
                      <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <RadioGroup
                          name="addressProofType"
                          value={kycForm.addressProofType}
                          onChange={handleKycChange}
                          row
                        >
                          <FormControlLabel
                            value="utility_bill"
                            control={<Radio />}
                            label="Utility Bill"
                          />
                          <FormControlLabel
                            value="bank_statement"
                            control={<Radio />}
                            label="Bank Statement"
                          />
                          <FormControlLabel
                            value="government_correspondence"
                            control={<Radio />}
                            label="Government Correspondence"
                          />
                        </RadioGroup>
                      </FormControl>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Upload Proof of Address
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{ width: '100%', py: 1.5 }}
                        >
                          Choose File
                          <input
                            type="file"
                            name="addressProof"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleKycChange}
                            required
                            hidden
                          />
                        </Button>
                        {kycForm.addressProof && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            Selected file: {kycForm.addressProof.name}
                          </Typography>
                        )}
                      </Box>
                    </Paper>

                    {/* Section 4: Business Information */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Section 4: Business Information (if applicable)
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Business Name"
                            name="businessName"
                            value={kycForm.businessName}
                            onChange={handleKycChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Business Registration Number"
                            name="businessRegistrationNumber"
                            value={kycForm.businessRegistrationNumber}
                            onChange={handleKycChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Type of Entity
                          </Typography>
                          <FormControl component="fieldset">
                            <RadioGroup
                              name="entityType"
                              value={kycForm.entityType}
                              onChange={handleKycChange}
                              row
                            >
                              <FormControlLabel
                                value="sole_proprietor"
                                control={<Radio />}
                                label="Sole Proprietor"
                              />
                              <FormControlLabel
                                value="partnership"
                                control={<Radio />}
                                label="Partnership"
                              />
                              <FormControlLabel
                                value="corporation"
                                control={<Radio />}
                                label="Corporation"
                              />
                              <FormControlLabel
                                value="ngo"
                                control={<Radio />}
                                label="NGO"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Section 5: Source of Funds */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Section 5: Source of Funds
                      </Typography>
                      <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <RadioGroup
                          name="sourceOfFunds"
                          value={kycForm.sourceOfFunds}
                          onChange={handleKycChange}
                        >
                          <FormControlLabel
                            value="personal_savings"
                            control={<Radio />}
                            label="Personal Savings"
                          />
                          <FormControlLabel
                            value="business_income"
                            control={<Radio />}
                            label="Business Income"
                          />
                          <FormControlLabel
                            value="inheritance"
                            control={<Radio />}
                            label="Inheritance"
                          />
                          <FormControlLabel
                            value="other"
                            control={<Radio />}
                            label="Other"
                          />
                        </RadioGroup>
                      </FormControl>
                      {kycForm.sourceOfFunds === 'other' && (
                        <TextField
                          fullWidth
                          label="Specify Other Source"
                          name="otherSourceOfFunds"
                          value={kycForm.otherSourceOfFunds}
                          onChange={handleKycChange}
                          required
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Paper>

                    {/* Section 6: Declarations */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Section 6: Declarations
                      </Typography>
                      <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={kycForm.declaration}
                                onChange={(e) => setKycForm(prev => ({ ...prev, declaration: e.target.checked }))}
                                required
                              />
                            }
                            label="I confirm that the information provided is true and accurate."
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={kycForm.verificationConsent}
                                onChange={(e) => setKycForm(prev => ({ ...prev, verificationConsent: e.target.checked }))}
                                required
                              />
                            }
                            label="I authorize the platform to verify the information for KYC and AML (Anti-Money Laundering) purposes."
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={kycForm.termsAgreement}
                                onChange={(e) => setKycForm(prev => ({ ...prev, termsAgreement: e.target.checked }))}
                                required
                              />
                            }
                            label="I agree to the Terms of Service and Privacy Policy."
                          />
                        </FormGroup>
                      </FormControl>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Signature
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{ width: '100%', py: 1.5 }}
                        >
                          Upload Signature
                          <input
                            type="file"
                            name="signature"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleKycChange}
                            required
                            hidden
                          />
                        </Button>
                        {kycForm.signature && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            Selected file: {kycForm.signature.name}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Upload your digital signature or a scanned copy of your signature
                        </Typography>
                      </Box>
                    </Paper>

                    {kycError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {kycError}
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setShowKycForm(false)}
                        disabled={kycSubmitting}
                        sx={{ minWidth: 120 }}
                      >
                        Cancel
                      </Button>
                      {areAllDeclarationsAccepted() ? (
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={kycSubmitting}
                          sx={{
                            minWidth: 120,
                            opacity: 1,
                            transition: 'opacity 0.3s ease-in-out',
                          }}
                        >
                          {kycSubmitting ? (
                            <>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Submitting...
                            </>
                          ) : (
                            'Submit KYC'
                          )}
                        </Button>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.7,
                            fontStyle: 'italic'
                          }}
                        >
                          Please accept all declarations to proceed
                        </Typography>
                      )}
                    </Box>
                  </form>
                )}
              </Box>
            );
          }
          return (
            <Card elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
              <VerifiedUserIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                KYC Verification Required
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please complete the KYC/AML verification process to proceed with your investment.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowKycForm(true)}
                sx={{ minWidth: 200 }}
              >
                Start KYC Verification
              </Button>
            </Card>
          );
        }
        return (
          <Card elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Ready to Invest
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your account is verified and ready for investment.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              sx={{ minWidth: 200 }}
            >
              Continue
            </Button>
          </Card>
        );

      case 1:
        if (!company) {
          return (
            <Alert severity="error">
              Company information not found. Please try again later.
            </Alert>
          );
        }

        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Deal Details & Confirmation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Company Overview
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {company.product_name}: {company.quick_description}
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Investment Terms
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Investment Type</Typography>
                          <Typography variant="body1">{fundraiseTerms?.investment_type || 'N/A'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Raise Amount</Typography>
                          <Typography variant="body1">
                            {fundraiseTerms?.raise_amount !== undefined ?
                              `৳${Number(fundraiseTerms.raise_amount).toLocaleString()}` : 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                          <Typography variant="body1">{fundraiseTerms?.duration || 'N/A'}</Typography>
                        </Box>
                        {fundraiseTerms?.investment_type === 'equity' && (
                          <>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Pre-money Valuation</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.pre_money_valuation !== undefined ?
                                  `৳${Number(fundraiseTerms.pre_money_valuation).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Previous Investments</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.previous_investments !== undefined ?
                                  `৳${Number(fundraiseTerms.previous_investments).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Max Investors</Typography>
                              <Typography variant="body1">{fundraiseTerms?.max_investors || 'N/A'}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Min Investment</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.min_investment_amount !== undefined ?
                                  `৳${Number(fundraiseTerms.min_investment_amount).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Funding Committed Offline</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.funding_committed_offline !== undefined ?
                                  `৳${Number(fundraiseTerms.funding_committed_offline).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                          </>
                        )}
                        {fundraiseTerms?.investment_type === 'convertible debt' && (
                          <>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Pre-money Valuation</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.pre_money_valuation !== undefined ?
                                  `৳${Number(fundraiseTerms.pre_money_valuation).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Previous Investments</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.previous_investments !== undefined ?
                                  `৳${Number(fundraiseTerms.previous_investments).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Valuation Cap</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.valuation_cap_amount !== undefined ?
                                  `৳${Number(fundraiseTerms.valuation_cap_amount).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Convertible Note Discount</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.convertible_note_discount !== undefined ?
                                  `${fundraiseTerms.convertible_note_discount}%` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Max Investors</Typography>
                              <Typography variant="body1">{fundraiseTerms?.max_investors || 'N/A'}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Min Investment</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.min_investment_amount !== undefined ?
                                  `৳${Number(fundraiseTerms.min_investment_amount).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Funding Committed Offline</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.funding_committed_offline !== undefined ?
                                  `৳${Number(fundraiseTerms.funding_committed_offline).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                          </>
                        )}
                        {fundraiseTerms?.investment_type === 'debt' && (
                          <>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Annual Interest Rate</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.annual_interest_rate !== undefined ?
                                  `${fundraiseTerms.annual_interest_rate}%` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Repayment Term</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.repayment_term !== undefined ?
                                  `${fundraiseTerms.repayment_term} months` : 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Funding Committed Offline</Typography>
                              <Typography variant="body1">
                                {fundraiseTerms?.funding_committed_offline !== undefined ?
                                  `৳${Number(fundraiseTerms.funding_committed_offline).toLocaleString()}` : 'N/A'}
                              </Typography>
                            </Box>
                          </>
                        )}
                        {fundraiseTerms?.additional_terms && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Additional Terms</Typography>
                            <Typography variant="body1">{fundraiseTerms.additional_terms}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              {/*<Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Your Balance
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ mb: 1, color: 'success.main' }}>
                      ${user?.wallet_balance?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available for Investment
                    </Typography>
              </Box>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleNext}
                    sx={{ mt: 2 }}
                  >
                    Continue to Agreements
                  </Button>
                </Card>
              </Grid>*/}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Legal Agreements
            </Typography>
            <Card elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please review and agree to the following legally binding documents:
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.shareholder}
                      onChange={handleAgreementChange}
                      name="shareholder"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1">Shareholder Agreement</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Terms and conditions for becoming a shareholder
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.terms}
                      onChange={handleAgreementChange}
                      name="terms"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1">Investment Terms</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Specific terms of your investment
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.risk}
                      onChange={handleAgreementChange}
                      name="risk"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1">Risk Disclosures</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Important information about investment risks
                      </Typography>
                    </Box>
                  }
                />
              </Stack>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Investment Amount
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Enter Investment Amount
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Minimum investment: ৳{fundraiseTerms?.min_investment_amount?.toLocaleString() || 'N/A'}
                      {fundraiseTerms?.raise_amount &&
                        ` | Maximum investment: ৳${Number(fundraiseTerms.raise_amount).toLocaleString()}`}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Investment Amount"
                      type="number"
                      value={investmentAmount}
                      onChange={handleInvestmentChange}
                      error={!!investmentError}
                      helperText={investmentError}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>৳</Typography>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Investment Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary"><b>Company:</b></Typography>
                      <Typography variant="body1"> {company?.product_name}   <br /> {company?.quick_description} </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary"><b>Your Investment:</b></Typography>
                      <Typography variant="h6" color="primary.main">
                        ৳{Number(investmentAmount || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    {/*<Box>
                      <Typography variant="subtitle2" color="text.secondary">Available Balance</Typography>
                      <Typography variant="body1">
                        ${user?.wallet_balance?.toLocaleString() || '0'}
                      </Typography>
                    </Box>*/}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Payment
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Investment Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                      <Typography variant="body1">{company?.product_name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Investment Amount</Typography>
                      <Typography variant="h6" color="primary.main">
                        ৳{Number(investmentAmount).toLocaleString()}
                      </Typography>
                    </Box>
                    {paymentError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {paymentError}
                      </Alert>
                    )}
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                  {/*<Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Payment Method
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Available Balance
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      ${user?.wallet_balance?.toLocaleString() || '0'}
                    </Typography>
                  </Box>*/}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={initiatePayment}
                    disabled={paymentProcessing || !isInvestmentValid()}
                    sx={{ mt: 2 }}
                  >
                    {paymentProcessing ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Investment Confirmation
            </Typography>
            <Card elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
                Investment Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Your investment has been successfully processed.
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                    <Typography variant="body1">{paymentDetails?.company_name || company?.product_name}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Investment Amount</Typography>
                    <Typography variant="body1">
                      ${paymentDetails?.amount?.toLocaleString() || investmentAmount?.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Transaction Date</Typography>
                    <Typography variant="body1">{paymentDetails?.date || new Date().toLocaleDateString()}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Transaction ID</Typography>
                    <Typography variant="body1">{paymentDetails?.transaction_id || 'N/A'}</Typography>
                  </Card>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                A confirmation email has been sent to your registered email address.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/')}
                sx={{ minWidth: 200 }}
              >
                Return to Dashboard
              </Button>
            </Card>
          </Box>
        );

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: '#f5f7fa',
      py: 6,
      px: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 1000,
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        mb: 4
      }}>
        {/* Progress Bar */}
        <Box sx={{
          width: '100%',
          height: 4,
          bgcolor: '#f0f2f5',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${(activeStep + 1) * 20}%`,
            bgcolor: '#4a6cf7',
            transition: 'width 0.3s ease',
            borderRadius: '0 4px 4px 0'
          }
        }} />

        {/* Stepper */}
        <Box sx={{
          p: { xs: 2, md: 4 },
          borderBottom: '1px solid #f0f2f5'
        }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={null}
            sx={{
              '& .MuiStepLabel-label': {
                mt: 1,
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-active, &.Mui-completed': {
                  color: '#4a6cf7',
                  fontWeight: 600
                }
              },
              '& .MuiStepIcon-root': {
                color: '#e0e0e0',
                '&.Mui-active, &.Mui-completed': {
                  color: '#4a6cf7'
                },
                '& text': {
                  fill: 'white'
                }
              }
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    icon: index + 1,
                    classes: {
                      active: 'custom-active',
                      completed: 'custom-completed'
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{
          p: 3,
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f0f2f5',
          bgcolor: '#f9fafc'
        }}>
          <Box sx={{ flex: 1 }}>
            {activeStep > 0 && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{
                  color: '#4a6cf7',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(74, 108, 247, 0.05)'
                  }
                }}
              >
                Back
              </Button>
            )}
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {activeStep > 0 && activeStep < 4 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                disabled={activeStep === 2 ? !allChecked : false}
                sx={{
                  bgcolor: '#4a6cf7',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(74, 108, 247, 0.3)',
                  '&:hover': {
                    bgcolor: '#3a5bd9',
                    boxShadow: '0 6px 16px rgba(74, 108, 247, 0.4)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e',
                    boxShadow: 'none'
                  }
                }}
              >
                {activeStep === 1 ? 'Continue to Agreements' :
                  activeStep === 2 ? 'Continue to Payment' : 'Next'}
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default InvestmentFlow;
