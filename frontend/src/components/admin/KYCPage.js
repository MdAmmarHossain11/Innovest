import { API_HOST } from '../../config';
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, FormControl, Select, MenuItem, Button, Checkbox, CircularProgress, Alert, Grid, Divider, Avatar, InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';

function KYCPage() {
    const [kycRequests, setKycRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [companyTypeFilter, setCompanyTypeFilter] = useState('');
    const [selectedKyc, setSelectedKyc] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsData, setDetailsData] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const MEDIA_BASE_URL = `${API_HOST}/media/`;

    // Fetch KYC data from backend
    const fetchKycData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_HOST}/api/kyc/kyc/`);
            setKycRequests(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (err) {
            setError('Failed to fetch KYC data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycData();
    }, []);

    const handleView = (id) => {
        const kyc = kycRequests.find(req => req.id === id);
        setDetailsData(kyc);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setDetailsData(null);
    };

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_HOST}/api/kyc/kyc/${id}/`);
            setKycRequests(kycRequests.filter(req => req.id !== id));
            setSelectedKyc(selectedKyc.filter(selectedId => selectedId !== id));
            setSnackbarMsg('KYC record deleted successfully.');
            setSnackbarOpen(true);
        } catch (err) {
            setError('Failed to delete KYC record');
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedKyc(filteredRequests.map(req => req.id));
        } else {
            setSelectedKyc([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedKyc(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const handleBatchDelete = async () => {
        try {
            await Promise.all(selectedKyc.map(id => axios.delete(`${API_HOST}/api/kyc/kyc/${id}/`)));
            setKycRequests(kycRequests.filter(req => !selectedKyc.includes(req.id)));
            setSelectedKyc([]);
            setSnackbarMsg('Selected KYC records deleted successfully.');
            setSnackbarOpen(true);
        } catch (err) {
            setError('Failed to delete selected KYC records');
        }
    };

    const handleRefresh = () => {
        fetchKycData();
        setSelectedKyc([]);
    };

    // Get unique company names for filter dropdown
    const companyNames = Array.from(new Set(kycRequests.map(req => req.business_name || ''))).filter(Boolean);

    // Filter and search logic
    const filteredRequests = kycRequests.filter(req => {
        const matchesSearch =
            (req.name && req.name.toLowerCase().includes(search.toLowerCase())) ||
            (req.business_name && req.business_name.toLowerCase().includes(search.toLowerCase())) ||
            (req.company_name && req.company_name.toLowerCase().includes(search.toLowerCase())) ||
            (req.email && req.email.toLowerCase().includes(search.toLowerCase()));
        const matchesCompany = !companyFilter || req.business_name === companyFilter;
        const matchesIndustry = !companyTypeFilter || req.industry === companyTypeFilter;
        return matchesSearch && matchesCompany && matchesIndustry;
    });

    function getFileIcon(filePath) {
        if (!filePath) return null;
        const ext = filePath.split('.').pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return <Avatar src={MEDIA_BASE_URL + filePath.split('media/').pop()} variant="rounded" sx={{ width: 48, height: 48 }} />;
        if (ext === "pdf") return <PictureAsPdfIcon color="error" fontSize="large" />;
        return <InsertDriveFileIcon color="action" fontSize="large" />;
    }

    function getFilePreview(filePath) {
        if (!filePath) return null;
        const ext = filePath.split('.').pop().toLowerCase();
        const url = MEDIA_BASE_URL + filePath.split('media/').pop();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
            return <img src={url} alt="Preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, marginTop: 8 }} />;
        }
        if (ext === "pdf") {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    <PictureAsPdfIcon color="error" sx={{ fontSize: 60 }} />
                    <Typography variant="caption" sx={{ mt: 1, color: '#888' }}>
                        Click "View" to open PDF
                    </Typography>
                </Box>
            );
        }
        return null;
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6">
                    KYC Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton onClick={handleRefresh} title="Refresh">
                        <RefreshIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                        {filteredRequests.length} kyc
                    </Typography>
                    {selectedKyc.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleBatchDelete}
                            startIcon={<DeleteIcon />}
                        >
                            Delete Selected ({selectedKyc.length})
                        </Button>
                    )}
                </Box>
            </Box>
            {/* Search and Filter UI */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Search by user, company, or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
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
                {/*<FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select
                        value={companyTypeFilter}
                        displayEmpty
                        onChange={e => setCompanyTypeFilter(e.target.value)}
                        sx={{ borderRadius: 2, background: '#fff' }}
                    >
                        <MenuItem value="">Select Industry</MenuItem>
                        <MenuItem value="Technology">Technology</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                        <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                        <MenuItem value="Retail">Retail</MenuItem>
                        <MenuItem value="Education">Education</MenuItem>
                        <MenuItem value="Food">Food</MenuItem>
                        <MenuItem value="Pet Care">Pet Care</MenuItem>
                        <MenuItem value="Transportation">Transportation</MenuItem>
                        <MenuItem value="Hospitality">Hospitality</MenuItem>
                        <MenuItem value="Real Estate">Real Estate</MenuItem>
                        <MenuItem value="Agriculture">Agriculture</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>*/}
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedKyc.length > 0 && selectedKyc.length < filteredRequests.length}
                                        checked={filteredRequests.length > 0 && selectedKyc.length === filteredRequests.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Submit At</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No KYC requests found</TableCell>
                                </TableRow>
                            ) : (
                                filteredRequests.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedKyc.includes(req.id)}
                                                onChange={() => handleSelectOne(req.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">Name: <b>{req.name}</b></Typography>
                                            <Typography variant="body2">Email: {req.email}</Typography>
                                            <Typography variant="body2" color="text.secondary">Phone: {req.phone_number}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2"><b>{req.company_name}</b></Typography>
                                            {/*<Typography variant="body2">Industry: {req.industry}</Typography>*/}
                                        </TableCell>
                                        <TableCell>{req.submitted_at ? new Date(req.submitted_at).toLocaleString() : ''}</TableCell>
                                        <TableCell>
                                            <Tooltip title="View">
                                                <IconButton color="primary" onClick={() => handleView(req.id)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDeleteClick(req.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* Details Dialog */}
            <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: '#233876', pb: 1 }}>KYC Details</DialogTitle>
                <DialogContent dividers sx={{ background: '#f7f9fb' }}>
                    {detailsData && (
                        <Box>
                            <Grid container spacing={3}>
                                {/* Personal Info */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#233876', mb: 1 }}>Personal Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography><b>User Name:</b> {detailsData.name}</Typography>
                                    <Typography><b>Email:</b> {detailsData.email}</Typography>
                                    <Typography><b>Phone:</b> {detailsData.phone_number}</Typography>
                                    <Typography><b>Date of Birth:</b> {detailsData.date_of_birth}</Typography>
                                    <Typography><b>Address:</b> {detailsData.address}</Typography>
                                    <Typography><b>City:</b> {detailsData.city}</Typography>
                                    <Typography><b>Country:</b> {detailsData.country}</Typography>
                                </Grid>
                                {/* Company Info */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#233876', mb: 1 }}>Company Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography><b>Company Name:</b> {detailsData.company_name}</Typography>
                                    <Typography><b>Business Name:</b> {detailsData.business_name}</Typography>
                                    <Typography><b>Business Registration Number:</b> {detailsData.business_registration_number}</Typography>
                                    <Typography><b>Entity Type:</b> {detailsData.entity_type}</Typography>
                                    <Typography><b>Source of Funds:</b> {detailsData.source_of_funds}</Typography>
                                    <Typography><b>Declaration:</b> {detailsData.declaration}</Typography>
                                    <Typography><b>Submitted At:</b> {detailsData.submitted_at ? new Date(detailsData.submitted_at).toLocaleString() : ''}</Typography>
                                </Grid>
                                {/* Document Info */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ color: '#233876', mt: 3, mb: 1 }}>Documents</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ width: 220, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', p: 2, background: '#fff', borderRadius: 2, boxShadow: 1, mx: 'auto' }}>
                                                {getFileIcon(detailsData.id_document_path)}
                                                <Typography sx={{ mt: 1, fontWeight: 500 }}>ID Document</Typography>
                                                {detailsData.id_document_path && (
                                                    <a href={detailsData.id_document_path ? MEDIA_BASE_URL + detailsData.id_document_path.split('media/').pop() : '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#233876', fontWeight: 600, marginTop: 4 }}>View</a>
                                                )}
                                                {getFilePreview(detailsData.id_document_path)}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ width: 220, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', p: 2, background: '#fff', borderRadius: 2, boxShadow: 1, mx: 'auto' }}>
                                                {getFileIcon(detailsData.address_proof_path)}
                                                <Typography sx={{ mt: 1, fontWeight: 500 }}>Address Proof</Typography>
                                                {detailsData.address_proof_path && (
                                                    <a href={detailsData.address_proof_path ? MEDIA_BASE_URL + detailsData.address_proof_path.split('media/').pop() : '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#233876', fontWeight: 600, marginTop: 4 }}>View</a>
                                                )}
                                                {getFilePreview(detailsData.address_proof_path)}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ width: 220, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', p: 2, background: '#fff', borderRadius: 2, boxShadow: 1, mx: 'auto' }}>
                                                {getFileIcon(detailsData.signature_path)}
                                                <Typography sx={{ mt: 1, fontWeight: 500 }}>Signature</Typography>
                                                {detailsData.signature_path && (
                                                    <a href={detailsData.signature_path ? MEDIA_BASE_URL + detailsData.signature_path.split('media/').pop() : '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#233876', fontWeight: 600, marginTop: 4 }}>View</a>
                                                )}
                                                {getFilePreview(detailsData.signature_path)}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} sx={{ fontWeight: 600, color: '#233876' }}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, minWidth: 340 }}>
                    <Box sx={{ background: '#ffeaea', borderRadius: '50%', p: 2, mb: 2 }}>
                        <DeleteIcon sx={{ color: '#e53935', fontSize: 48 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Are you Sure ?</Typography>
                    <Typography sx={{ mb: 3, color: '#555' }}>Are you Sure You want to Delete this Account ?</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ fontWeight: 600 }}
                            onClick={async () => {
                                await handleDelete(deleteTargetId);
                                setDeleteConfirmOpen(false);
                            }}
                        >
                            Yes, Delete It!
                        </Button>
                    </Box>
                </Box>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMsg}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}

export default KYCPage; 
