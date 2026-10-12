import { API_HOST } from '../../config';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Button, 
  Alert,
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import authService from '../../services/authService';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const status = params.get('status') || (
          location.pathname === '/payment/cancel' ? 'CANCELLED' : 'FAILED'
        );
        const tranId = params.get('tran_id');
        
        // Get payment info from localStorage
        const storedPaymentInfo = localStorage.getItem('payment_info');
        let paymentInfo = null;
        
        if (storedPaymentInfo) {
          try {
            paymentInfo = JSON.parse(storedPaymentInfo);
            
            // Fetch company details
            try {
              const token = authService.getToken();
              const companyResponse = await axios.get(
                `${API_HOST}/api/companies/${paymentInfo.company_id}/`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              // Store payment info in sessionStorage with company name
              sessionStorage.setItem('payment_success_info', JSON.stringify({
                ...paymentInfo,
                transaction_id: tranId,
                status: status,
                date: new Date().toLocaleDateString(),
                company_name: companyResponse.data.product_name
              }));
            } catch (error) {
              console.error('Error fetching company details:', error);
              // Store without company name if fetch fails
              sessionStorage.setItem('payment_success_info', JSON.stringify({
                ...paymentInfo,
                transaction_id: tranId,
                status: status,
                date: new Date().toLocaleDateString()
              }));
            }
            
            // Clear the stored payment info after retrieving it
            localStorage.removeItem('payment_info');
          } catch (error) {
            console.error('Error parsing stored payment info:', error);
          }
        }

        // If no stored info, try URL parameters
        if (!paymentInfo) {
          paymentInfo = {
            investment_id: params.get('investment_id'),
            amount: params.get('amount')
          };
        }
        
        const { investment_id: investmentId, amount } = paymentInfo || {};
        
        console.log('Payment Parameters:', { status, tranId, investmentId, amount });

        // Validate required parameters
        if (!investmentId || !amount) {
          console.error('Missing required payment information:', { investmentId, amount });
          setVerificationError('Missing required payment information. Please contact support.');
          setStatus('error');
          return;
        }

        // Set transaction details
        setTransactionDetails({
          transactionId: tranId || 'N/A',
          investmentId: investmentId,
          amount: amount
        });

        if (status !== 'VALID') {
          const cancelled = status === 'CANCELLED';
          setStatus(cancelled ? 'warning' : 'error');
          setMessage(cancelled ? 'Payment was cancelled.' : 'Payment failed. Please try again.');
          if (investmentId) {
            navigate(`/invest/company/${investmentId}?status=${status}&amount=${encodeURIComponent(amount)}`);
          }
          return;
        }

        // Verify payment with backend
        const token = authService.getToken();
        if (!token) {
          throw new Error('Authentication required');
        }

        try {
          // Verify the payment
          console.log('Verifying payment with transaction ID:', tranId);
          const verifyResponse = await axios.post(
            `${API_HOST}/api/payments/verify_payment/`,
            {
              transaction_id: tranId,
              status: status,
              company_id: investmentId,
              amount: parseFloat(amount)
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Payment verification response:', verifyResponse.data);

          // Update UI based on status
          if (status === 'VALID') {
            setStatus('success');
            setMessage('Payment completed successfully!');
            // Navigate to investment flow with success status
            if (investmentId) {
              navigate(`/invest/company/${investmentId}?status=VALID&tran_id=${tranId}&amount=${encodeURIComponent(amount)}`);
            }
          } else if (status === 'FAILED') {
            setStatus('error');
            setMessage('Payment failed. Please try again.');
            if (investmentId) {
              navigate(`/invest/company/${investmentId}?status=FAILED&tran_id=${tranId}&amount=${encodeURIComponent(amount)}`);
            }
          } else if (status === 'CANCELLED') {
            setStatus('warning');
            setMessage('Payment was cancelled.');
            if (investmentId) {
              navigate(`/invest/company/${investmentId}?status=CANCELLED&tran_id=${tranId}&amount=${encodeURIComponent(amount)}`);
            }
          }
        } catch (error) {
          console.error('Payment verification error:', error.response?.data || error.message);
          setVerificationError(error.response?.data?.message || error.message);
          setStatus('error');
          setMessage('Failed to process payment. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error.response?.data || error.message);
        setVerificationError(error.response?.data?.message || error.message || 'Failed to verify payment');
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    };

    verifyPayment();
  }, [navigate, location]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />;
      case 'error':
        return <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />;
      case 'warning':
        return <WarningAmberIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />;
      default:
        return <CircularProgress size={60} sx={{ mb: 3 }} />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Payment Successful!',
          description: 'Your investment has been processed successfully.',
          details: verificationError ? 
            `Payment recorded but with a warning: ${verificationError}` : 
            'You will receive a confirmation email shortly with all the details of your investment.'
        };
      case 'error':
        return {
          title: 'Payment Failed',
          description: 'We were unable to process your payment.',
          details: verificationError || 'Please check your payment details and try again. If the problem persists, contact our support team.'
        };
      case 'warning':
        return {
          title: 'Payment Cancelled',
          description: 'Your payment was cancelled.',
          details: 'You can try again when you\'re ready to complete your investment.'
        };
      default:
        return {
          title: 'Processing Payment',
          description: 'Please wait while we confirm your payment.',
          details: 'This may take a few moments...'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        {getStatusIcon()}
        
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          {statusInfo.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {statusInfo.description}
        </Typography>

        {transactionDetails && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Transaction Details
              </Typography>
              {transactionDetails.transactionId && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Transaction ID: {transactionDetails.transactionId}
                </Typography>
              )}
              {transactionDetails.amount && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Amount: ৳${Number(transactionDetails.amount).toLocaleString()}
                </Typography>
              )}
            </Box>
          </>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {statusInfo.details}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ minWidth: 120 }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ minWidth: 120 }}
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PaymentSuccess;