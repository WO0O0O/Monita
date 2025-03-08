import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WebsiteForm from '../components/WebsiteForm';
import { getWebsite, updateWebsite } from '../services/api';

function EditWebsite() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [website, setWebsite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch website data
  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setIsLoading(true);
        const data = await getWebsite(id);
        setWebsite(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching website:', err);
        setError('Failed to load website details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsite();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await updateWebsite(id, formData);
      
      // Redirect to website details page after successful update
      navigate(`/websites/${id}`, { 
        state: { message: 'Website updated successfully!' } 
      });
    } catch (err) {
      console.error('Error updating website:', err);
      setError('Failed to update website. Please try again.');
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
        Edit Website
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error && !website ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : !website ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Website not found.
        </Alert>
      ) : (
        <WebsiteForm 
          website={website}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </Box>
  );
}

export default EditWebsite;
