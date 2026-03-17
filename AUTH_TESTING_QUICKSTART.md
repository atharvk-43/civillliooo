# Authentication System - Testing & Quick Start Guide

## Getting Started

### 1. Access the Authentication Portal
Navigate to `/login` on the Civilio platform. You'll see three authentication options:

#### Citizen Authentication (Citizens)
- **Route:** `/auth/citizen`
- **Required Fields:**
  - Full Name: Any name
  - Email: Valid email address
  - Identification Type: Select Aadhar, PAN, or Voter ID
  - Identification Number: 12-digit Aadhar, 10-digit PAN, or 10-digit EPIC
  - Locality (Optional): Your locality/ward
  - Phone Number (Optional): Contact number

- **Verification Timeline:** 24-48 hours (manual review)
- **Access Upon Approval:** Citizen Portal with grievance reporting

#### Leader Authentication (Administrative Officials)
- **Route:** `/auth/leader`
- **Required Fields:**
  - Full Name: Official name
  - Email: Government email address
  - Position: Chief Minister, District Magistrate, Deputy DM, Mayor, Municipal Commissioner, or Department Head
  - Appointment Letter Number: Official reference number
  - Appointment Date: When appointed to position
  - Phone Number (Optional): Official contact

- **Verification Timeline:** 2-3 business days (senior admin review)
- **Access Upon Approval:** Administrative Dashboard with role-based permissions

#### Worker/Vendor Authentication
- **Route:** `/auth/worker`
- **Required Fields:**
  - Full Name: Official name from documents
  - Email: Work email address
  - Worker Type: Vendor, Contractor, Department Staff, or Field Worker
  - Appointment ID: Unique municipal identifier
  - Department: Department name
  - Designation: Job title
  - Municipality: Issuing municipality
  - Permission Document: Upload PDF/JPG/PNG (max 5MB)
    - Should contain official stamps and signatures
  - Supervisor Name (Optional): Supervisor's name
  - Supervisor Email (Optional): Supervisor's contact

- **Verification Timeline:** 1-2 business days (document review)
- **Access Upon Approval:** Worker Portal for task management

## Testing Scenarios

### Test Citizen Registration
1. Go to `/auth/citizen`
2. Enter:
   - Full Name: "Test Citizen"
   - Email: "test.citizen@example.com"
   - ID Type: "aadhar"
   - ID Number: "123456789012"
3. Click "Register for Verification"
4. Expected: Confirmation with status "pending"

### Test Leader Registration
1. Go to `/auth/leader`
2. Enter:
   - Full Name: "Test DM"
   - Email: "test.dm@government.in"
   - Position: "district_magistrate"
   - Letter Number: "DM/2024/001"
   - Appointment Date: "2024-01-01"
3. Click "Register for Verification"
4. Expected: Status shows as "pending_verification"

### Test Worker Registration
1. Go to `/auth/worker`
2. Enter all required fields
3. Upload a test document (any PDF or image)
4. Click "Submit for Verification"
5. Expected: Success message with status "pending"

## API Endpoints

### POST `/api/auth/citizen`
Register or login a citizen user.

**Request:**
```json
{
  "action": "register",
  "fullName": "John Doe",
  "email": "john@example.com",
  "identificationType": "aadhar",
  "identificationNumber": "123456789012",
  "locality": "North Ward",
  "phoneNumber": "9876543210"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "userId": "CITIZEN-1234567-abc123",
    "verificationStatus": "pending",
    "estimatedApprovalTime": "24-48 hours"
  }
}
```

### POST `/api/auth/leader`
Register or login a leader.

**Request:**
```json
{
  "action": "register",
  "fullName": "District Magistrate Name",
  "email": "dm@government.in",
  "adminPosition": "district_magistrate",
  "appointmentLetterNumber": "DM/2024/001",
  "appointmentDate": "2024-01-15"
}
```

### POST `/api/auth/worker`
Register a worker with document upload.

**Request (FormData):**
- fullName: string
- email: string
- workerType: string
- appointmentId: string
- municipality: string
- department: string
- designation: string
- appointmentDocument: File (PDF/JPG/PNG)

## Security Features

### Data Protection
- ✅ Sensitive data (ID numbers) hashed with SHA-256
- ✅ HTTP-only secure cookies (7-day expiry)
- ✅ CSRF protection on forms
- ✅ Rate limiting on authentication endpoints
- ✅ Complete audit trail logging

### Session Management
- Sessions stored server-side (secure cookies)
- Automatic expiry after 7 days
- Session validation on every protected route
- IP address and user agent tracking
- Logout clears all session data

## Verification Statuses

1. **Pending** - Awaiting admin review
2. **Verified** - Successfully authenticated, access granted
3. **Rejected** - Credentials could not be verified, user notified
4. **Expired** - Verification period lapsed without review

## Integration Points

### Protected Routes
All portals check session tokens before granting access:
- `/citizen-portal` - Requires citizen verification
- `/citizen-leader/dashboard` - Requires leader verification
- `/worker/dashboard` - Requires worker verification

### User Context
The `useUser()` hook provides:
```typescript
{
  role: 'citizen' | 'leader' | 'worker',
  userId: string,
  adminProfile?: AdminProfile,
  login: (role, userId, profile) => void,
  logout: () => void,
  hasPermission: (permission) => boolean
}
```

## Troubleshooting

### "This identification number is already registered"
- The ID number has been used before
- Contact admin for account recovery if it's your ID

### "Appointment letter details not found"
- Verify the appointment letter number and date
- Ensure position matches government records
- Wait 2-3 business days for database sync

### "Document rejected"
- Document must be clear and readable
- All official stamps/signatures must be visible
- Maximum file size is 5MB
- Supported formats: PDF, JPG, PNG only

### Session expires during use
- Sessions last 7 days
- Logout and login again to refresh
- Consider enabling "Remember Me" for future sessions

## Next Steps After Verification

### For Citizens
1. Access Citizen Portal at `/citizen-portal`
2. Submit grievances and track status
3. Participate in civic voting
4. View civil points leaderboards
5. Access newsletter and impact stories

### For Leaders
1. Access Admin Dashboard
2. View role-specific control panels
3. Escalate grievances to superiors
4. Delegate tasks and manage departments
5. View performance metrics and KPIs

### For Workers
1. Access Worker Portal
2. View assigned work orders
3. Track task progress
4. Submit completion reports
5. Manage schedule and assignments

## Support

For authentication issues, contact:
- Citizen Support: support@civilio.in
- Administrative Support: admin@civilio.in
- Worker Support: workers@civilio.in
