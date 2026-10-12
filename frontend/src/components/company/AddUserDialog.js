import { API_HOST } from '../../config';
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, Autocomplete, Box, Typography, Divider, Avatar, CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import authService from '../../services/authService';
import axios from 'axios';
import companyService from '../../services/companyService';

const AddUserDialog = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({ name: null, company: null, paymentMethod: 'cash' });
  const [loading, setLoading] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [minInvestment, setMinInvestment] = useState(null);
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (open) {
      const fetchCompanies = async () => {
        setCompanyLoading(true);
        try {
          const user = authService.getCurrentUser();
          const userId = user?.id || user?.user_id || user?.pk;
          const token = user?.access;
          const response = await axios.get(`${API_HOST}/api/my-companies/`, {
            params: { user: userId, company_status: 'Approved' },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const companies = Array.isArray(response.data) ? response.data : response.data.data || [];
          setCompanyOptions(companies.map(c => ({ label: c.product_name, value: c.id, icon: <BusinessIcon sx={{ color: '#43a047' }} /> })));
        } catch (err) {
          setCompanyOptions([]);
        } finally {
          setCompanyLoading(false);
        }
      };
      fetchCompanies();
    }
  }, [open]);

  useEffect(() => {
    if (form.company) {
      const fetchUsers = async () => {
        setUserLoading(true);
        try {
          const user = authService.getCurrentUser();
          const token = user?.access;
          const response = await axios.get(`${API_HOST}/api/company-permission/users/`, {
            params: { company: form.company.value, permission: 'yes' },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const users = Array.isArray(response.data) ? response.data : response.data.data || [];
          setUserOptions(users.map(u => ({ label: `${u.name} (${u.email})`, value: u.id, icon: <PersonIcon sx={{ color: '#1976d2' }} /> })));
        } catch (err) {
          setUserOptions([]);
        } finally {
          setUserLoading(false);
        }
      };
      setForm(f => ({ ...f, name: null })); // Clear user if company changes
      fetchUsers();
    } else {
      setUserOptions([]);
      setForm(f => ({ ...f, name: null }));
    }
  }, [form.company]);

  useEffect(() => {
    if (form.company) {
      // Fetch min_investment_amount for the selected company
      (async () => {
        try {
          const fundraise = await companyService.getFundraiseTerms(form.company.value);
          const min = fundraise?.results?.[0]?.min_investment_amount;
          setMinInvestment(min ? Number(min) : null);
        } catch (err) {
          setMinInvestment(null);
        }
      })();
    } else {
      setMinInvestment(null);
    }
  }, [form.company]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserChange = (event, newValue) => {
    setForm({ ...form, name: newValue });
  };

  const handleCompanyChange = (event, newValue) => {
    setForm({ ...form, company: newValue });
  };

  const handleSubmit = async () => {
    setAmountError('');
    if (minInvestment !== null && Number(form.amount) < minInvestment) {
      setAmountError(`Amount must be at least ${minInvestment}`);
      return;
    }
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    setForm({ name: null, company: null, paymentMethod: 'cash' });
    onClose();
  };

  const handleCancel = () => {
    setForm({ name: null, company: null, paymentMethod: 'cash' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 0 } }}>
      <DialogTitle sx={{ bgcolor: '#f7f9fb', color: '#233876', fontWeight: 700, fontSize: 22, pb: 1, textAlign: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        Add User
      </DialogTitle>
      <DialogContent dividers sx={{ background: '#f7f9fb', p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#233876', mb: 1 }}>
            Company
          </Typography>
          {companyLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Autocomplete
              options={companyOptions}
              value={form.company}
              onChange={handleCompanyChange}
              getOptionLabel={(option) => option?.label || ''}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option.icon}
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Company Name" margin="normal" fullWidth sx={{ bgcolor: '#fff', borderRadius: 2 }} />
              )}
            />
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#233876', mb: 1 }}>
            User Information
          </Typography>
          {userLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Autocomplete
              options={userOptions}
              value={form.name}
              onChange={handleUserChange}
              getOptionLabel={(option) => option?.label || ''}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option.icon}
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="User Name & Email" margin="normal" fullWidth sx={{ bgcolor: '#fff', borderRadius: 2 }} />
              )}
            />
          )}
        </Box>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount || ''}
          onChange={e => {
            const val = e.target.value;
            if (val === '' || Number(val) >= 0) {
              setForm({ ...form, amount: val });
              setAmountError('');
            }
          }}
          fullWidth
          margin="normal"
          sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
          inputProps={{ min: minInvestment !== null ? minInvestment : 0 }}
          error={!!amountError}
          helperText={amountError || (minInvestment !== null ? `Minimum Amount: ${minInvestment}` : '')}
        />
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#233876', mb: 1 }}>
            Payment Method
          </Typography>
          <RadioGroup
            row
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel value="cheque" control={<Radio />} label="Cheque" />
          </RadioGroup>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, background: '#f7f9fb', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <Button onClick={handleCancel} disabled={loading} sx={{ fontWeight: 600, borderRadius: 2 }}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !form.amount || (minInvestment !== null && Number(form.amount) < minInvestment)} 
          sx={{ fontWeight: 600, borderRadius: 2, background: '#233876', '&:hover': { background: '#1a285a' } }}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog; 