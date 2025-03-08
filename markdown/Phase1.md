## Phase 1: MVP (Minimum Viable Product)

**Goal**: Create a basic working prototype that can monitor websites and show their status.

### Database Schema

```
Websites Table:
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- url (TEXT)
- check_interval_minutes (INTEGER)
- created_at (TIMESTAMP)
- is_active (BOOLEAN)

Checks Table:
- id (INTEGER PRIMARY KEY)
- website_id (INTEGER, FOREIGN KEY)
- status_code (INTEGER)
- response_time_ms (INTEGER)
- is_up (BOOLEAN)
- checked_at (TIMESTAMP)
- error_message (TEXT, nullable)
```

### Backend Components (Flask)

1. **API Endpoints**:
   - `GET /api/websites` - List all monitored websites
   - `POST /api/websites` - Add a new website to monitor
   - `GET /api/websites/<id>` - Get details of a specific website
   - `PUT /api/websites/<id>` - Update website monitoring settings
   - `DELETE /api/websites/<id>` - Remove a website from monitoring
   - `GET /api/websites/<id>/status` - Get current status and recent history
   - `GET /api/websites/<id>/checks` - Get check history for a website

2. **Database Connection Layer**:
   - SQLite connection management
   - Data access methods for websites and checks

3. **Monitoring Scheduler**:
   - Basic implementation to trigger Lambda function

### Lambda Function

1. **Monitoring Logic**:
   - Fetch list of active websites from database
   - Check each website's status (using requests library)
   - Record results in the database
   - Simple status change detection

### Frontend (React.js with Material UI)

1. **Dashboard Page**:
   - List of monitored websites with current status
   - Basic up/down indicators
   - Last checked timestamp

2. **Website Management**:
   - Form to add new websites
   - Edit/delete existing monitoring configurations

### Deployment

1. **Development Environment**:
   - Local setup instructions
   - Environment variables configuration

2. **Production Deployment**:
   - Flask backend deployment guide
   - Lambda function deployment
   - Frontend deployment to Netlify/Vercel