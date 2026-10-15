import axios from 'axios';
import { API_URL, API_HOST } from '../config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add withCredentials for CORS
    withCredentials: true
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('Response Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return Promise.reject(error);
    }
);

const getCompanies = async (params = {}) => {
    try {
        console.log('Fetching companies with params:', params);
        // If user parameter is provided, use my-companies endpoint
        const endpoint = params.user ? 'my-companies/' : 'companies/';
        const response = await axiosInstance.get(endpoint, { params });
        console.log('API Response:', response.data);
        
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching companies:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch companies');
    }
};

const getCompanyById = async (id) => {
    try {
        console.log(`Fetching company with ID: ${id}`);
        //const response = await axiosInstance.get(`companies/${id}/`);

        const response = await axiosInstance.get(`companies/${id}/`);
        console.log('Raw API Response:', response);
        console.log('Response Data:', response.data);
        console.log('Response Status:', response.status);
        
        // Check if we have a response with data
        if (response.data) {
            return response.data;
        }
        throw new Error('No data received from server');
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Company not found');
        }
        console.error('Error fetching company:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
        });
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch company details');
    }
};

const getBusinessPlan = async (companyId) => {
    try {
        console.log('Fetching business plan for company:', companyId);
        const response = await axiosInstance.get(`business-plans/?company_id=${companyId}`);
        console.log('Business plan response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching business plan:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error.response?.data || error.message;
    }
};

const getFundraiseTerms = async (companyId) => {
    try {
        console.log('Fetching fundraise terms for company:', companyId);
        const response = await axiosInstance.get(`fundraise-terms/?company_id=${companyId}`);
        console.log('Fundraise terms response:', response.data);
        
        if (response.data && response.data.results) {
            return response.data;
        }
        return { results: [] };
    } catch (error) {
        console.error('Error fetching fundraise terms:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error.response?.data || error;
    }
};

const createCompany = (data) => axiosInstance.post('companies/', data);
const createFundraiseTerms = (data) => axiosInstance.post('fundraise-terms/', data);
const createBusinessPlan = (data) => axiosInstance.post('business-plans/', data);

const createCompanyForm = (formData) =>
    axiosInstance.post('my-companies/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).catch(error => {
      console.error('Company creation error:', {
        data: formData,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    });
  
  const deleteCompany = (id) => axiosInstance.delete(`my-companies/${id}/`);
  
  // Track Progress & Company Update
  const getTrackProgress = (companyId) =>
    axiosInstance.get('track-progress/', { params: { company_id: companyId } });
  
  const createTrackProgress = (data) =>
    axiosInstance.post('track-progress/', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  
  const updateTrackProgress = (id, data) =>
    axiosInstance.put(`track-progress/${id}/`, data);
  
  const getCompanyUpdates = (companyId) =>
    axiosInstance.get('company-update/', { params: { company_id: companyId } });
  
  const createCompanyUpdate = (data) =>
    axiosInstance.post('company-update/', data);
  
  const updateCompanyUpdate = (id, data) =>
    axiosInstance.put(`company-update/${id}/`, data);
  
const getCompanyPayments = async (companyId) => {
    try {
        console.log('Fetching payments for company:', companyId);
        const response = await axiosInstance.get(`companies/${companyId}/total_payments/`);
        console.log('Payments response:', response.data);
        
        if (response.data && response.data.status === 'success') {
            return response.data;
        }
        return { status: 'success', total: 0 };
    } catch (error) {
        console.error('Error fetching company payments:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return { status: 'success', total: 0 };
    }
};

const getUserPayments = async (companyId) => {
    try {
        console.log('Fetching user payments for company:', companyId);
        const response = await axiosInstance.get(`companies/${companyId}/user_payments/`);
        console.log('User payments response:', response.data);
        
        // The backend returns an array of payments directly
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching user payments:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return [];
    }
};

const getPaidInvestorsCount = async (companyId) => {
    try {
        console.log('Fetching paid investors count for company:', companyId);
        const response = await axiosInstance.get(`companies/${companyId}/paid_investors_count/`);
        console.log('Paid investors count response:', response.data);
        
        if (response.data && response.data.status === 'success') {
            return response.data.count;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching paid investors count:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return 0;
    }
};

// Upload an image file
const uploadImage = async (formData) => {
    try {
        const response = await axios.post(
            `${API_HOST}/api/upload-image/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const companyService = {
    getCompanies,
    getCompanyById,
    getBusinessPlan,
    uploadImage,
    getFundraiseTerms,
    getCompanyPayments,
    getUserPayments,
    createCompany,
    createCompanyForm,
    createFundraiseTerms,
    createBusinessPlan,
    deleteCompany,
    // Track Progress & Company Update
    getTrackProgress,
    createTrackProgress,
    updateTrackProgress,
    getCompanyUpdates,
    createCompanyUpdate,
    updateCompanyUpdate,
    getPaidInvestorsCount,
};

export default companyService; 
