# Comprehensive Authentication System - Civilio Platform

## Overview

This document outlines the complete role-based authentication system for the Civilio Smart City Governance Platform with three distinct user types: Citizens, Administrative Leaders, and Workers/Vendors.

## System Architecture

### User Types & Authentication Methods

#### 1. **Citizens**
- **Identification Requirements:**
  - Aadhar (12-digit national ID)
  - PAN (10-digit tax ID)
  - EPIC/Voter ID

- **Verification Process:**
  - User submits identification number via secure form
  - System hashes identification number (SHA-256)
  - Verification against government databases (manual + automated)
  - Email notification upon approval
  - Typical timeline: 24-48 hours

- **Database Table:** `citizen_verification`
- **Access:** Citizen Portal for grievance reporting and voting

#### 2. **Administrative Leaders**
- **Positions Supported:**
  - Chief Minister (CM)
  - District Magistrate (DM)
  - Deputy District Magistrate (DDM)
  - Mayor
  - Municipal Commissioner
  - Department Head

- **Verification Requirements:**
  - Full name and official email
  - Position and jurisdiction
  - Appointment letter number
  - Appointment date

- **Verification Process:**
  - Credentials matched against government appointment records
  - Senior admin verification required
  - 2-3 business days processing
  - System-level hierarchical validation

- **Database Table:** `leader_verification`
- **Access:** Admin Dashboard with role-based permissions

#### 3. **Workers & Vendors**
- **Worker Types:**
  - Vendor
  - Contractor
  - Department Staff
  - Field Worker

- **Verification Requirements:**
  - Full name and email
  - Appointment ID (unique municipal identifier)
  - Department and designation
  - Supervisor details
  - Official permission document (PDF/Image)

- **Document Requirements:**
  - Scanned appointment letter or municipal contract
  - Clear reproduction with all official stamps and signatures
  - Maximum file size: 5MB
  - Supported formats: PDF, JPG, PNG

- **Verification Process:**
  - Document reviewed by admin
  - Supervisor verification (optional automated email)
  - Permission date and expiry validation
  - 1-2 business days processing

- **Database Table:** `vendor_worker_verification`
- **Access:** Worker Portal for task management

## Database Schema

### New Tables Created

```sql
-- citizen_verification
- id, user_id, email, full_name, identification_type, identification_number
- identification_hash, phone_number, locality, is_verified, verification_timestamp

-- leader_verification
- id, user_id, email, full_name, position, jurisdiction
- appointment_letter_url, appointment_date, is_verified, verified_by_user_id

-- vendor_worker_verification
- id, user_id, email, full_name, worker_type, appointment_id
- permission_document_url, is_verified, verified_by_user_id

-- auth_audit_trail
- Comprehensive logging of all authentication events
- IP address, user agent, timestamps, success/failure reasons

-- user_sessions
- Session token management with expiry tracking
- Activity logging for security monitoring
```

## API Endpoints

### Authentication Routes

```
POST /api/auth/citizen
  - action: 'register' | 'login'
  - Citizen identification verification

POST /api/auth/leader
  - action: 'register' | 'login'
  - Leadership credential verification

POST /api/auth/worker
  - action: 'register' | 'login'
  - Worker/vendor credential verification

POST /api/auth/logout
  - Session termination and cookie clearing

GET /api/auth/verify
  - Session validation using session token cookie
```

### Authentication Flow

1. **Registration:**
   - User submits credentials/documents
   - System creates verification record (status: pending)
   - Audit trail entry created
   - User receives status email

2. **Verification (Admin):**
   - Admin reviews submitted credentials
   - Database validation performed
   - Status updated (verified/rejected)
   - User notified via email

3. **Login:**
   - User provides credentials
   - System checks verification status
   - If verified: Session created, cookie set
   - If pending: User informed of wait time
   - Audit trail logged

## Security Features

### Data Protection
- **Hashing:** SHA-256 for identification numbers
- **Encryption:** HTTPS/TLS for all transmissions
- **Cookies:** HTTP-only, secure, SameSite=Lax
- **Session Tokens:** Cryptographically secure 32-byte random tokens

### Session Management
- **Expiry:** 7 days for citizens, leaders; 24 hours configurable
- **Activity Tracking:** Last activity timestamp updated
- **Revocation:** Sessions can be manually invalidated
- **Logout:** Immediate session termination

### Audit Logging
- All login attempts logged (success/failure)
- Reason for failures recorded
- IP address and user agent captured
- Timestamps in UTC
- Retention: 90 days minimum

## Frontend Components

### Pages
- `/app/auth/portal` - Portal selection page
- `/app/auth/citizen` - Citizen login form
- `/app/auth/leader` - Leader login form
- `/app/auth/worker` - Worker login form

### Components
- `CitizenLoginForm` - Citizen registration/login
- `LeaderLoginForm` - Leader registration/login
- `WorkerLoginForm` - Worker registration/login
- `ProtectedRoute` - Route guard wrapper

## Integration with Existing Portals

### Citizen Portal
- Protected by ProtectedRoute component
- Requires: userType === 'citizen'
- Access to: Grievance form, tracking, voting

### Admin/Leadership Dashboard
- Protected routes for each position level
- Role-based feature access
- Jurisdiction-based data filtering

### Worker Portal
- Work order display
- Task completion reporting
- Progress tracking

## Configuration

### Environment Variables Required
```
DATABASE_URL=postgresql://...
NODE_ENV=production|development
```

### Cookie Settings
```
- Name: sessionToken
- HttpOnly: true
- Secure: true (production)
- SameSite: Lax
- MaxAge: 604800 seconds (7 days)
```

## User Flow Diagrams

### Citizen Registration & Login
```
1. User visits /auth/portal
2. Selects "Citizen"
3. Navigates to /auth/citizen
4. Chooses Register or Login
5. Submits verification form
6. System validates & creates record
7. Admin verifies (24-48 hours)
8. Upon approval: Can login
```

### Leader Verification
```
1. Leader visits /auth/leader
2. Fills appointment details
3. System validates appointment number
4. Senior admin manual review (2-3 days)
5. Upon approval: Full admin access
6. Session created with role info
```

### Worker Document Upload
```
1. Worker visits /auth/worker
2. Uploads permission document
3. Document hashed & stored
4. Admin reviews (1-2 days)
5. Supervisor email notification (optional)
6. Upon approval: Work order access
```

## Testing Checklist

- [ ] Citizen registration with Aadhar/PAN/EPIC
- [ ] Leader registration with appointment details
- [ ] Worker registration with document upload
- [ ] Session creation and cookie management
- [ ] Session expiry handling
- [ ] Logout functionality
- [ ] Protected route access control
- [ ] Audit trail logging
- [ ] Error handling for invalid credentials
- [ ] Timezone handling (UTC)
- [ ] Mobile responsiveness
- [ ] Dark mode support

## Maintenance & Monitoring

### Regular Tasks
- Monitor auth_audit_trail for suspicious patterns
- Validate session cleanup (expired sessions)
- Check document upload storage
- Review verification queue
- Performance monitoring on auth endpoints

### Security Updates
- Monitor for new identification verification requirements
- Update government database integration as needed
- Review and rotate session token generation parameters
- Audit cookie security settings

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS OTP for additional security
   - Email verification codes

2. **Social Login**
   - Government single sign-on (SSO) integration
   - Aadhaar/Bank linking

3. **Biometric Authentication**
   - Fingerprint for mobile access
   - Face recognition for high-security roles

4. **Role-Based Access Control (RBAC)**
   - Granular permission management
   - Dynamic role assignment

5. **Multi-Tenancy Support**
   - Different verification rules by municipality
   - Custom workflow approval chains
