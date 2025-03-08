import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getWebsite, getWebsiteStatus, getWebsiteChecks } from '../services/api';

function WebsiteDetail() {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  // Fetch website details and status
  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        setLoading(true);
        
        // First fetch the website details
        const websiteData = await getWebsite(id);
        setWebsite(websiteData);
        
        // Then fetch the status information
        const statusData = await getWebsiteStatus(id);
        // Update status information
        setChecks(statusData.history || []);
        
        // Update the website with the latest status
        setWebsite(prevWebsite => ({
          ...prevWebsite,
          latest_status: {
            is_up: statusData.status === 'up',
            response_time: statusData.response_time_ms,
            status_code: statusData.status_code,
            last_checked: statusData.last_checked
          }
        }));
        
        setError(null);
      } catch (err) {
        setError('Failed to load website details. Please try again later.');
        console.error('Error fetching website data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchWebsiteData, 30000);
    
    return () => clearInterval(interval);
  }, [id]);

  // Handle pagination change
  const handleChangePage = async (event, newPage) => {
    try {
      setLoading(true);
      const result = await getWebsiteChecks(id, newPage + 1, rowsPerPage);
      setChecks(result.checks || []);
      setPagination(result.pagination || { total: 0, pages: 0 });
      setPage(newPage);
    } catch (err) {
      setError('Failed to load check history. Please try again later.');
      console.error('Error fetching website checks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    try {
      setLoading(true);
      const result = await getWebsiteChecks(id, 1, newRowsPerPage);
      setChecks(result.checks || []);
      setPagination(result.pagination || { total: 0, pages: 0 });
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    } catch (err) {
      setError('Failed to load check history. Please try again later.');
      console.error('Error fetching website checks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render status chip
  const renderStatusChip = (isUp) => {
    return isUp 
      ? <Chip 
          icon={<CheckCircleIcon />} 
          label="Up" 
          color="success" 
          size="small" 
        />
      : <Chip 
          icon={<ErrorIcon />} 
          label="Down" 
          color="error" 
          size="small" 
        />;
  };

  // Loading state
  if (loading && !website) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && !website) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Not found state
  if (!website && !loading) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Website not found.
        </Alert>
        <Button
          component={Link}
          to="/websites"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Websites
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top navigation bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          component={Link}
          to="/websites"
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back to Websites
        </Button>
        <Button
          component={Link}
          to={`/websites/${id}/edit`}
          startIcon={<EditIcon />}
          variant="outlined"
        >
          Edit Website
        </Button>
      </Box>

      {/* Website information */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {website?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>URL:</strong> <a href={website?.url} target="_blank" rel="noopener noreferrer">{website?.url}</a>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Check Interval:</strong> {website?.check_interval_minutes} minutes
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> {website?.latest_status ? (
                renderStatusChip(website.latest_status.is_up)
              ) : 'Pending'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {website?.latest_status && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Latest Check
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status Code:</strong> {website.latest_status.status_code || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Response Time:</strong> {website.latest_status.response_time_ms}ms
                  </Typography>
                  <Typography variant="body2">
                    <strong>Checked At:</strong> {website.latest_status.last_checked ? new Date(website.latest_status.last_checked).toLocaleString() : 'Pending'}
                  </Typography>
                  {website.latest_status.error_message && (
                    <Typography variant="body2" color="error">
                      <strong>Error:</strong> {website.latest_status.error_message}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Check history */}
      <Typography variant="h5" component="h2" gutterBottom>
        Check History
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && website ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {checks.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="check history table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Status Code</TableCell>
                      <TableCell>Response Time</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checks.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>{new Date(check.checked_at).toLocaleString()}</TableCell>
                        <TableCell>{renderStatusChip(check.is_up)}</TableCell>
                        <TableCell>{check.status_code || 'N/A'}</TableCell>
                        <TableCell>{check.response_time_ms}ms</TableCell>
                        <TableCell>{check.error_message || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={pagination.total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No check history available yet.
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

export default WebsiteDetail;
