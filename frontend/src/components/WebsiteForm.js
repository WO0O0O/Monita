import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const WebsiteForm = ({ website, onSubmit, isSubmitting, error }) => {
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState({
    name: '',
    url: '',
    check_interval_minutes: 5,
    is_active: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Initialize form with website data if editing
  useEffect(() => {
    if (website) {
      setFormValues({
        name: website.name || '',
        url: website.url || '',
        check_interval_minutes: website.check_interval_minutes || 5,
        is_active: website.is_active !== undefined ? website.is_active : true
      });
    }
  }, [website]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle slider change for check interval
  const handleSliderChange = (event, newValue) => {
    setFormValues({
      ...formValues,
      check_interval_minutes: newValue
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formValues.url.trim()) {
      errors.url = 'URL is required';
    } else {
      try {
        new URL(formValues.url);
      } catch (error) {
        errors.url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Form title */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              {website ? 'Edit Website' : 'Add New Website'}
            </Typography>
          </Grid>

          {/* Display any API errors */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {/* Website name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name || 'Enter a descriptive name for this website'}
              disabled={isSubmitting}
              required
            />
          </Grid>

          {/* Website URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website URL"
              name="url"
              value={formValues.url}
              onChange={handleInputChange}
              error={!!formErrors.url}
              helperText={formErrors.url || 'Enter the full URL including http:// or https://'}
              placeholder="https://example.com"
              disabled={isSubmitting}
              required
            />
          </Grid>

          {/* Check interval */}
          <Grid item xs={12}>
            <Typography id="check-interval-slider" gutterBottom>
              Check Interval: {formValues.check_interval_minutes} minutes
            </Typography>
            <Slider
              value={formValues.check_interval_minutes}
              onChange={handleSliderChange}
              aria-labelledby="check-interval-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={60}
              disabled={isSubmitting}
            />
            <Typography variant="caption" color="text.secondary">
              How often should we check if this website is up
            </Typography>
          </Grid>

          {/* Is active switch */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.is_active}
                  onChange={handleInputChange}
                  name="is_active"
                  color="primary"
                  disabled={isSubmitting}
                />
              }
              label="Monitoring Active"
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Turn monitoring on or off for this website
            </Typography>
          </Grid>

          {/* Submit and cancel buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate(-1)}
                startIcon={<CancelIcon />}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isSubmitting ? <CircularProgress size={24} /> : <SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default WebsiteForm;
