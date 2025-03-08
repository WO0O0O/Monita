import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function Settings() {
  // In a real application, these would be loaded from an API or context
  const [settings, setSettings] = useState({
    emailNotifications: true,
    emailAddress: '',
    smsNotifications: false,
    phoneNumber: '',
    darkMode: false,
    checkInterval: 5
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real app, this would save to an API
    console.log('Settings saved:', settings);
    setSaved(true);
  };

  const handleCloseSnackbar = () => {
    setSaved(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Settings will be saved locally for now. In a future update, these will be stored on the server.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  name="emailNotifications"
                />
              }
              label="Email Notifications"
            />
            
            {settings.emailNotifications && (
              <TextField
                fullWidth
                label="Email Address"
                name="emailAddress"
                value={settings.emailAddress}
                onChange={handleChange}
                margin="normal"
                type="email"
                helperText="We'll send alerts to this email address"
              />
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                  name="smsNotifications"
                />
              }
              label="SMS Notifications"
            />
            
            {settings.smsNotifications && (
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={settings.phoneNumber}
                onChange={handleChange}
                margin="normal"
                helperText="Include country code (e.g., +1 for US)"
              />
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Display Settings
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.darkMode}
                  onChange={handleChange}
                  name="darkMode"
                />
              }
              label="Dark Mode"
            />
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Default Website Settings
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Default Check Interval (minutes)"
              name="checkInterval"
              value={settings.checkInterval}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 1, max: 60 }}
              margin="normal"
            />
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar
        open={saved}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Settings saved successfully"
      />
    </Box>
  );
}

export default Settings;
