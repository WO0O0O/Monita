import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Help() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Help & Documentation
      </Typography>
      
      <Typography variant="body1" paragraph>
        Welcome to UpMon - the Website Uptime Monitoring System. This guide will help you get
        started and make the most of the monitoring features.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          UpMon allows you to monitor the uptime and performance of your websites.
          Follow these simple steps to start monitoring your first website:
        </Typography>
        <ol>
          <li>
            <Typography variant="body1" paragraph>
              Click on <strong>Add Website</strong> in the sidebar menu or from the dashboard.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              Enter the website details including a name, the full URL (including https://), and the check interval.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              Click <strong>Save</strong> to begin monitoring your website.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              UpMon will start checking your website at the specified interval and report its status on the dashboard.
            </Typography>
          </li>
        </ol>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Frequently Asked Questions
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">How often does UpMon check my websites?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              You can configure the check interval for each website individually. The minimum interval is 1 minute,
              and the default is 5 minutes. For most websites, a 5-10 minute interval provides a good balance
              between timely alerts and resource usage.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">How are notifications sent?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              UpMon can send notifications via email and SMS when a website goes down or recovers.
              You can configure your notification preferences in the Settings page. Make sure to add
              your email address and/or phone number to receive alerts.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">What counts as "down" for a website?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              A website is considered "down" if any of the following occur during a check:
              <ul>
                <li>The HTTP request fails to connect</li>
                <li>The server returns a status code of 400 or higher</li>
                <li>The request times out (default timeout is 30 seconds)</li>
              </ul>
              For websites that normally return non-200 status codes, you may need to configure specific
              status code rules in a future update.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">How much history does UpMon retain?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              UpMon stores the complete history of all checks performed on your websites. This allows
              you to review historical uptime and performance data to identify patterns or issues.
              In future updates, there will be options to configure data retention policies.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Typography variant="h5" gutterBottom>
        Contact Support
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" paragraph>
          If you need additional help or have any questions, please reach out to our support team:
        </Typography>
        
        <Typography variant="body1">
          Email: <Link href="mailto:support@upmon-example.com">support@upmon-example.com</Link>
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="textSecondary">
          UpMon Version 1.0.0 - Developed by CS Student
        </Typography>
      </Paper>
    </Box>
  );
}

export default Help;
