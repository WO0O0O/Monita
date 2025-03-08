## Phase 2: Enhanced Monitoring & Notifications

**Goal**: Add notification capabilities and improve monitoring features.

### Database Schema Additions

```
Users Table (Simple):
- id (INTEGER PRIMARY KEY)
- email (TEXT)
- phone (TEXT, nullable)
- created_at (TIMESTAMP)

Notifications Table:
- id (INTEGER PRIMARY KEY)
- website_id (INTEGER, FOREIGN KEY)
- user_id (INTEGER, FOREIGN KEY)
- type (TEXT) - 'email' or 'sms'
- status (TEXT) - 'pending', 'sent', 'failed'
- message (TEXT)
- created_at (TIMESTAMP)
- sent_at (TIMESTAMP, nullable)

Website_User Table:
- website_id (INTEGER, FOREIGN KEY)
- user_id (INTEGER, FOREIGN KEY)
- PRIMARY KEY (website_id, user_id)
```

### Backend Enhancements

1. **Notification Service**:
   - Email sending capability (SMTP or service like SendGrid)
   - SMS integration with Twilio
   - Notification templates for different events

2. **Enhanced API Endpoints**:
   - `POST /api/users` - Add a user for notifications
   - `PUT /api/users/<id>` - Update user contact info
   - `POST /api/websites/<id>/subscribe` - Subscribe user to site notifications
   - `GET /api/notifications` - View notification history

3. **Status Change Detection**:
   - More sophisticated logic to detect status changes
   - Debounce mechanisms to prevent notification storms

### Lambda Function Enhancements

1. **Smarter Monitoring**:
   - Respect individual website check intervals
   - Handle redirects and SSL errors more intelligently
   - Capture more detailed error information

2. **Notification Triggering**:
   - Detect status changes that require notification
   - Call notification endpoints on the Flask API

### Frontend Enhancements

1. **Notification Management**:
   - User contact information management
   - Website subscription settings
   - Notification history view

2. **Enhanced Dashboard**:
   - Status change indicators
   - Basic uptime percentage calculation
   - Simple filtering and sorting options