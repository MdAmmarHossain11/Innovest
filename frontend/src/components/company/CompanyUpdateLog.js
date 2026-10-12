import { API_HOST } from '../../config';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TextField, InputAdornment, MenuItem, FormControl, Select, Card, CardContent, CardActions } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import companyService from '../../services/companyService';

const KPI_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Valuation > 0', value: 'valuation' },
  { label: 'Revenue Rate > 0', value: 'revenue' },
  { label: 'Burn Rate > 0', value: 'burn' },
  { label: 'Retention Rate > 0', value: 'retention' },
];

const CompanyUpdateLog = ({ open, onClose, company }) => {
  const [updates, setUpdates] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewRow, setViewRow] = useState(null);
  const [search, setSearch] = useState('');
  const [kpiFilter, setKpiFilter] = useState('');

  const fetchData = () => {
    if (company) {
      setLoading(true);
      setError('');
      Promise.all([
        companyService.getCompanyUpdates(company.id),
        companyService.getTrackProgress(company.id)
      ])
        .then(([updatesRes, progressRes]) => {
          const updates = updatesRes.data?.results || [];
          const progresses = progressRes.data?.results || [];
          setUpdates(updates);
          setProgresses(progresses);
        })
        .catch(() => setError('Failed to fetch update log'))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (open && company) {
      fetchData();
    } else {
      setUpdates([]);
      setProgresses([]);
      setError('');
    }
    // eslint-disable-next-line
  }, [open, company]);

  // Helper: find the closest progress entry by created_at for an update
  const findClosestProgress = (update) => {
    if (!progresses.length) return null;
    const updateTime = new Date(update.created_at).getTime();
    let closest = null;
    let minDiff = Infinity;
    for (const prog of progresses) {
      const progTime = new Date(prog.created_at).getTime();
      const diff = Math.abs(updateTime - progTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = prog;
      }
    }
    return closest;
  };

  // Filtered updates
  const filteredUpdates = updates.filter(update => {
    const progress = findClosestProgress(update);
    const searchText = (update.title || '') + ' ' + (progress?.notice || '');
    const matchesSearch = searchText.toLowerCase().includes(search.toLowerCase());
    let matchesKpi = true;
    if (kpiFilter && progress) {
      if (kpiFilter === 'valuation') matchesKpi = Number(progress.current_company_valuation) > 0;
      if (kpiFilter === 'revenue') matchesKpi = Number(progress.revenue_rate) > 0;
      if (kpiFilter === 'burn') matchesKpi = Number(progress.burn_rate) > 0;
      if (kpiFilter === 'retention') matchesKpi = Number(progress.retention_rate) > 0;
    }
    return matchesSearch && matchesKpi;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Helper to determine file type
  const isImage = (filename) => /\.(jpg|jpeg|png|gif)$/i.test(filename);
  const isPdf = (filename) => /\.pdf$/i.test(filename);

  // Helper to get the correct file URL
  const getFileUrl = (file) => {
    // Always extract the filename and use the investment_documents path
    const filename = file.split('/').pop().split('\\').pop();
    return `${API_HOST}/media/investment_documents/${filename}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DescriptionIcon color="info" sx={{ mr: 1 }} /> Update Log
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Company Update Log</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton onClick={fetchData} title="Refresh">
              <RefreshIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              {filteredUpdates.length} updates
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search by title or notice..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { background: '#f7f9fb', borderRadius: 2 }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={kpiFilter}
              displayEmpty
              onChange={e => setKpiFilter(e.target.value)}
              sx={{ borderRadius: 2, background: '#fff' }}
              startAdornment={<FilterAltIcon sx={{ mr: 1 }} />}
            >
              {KPI_FILTERS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : filteredUpdates.length === 0 ? (
          <Typography color="text.secondary">No updates found for this company.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title (Notice & Title)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company KPIs</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUpdates.map((update, idx) => {
                const progress = findClosestProgress(update);
                return (
                  <TableRow key={update.id || idx}>
                    <TableCell>
                      <Typography fontWeight={600}>
                        <span style={{ fontWeight: 700 }}>Title:</span> {update.title || 'No Title'}
                      </Typography>
                      {progress?.notice && (
                        <Typography variant="body2" color="text.secondary">
                          <span style={{ fontWeight: 700 }}>Notice:</span> {progress.notice}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {progress ? (
                        <>
                          <Typography variant="body2">Valuation: <b>{progress.current_company_valuation ?? '-'}</b></Typography>
                          <Typography variant="body2">Revenue Rate: <b>{progress.revenue_rate ?? '-'}</b></Typography>
                          <Typography variant="body2">Burn Rate: <b>{progress.burn_rate ?? '-'}</b></Typography>
                          <Typography variant="body2">Retention Rate: <b>{progress.retention_rate ?? '-'}</b></Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No KPIs</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {update.created_at ? new Date(update.created_at).toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => setViewRow({ update, progress })}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button>
      </DialogActions>
      {/* View Details Dialog */}
      <Dialog open={!!viewRow} onClose={() => setViewRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
          <DescriptionIcon color="info" sx={{ mr: 1 }} /> Update Details
        </DialogTitle>
        <DialogContent dividers sx={{ background: '#f7f9fb' }}>
          {viewRow && (
            <Box>
              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}><b>Title</b></Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>{viewRow.update.title || 'No Title'}</Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}><b>Notice</b></Typography>
                  <Typography sx={{ mb: 2 }}>{viewRow.progress?.notice || '-'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}><b>KPIs</b></Typography>
                  <Typography>Valuation: <b>{viewRow.progress?.current_company_valuation ?? '-'}</b></Typography>
                  <Typography>Revenue Rate: <b>{viewRow.progress?.revenue_rate ?? '-'}</b></Typography>
                  <Typography>Burn Rate: <b>{viewRow.progress?.burn_rate ?? '-'}</b></Typography>
                  <Typography>Retention Rate: <b>{viewRow.progress?.retention_rate ?? '-'}</b></Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2, color: 'primary.main' }}>Created At</Typography>
                  <Typography>{viewRow.update.created_at ? new Date(viewRow.update.created_at).toLocaleString() : ''}</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}><b>Investment Documents</b></Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {viewRow.progress?.investment_documents ? (
                    viewRow.progress.investment_documents.split(',').map((file, idx) => {
                      file = file.trim();
                      if (!file) return null;
                      const isImg = isImage(file);
                      const isPdfFile = isPdf(file);
                      return (
                        <Card key={idx} sx={{ width: 240, m: 1, boxShadow: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                            {isImg ? (
                              <img src={getFileUrl(file)} alt={file} style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 12, borderRadius: 8, background: '#f7f9fb' }} />
                            ) : isPdfFile ? (
                              <PictureAsPdfIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                            ) : (
                              <InsertDriveFileIcon color="action" sx={{ fontSize: 64, mb: 2 }} />
                            )}
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, wordBreak: 'break-all', textAlign: 'center' }}>{file.split('/').pop().split('\\').pop()}</Typography>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                            <Button
                              variant="contained"
                              size="small"
                              href={getFileUrl(file)}
                              target="_blank"
                              sx={{ borderRadius: 2, fontWeight: 600, background: '#233876', '&:hover': { background: '#1a285a' } }}
                            >
                              View
                            </Button>
                          </CardActions>
                        </Card>
                      );
                    })
                  ) : (
                    <Typography color="text.secondary">No documents found.</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRow(null)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CompanyUpdateLog; 