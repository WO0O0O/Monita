import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TimerIcon from '@mui/icons-material/Timer';
import { getWebsites, deleteWebsite } from '../services/api';

function WebsiteList() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // Load website data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getWebsites();
        setWebsites(data);
        setError(null);
      } catch (err) {
        setError('Failed to load websites. Please try again later.');
        console.error('Error fetching websites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle delete website dialog
  const openDeleteDialog = (website) => {
    setWebsiteToDelete(website);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setWebsiteToDelete(null);
  };

  // Handle delete website
  const handleDeleteWebsite = async () => {
    if (!websiteToDelete) return;

    try {
      setDeleteInProgress(true);
      await deleteWebsite(websiteToDelete.id);
      
      // Update state to remove the deleted website
      setWebsites(websites.filter(w => w.id !== websiteToDelete.id));
      
      closeDeleteDialog();
    } catch (err) {
      setError(`Failed to delete website: ${err.message}`);
      console.error('Error deleting website:', err);
    } finally {
      setDeleteInProgress(false);
    }
  };

  // Render status chip
  const renderStatusChip = (website) => {
    if (!website.latest_status) {
      return <Chip 
        icon={<TimerIcon />} 
        label="Pending" 
        color="default" 
        size="small" 
      />;
    }
    
    return website.latest_status.is_up 
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Monitored Websites
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/add-website"
          sx={{ ml: 2 }}
        >
          Add Website
        </Button>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Websites table */}
          {websites.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="websites table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Check Interval</TableCell>
                    <TableCell>Last Check</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {websites.map((website) => (
                    <TableRow
                      key={website.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Link to={`/websites/${website.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {website.name}
                        </Link>
                      </TableCell>
                      <TableCell>{website.url}</TableCell>
                      <TableCell>{renderStatusChip(website)}</TableCell>
                      <TableCell>{website.check_interval_minutes} minutes</TableCell>
                      <TableCell>
                        {website.latest_status?.checked_at 
                          ? new Date(website.latest_status.checked_at).toLocaleString() 
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={Link}
                          to={`/websites/${website.id}/edit`}
                          aria-label="edit"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() => openDeleteDialog(website)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                No websites found. Start by adding a website to monitor.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/add-website" 
                sx={{ mt: 2 }}
              >
                Add Website
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Website
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{websiteToDelete?.name}"? 
            This action cannot be undone and all monitoring history will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleteInProgress}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteWebsite} 
            color="error" 
            disabled={deleteInProgress}
            startIcon={deleteInProgress ? <CircularProgress size={20} /> : null}
          >
            {deleteInProgress ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WebsiteList;
