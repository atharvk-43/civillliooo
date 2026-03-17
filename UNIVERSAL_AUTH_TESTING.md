# Universal Authentication System - Testing Quick Start

## 5-Minute Setup & Test

### Start the Application
```bash
npm run dev
```

### Step 1: Visit Login Page
Open your browser and go to:
```
http://localhost:3000/login
```
or directly:
```
http://localhost:3000/auth/login
```

### Step 2: Test Login (Flexible Credentials)

#### Test Case 1: Full Details
**Input:**
- Name: `John Doe`
- Email: `john.doe@example.com`
- Credential: `AADHAR-123456789`

**Expected Result:** ✅ Login successful, redirects to `/app/dashboard`

#### Test Case 2: Partial Details
**Input:**
- Name: `Jane Smith`
- Email: *(leave blank)*
- Credential: *(leave blank)*

**Expected Result:** ✅ Login successful, auto-generated email, redirects to dashboard

#### Test Case 3: Minimal Details
**Input:**
- Name: *(leave blank)*
- Email: *(leave blank)*
- Credential: *(leave blank)*

**Expected Result:** ✅ Login successful with all fields auto-generated, redirects to dashboard

#### Test Case 4: Special Characters
**Input:**
- Name: `Ñoño Gupta`
- Email: `test+tag@domain.co.uk`
- Credential: `PAN-AB12CD3456EF`

**Expected Result:** ✅ Login successful, special characters accepted and sanitized

### Step 3: Access Unified Dashboard

After successful login, you should see:
- Header with "Civilio Portal" and your name
- Sidebar with 6 main sections
- Welcome card
- 6 feature cards (Grievances, Civil Points, Newsletter, Work Orders, Analytics, Governance)
- Quick statistics
- User info in top-right corner

**Sections Available:**
1. **Grievance Management** - Submit and track issues
2. **Civil Points & Rankings** - View civic achievements
3. **News & Announcements** - Community updates
4. **Work Orders** - Municipal task management
5. **Analytics & Reports** - Performance metrics
6. **Governance & Administration** - Admin controls

### Step 4: Test Navigation

Click on any section card to highlight it. The dashboard maintains state and shows all features in one unified interface.

### Step 5: Test Logout

1. Click the **LogOut** button in the top-right corner
2. Should redirect to `/auth/login`
3. Try accessing `/app/dashboard` directly
4. Should redirect back to login (session protection working)

### Step 6: Test Session Persistence

1. Login with any credentials
2. Open browser DevTools (F12)
3. Go to Application → Cookies
4. Verify `civilio-session` cookie exists
5. Close browser completely and reopen
6. Visit `http://localhost:3000/app/dashboard`
7. **Expected:** Dashboard loads without re-login (session persisted)

## Testing Session Details

### Check Session Cookie
```javascript
// In browser console:
document.cookie
// Should show: civilio-session=<long-token>; civilio-user={"userId":"...","name":"...","email":"..."}
```

### Check User Info Cookie
```javascript
// In browser console:
const userCookie = document.cookie.split('; ').find(row => row.startsWith('civilio-user='));
JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
// Should display user object
```

### Monitor API Calls
1. Open DevTools Network tab
2. Login with credentials
3. Watch for:
   - `POST /api/auth/universal` - Creates session
   - `POST /api/auth/verify-session` - Validates session (on page load)
   - Both should return `{"success": true}`

## Test Scenarios

### Scenario A: New User Flow
```
1. Clear all cookies (simulate new user)
2. Visit /login
3. Submit form with any credentials
4. Should create new session and redirect
5. Dashboard should load with empty statistics
6. Logout and verify session cleared
```

### Scenario B: Session Persistence
```
1. Login with: name="Test User", email="test@test.com", credential="TEST123"
2. Note the session ID in cookies
3. Reload page (Ctrl+R)
4. Should load dashboard without login prompt
5. User info should still be displayed
6. Session ID should be same
```

### Scenario C: Expired Session
```
1. Login normally
2. Modify cookie: civilio-session to invalid value
3. Reload page
4. Should redirect to login (session invalid)
5. DevTools Network should show failed verify response
```

### Scenario D: Multiple Logins
```
1. Login with: name="User1"
2. Note user name in header
3. Logout
4. Login with: name="User2"
5. Header should show new user name
6. Session should be different
7. Previous session should be deleted
```

## Expected Behaviors

### ✅ What Should Work
- Login with any combination of credentials (including empty)
- Automatic field population if left blank
- Session persistence across page reloads
- Session automatic expiry after 7 days
- Logout clears cookies and redirects
- All users see same unified dashboard
- Sidebar navigation between sections
- Dark mode toggle (if implemented)
- Responsive design on mobile
- Auto-generated emails follow pattern: `user-<timestamp>@civilio.local`

### ❌ What Should NOT Work
- Accessing `/app/dashboard` without login (redirects to login)
- Using invalid session ID (redirects to login)
- Modifying cookies to access dashboard (fails verification)
- Accessing old auth pages directly (should redirect)

## Browser Console Testing

### Test Session Validation
```javascript
// Call the verify endpoint manually
fetch('/api/auth/verify-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    sessionId: document.cookie.split('civilio-session=')[1].split(';')[0]
  })
})
.then(r => r.json())
.then(d => console.log('Session valid:', d.success))
```

### Test Logout
```javascript
// Manually call logout
fetch('/api/auth/logout', { method: 'POST' })
.then(r => r.json())
.then(d => console.log('Logout result:', d))
```

### Clear All Auth Data
```javascript
// Clear cookies and session storage
document.cookie = 'civilio-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
document.cookie = 'civilio-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
localStorage.clear()
sessionStorage.clear()
// Now refresh page - should redirect to login
location.reload()
```

## Performance Testing

### Measure Login Time
```javascript
console.time('login');
// Submit form
console.timeEnd('login');
// Should complete in < 500ms
```

### Check Memory Usage
1. Open DevTools Memory tab
2. Take heap snapshot before login
3. Login and navigate dashboard
4. Take another snapshot
5. Compare sizes (should be reasonable, no memory leaks)

### Test with Slow Network
1. DevTools Network tab
2. Set throttling to "Slow 3G"
3. Perform login
4. Should still complete successfully
5. UI should show loading states

## Troubleshooting Tests

### Login Hangs
- Check browser console for errors
- Verify API endpoint is reachable: `http://localhost:3000/api/auth/universal`
- Check network tab for failed requests
- Restart server if needed

### Redirect Loop
- Clear all cookies
- Restart browser
- Try again
- Check that `/auth/login` page is accessible

### Dashboard Won't Load
- Verify session cookie exists
- Check network tab for verify-session response
- Try clearing cookies and re-login
- Check console for JavaScript errors

### Logout Not Working
- Verify `/api/auth/logout` endpoint exists
- Check cookies are being deleted
- Clear cookies manually if needed
- Verify redirecting to `/auth/login`

## Success Indicators

✅ **All tests passing if you can:**
1. Login with any credentials (or none)
2. See unified dashboard with 6 feature sections
3. Reload page without losing session
4. Logout and be redirected to login
5. Cannot access dashboard after logout
6. User info displayed correctly
7. Sidebar navigation works
8. Mobile view is responsive

## Next Steps

After successful testing:
1. Deploy to staging environment
2. Test with real users
3. Monitor session analytics
4. Collect feedback on UX
5. Plan enhancements (database sessions, 2FA, etc.)
6. Configure production environment
7. Set up monitoring and alerts
8. Train support team

## Support

If tests fail:
1. Check browser console for JavaScript errors
2. Check server console for API errors
3. Verify all files were created correctly
4. Check that ports are not in use
5. Try clearing cache: `Ctrl+Shift+Delete`
6. Restart the development server
