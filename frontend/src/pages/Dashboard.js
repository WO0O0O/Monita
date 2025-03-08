import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  CircularProgress 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TimerIcon from '@mui/icons-material/Timer';
import { getWebsites, getDashboardStats } from '../services/api';

function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [stats, setStats] = useState({
    total_websites: 0,
    websites_up: 0,
    websites_down: 0,
    avg_response_time: 0,
    last_updated: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate website stats we still need to display
  const totalWebsites = stats.total_websites;
  const websitesUp = stats.websites_up;
  const websitesDown = stats.websites_down;

  // Load website data and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch websites and dashboard stats in parallel
        const [websitesData, statsData] = await Promise.all([
          getWebsites(),
          getDashboardStats()
        ]);
        
        setWebsites(websitesData);
        setStats(statsData);
        setError(null);
        console.log('Dashboard updated:', new Date().toLocaleTimeString());
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 15 seconds
    const interval = setInterval(fetchData, 15000);
    
    return () => clearInterval(interval);
  }, []);

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
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Status Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography variant="h6" component="div">
              Total Websites
            </Typography>
            <Typography variant="h3" component="div">
              {loading ? <CircularProgress size={40} color="inherit" /> : totalWebsites}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.main',
              color: 'white',
            }}
          >
            <Typography variant="h6" component="div">
              Websites Up
            </Typography>
            <Typography variant="h3" component="div">
              {loading ? <CircularProgress size={40} color="inherit" /> : websitesUp}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: websitesDown > 0 ? 'error.main' : 'text.secondary',
              color: 'white',
            }}
          >
            <Typography variant="h6" component="div">
              Websites Down
            </Typography>
            <Typography variant="h3" component="div">
              {loading ? <CircularProgress size={40} color="inherit" /> : websitesDown}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Website Status Cards */}
      <Typography variant="h5" component="h2" gutterBottom>
        Website Status
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          {error}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {websites.map((website) => (
            <Grid item xs={12} sm={6} md={4} key={website.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {website.name}
                    </Typography>
                    {renderStatusChip(website)}
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {website.url}
                  </Typography>
                  
                  {website.latest_status && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Response Time: {website.latest_status.response_time_ms}ms
                      </Typography>
                      <Typography variant="body2">
                        Last Checked: {website.latest_status.last_checked ? new Date(website.latest_status.last_checked).toLocaleString() : 'Pending'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/websites/${website.id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Show message when no websites */}
      {!loading && websites.length === 0 && (
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
    </Box>
  );
}

export default Dashboard;
