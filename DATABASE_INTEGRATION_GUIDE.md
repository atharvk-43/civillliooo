# Civilio Database & API Integration Guide

## Overview

Civilio now features real-time database integration with **Neon PostgreSQL** and automated email notifications. All forms submit directly to the database, enabling live tracking and governance transparency.

## Environment Variables

Add the following environment variables to your `.env.local` or Vercel project:

```
# Database Connection (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# Application Environment
NEXT_PUBLIC_APP_ENV=production

# Email Configuration (Grievance Notifications)
GRIEVANCE_EMAIL=grievances@civilio.city

# Email Configuration (Work Order Notifications)
WORK_ORDER_EMAIL=workorders@civilio.city

# SMTP Server Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Database Setup

### 1. Initialize Neon Database

1. Create a Neon project at [console.neon.tech](https://console.neon.tech)
2. Get your connection string and set it as `DATABASE_URL`
3. Run all database migrations:

```bash
# Execute migration scripts in order
node scripts/01-create-grievances-table.sql
node scripts/02-create-audit-logs-table.sql
node scripts/03-create-kpi-snapshots-table.sql
node scripts/04-create-work-orders-table.sql
node scripts/05-create-budgets-table.sql
node scripts/06-create-expenditures-table.sql
node scripts/07-create-assets-table.sql
node scripts/08-create-maintenance-schedules-table.sql
node scripts/09-create-purchase-orders-table.sql
node scripts/10-create-vendors-table.sql
node scripts/11-create-employees-table.sql
node scripts/12-create-permits-table.sql
node scripts/13-create-licenses-table.sql
```

### 2. Email Configuration

#### Using Gmail:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the 16-character app password as `SMTP_PASSWORD`

#### Using SendGrid:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
```

#### Using AWS SES:
```
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASSWORD=your-ses-password
```

## API Endpoints

### Grievances

#### Create Grievance
```bash
POST /api/grievances
Content-Type: application/json

{
  "citizenName": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91-9876543210",
  "category": "Road & Infrastructure",
  "title": "Pothole on Main Street",
  "description": "Large pothole causing vehicle damage",
  "location": "Main Street, Downtown",
  "priority": "high",
  "zone": "Downtown"
}

Response:
{
  "success": true,
  "data": {
    "id": "12345",
    "status": "pending",
    "created_at": "2024-02-03T10:30:00Z"
  },
  "message": "Grievance submitted successfully. Confirmation email sent."
}
```

#### Get Grievances
```bash
# Get all grievances (paginated)
GET /api/grievances?limit=50&offset=0

# Get grievances by email
GET /api/grievances?email=citizen@example.com

Response:
{
  "success": true,
  "data": [...],
  "count": 5
}
```

#### Update Grievance Status
```bash
PATCH /api/grievances
Content-Type: application/json

{
  "grievanceId": "12345",
  "status": "in-progress",
  "notes": "Work team assigned and en route",
  "email": "citizen@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": "12345",
    "status": "in-progress",
    "updated_at": "2024-02-03T11:00:00Z"
  }
}
```

### Work Orders

#### Create Work Order
```bash
POST /api/work-orders
Content-Type: application/json

{
  "title": "Repair Pothole on Main Street",
  "description": "Fill and seal pothole",
  "priority": "high",
  "location": "Main Street, Downtown",
  "estimatedHours": 4,
  "estimatedCost": 2500,
  "vendorId": "vendor-123",
  "workerEmail": "worker@vendor.com",
  "grievanceId": "grievance-456",
  "assignedBy": "admin@city.gov"
}

Response:
{
  "success": true,
  "data": {
    "id": "wo-789",
    "status": "assigned",
    "due_date": "2024-02-10",
    "created_at": "2024-02-03T10:30:00Z"
  }
}
```

#### Get Work Orders by Vendor
```bash
GET /api/work-orders?vendorId=vendor-123

Response:
{
  "success": true,
  "data": [...],
  "count": 3
}
```

#### Update Work Order Status
```bash
PATCH /api/work-orders
Content-Type: application/json

{
  "workOrderId": "wo-789",
  "status": "completed",
  "completionNotes": "Pothole successfully repaired",
  "actualCost": 2400,
  "citizenEmail": "citizen@example.com",
  "grievanceTitle": "Pothole on Main Street"
}

Response:
{
  "success": true,
  "data": {
    "id": "wo-789",
    "status": "completed",
    "completion_notes": "Pothole successfully repaired"
  }
}
```

### Feedback

#### Submit Feedback
```bash
POST /api/feedback
Content-Type: application/json

{
  "grievanceId": "grievance-456",
  "rating": 5,
  "comment": "Excellent response and professional work",
  "citizenEmail": "citizen@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": "feedback-123",
    "created_at": "2024-02-03T15:00:00Z"
  }
}
```

#### Get Feedback for Grievance
```bash
GET /api/feedback?grievanceId=grievance-456

Response:
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### Audit Trail

#### Get Audit Trail
```bash
GET /api/audit-trail?grievanceId=grievance-456

Response:
{
  "success": true,
  "data": [
    {
      "id": "audit-1",
      "action": "grievance_created",
      "actor": "citizen@example.com",
      "details": "Grievance submitted",
      "created_at": "2024-02-03T10:30:00Z"
    }
  ]
}
```

#### Create Audit Log Entry
```bash
POST /api/audit-trail
Content-Type: application/json

{
  "grievanceId": "grievance-456",
  "action": "status_updated",
  "actor": "admin@city.gov",
  "details": "Status changed to in-review"
}
```

## Database Schema

### Grievances Table
```sql
CREATE TABLE grievances (
  id SERIAL PRIMARY KEY,
  citizen_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Work Orders Table
```sql
CREATE TABLE work_orders (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  location VARCHAR(255) NOT NULL,
  estimated_hours NUMERIC,
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  vendor_id VARCHAR(255) NOT NULL,
  grievance_id INTEGER,
  assigned_by VARCHAR(255),
  status VARCHAR(50) DEFAULT 'assigned',
  due_date TIMESTAMP NOT NULL,
  completion_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  grievance_id INTEGER,
  work_order_id INTEGER,
  action VARCHAR(100) NOT NULL,
  actor VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Real-Time Features

### Automatic Features

1. **Grievance Submission**
   - Form validates and submits to `/api/grievances`
   - Database creates record with unique ID
   - Confirmation email sent automatically
   - Audit log created

2. **Status Updates**
   - When status changes, audit log entry created
   - Citizen receives email notification
   - Complete history visible on dashboard

3. **Work Order Assignment**
   - Worker receives email notification
   - 7-day deadline automatically set
   - Overdue orders tracked and flagged

4. **Feedback Tracking**
   - Ratings stored in database
   - Community sentiment captured
   - Affects admin performance scores

## Frontend Integration

### Grievance Form
The `GrievanceForm` component automatically:
- Validates input
- Submits to `/api/grievances` 
- Displays grievance ID on success
- Sends confirmation email

### Work Order Dashboard
The `WorkerDashboard` component fetches:
- Assigned work orders from `/api/work-orders`
- Updates status in real-time
- Shows completion deadline

### Governance Dashboard
The `ParticipationDashboard` component displays:
- Impact metrics (resolution rate, community engagement)
- Audit trail from `/api/audit-trail`
- Feedback ratings from `/api/feedback`

## Monitoring & Debugging

### Check Logs
```bash
# View database operations
tail -f logs/database.log

# View email sending
tail -f logs/email.log
```

### Test Email Configuration
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Database Health Check
```sql
SELECT COUNT(*) FROM grievances;
SELECT COUNT(*) FROM work_orders WHERE status = 'pending';
SELECT COUNT(*) FROM audit_logs;
```

## Performance Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_grievances_email ON grievances(email);
   CREATE INDEX idx_grievances_status ON grievances(status);
   CREATE INDEX idx_work_orders_vendor ON work_orders(vendor_id);
   ```

2. **Connection Pooling**
   - Neon handles connection pooling automatically
   - Use transaction pooling for high-volume operations

3. **Caching**
   - Frequently accessed data cached with SWR
   - Audit trails cached for dashboard performance

## Troubleshooting

### Common Issues

**"Cannot connect to database"**
- Verify `DATABASE_URL` is correct
- Check Neon project status
- Ensure IP whitelist includes deployment server

**"Email not sending"**
- Verify SMTP credentials
- Check email account 2FA disabled or app password generated
- Verify SMTP_PORT (usually 587 for TLS, 465 for SSL)

**"API returns 500 error"**
- Check database connection
- Review error logs for specific database errors
- Verify all migration scripts have been executed

**"Status not updating in real-time"**
- Confirm PATCH request is reaching the API
- Check database update permissions
- Verify email notification configuration

## Support

For issues or questions:
1. Check logs with verbose output: `DEBUG=* npm run dev`
2. Review database status in Neon console
3. Test API endpoints with cURL or Postman
4. Enable database query logging for debugging
