import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WebsiteForm from '../components/WebsiteForm';
import { createWebsite } from '../services/api';

function AddWebsite() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const newWebsite = await createWebsite(formData);
      
      // Redirect to website details page after successful creation
      navigate(`/websites/${newWebsite.id}`, { 
        state: { message: 'Website added successfully!' } 
      });
    } catch (err) {
      console.error('Error creating website:', err);
      setError('Failed to add website. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Button
          component="button"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Website
      </Typography>
      
      <WebsiteForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </Box>
  );
}

export default AddWebsite;
