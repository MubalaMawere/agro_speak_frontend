# Authentication Integration Setup

## Overview
Both LoginScreen and RegisterScreen have been updated to integrate with your Spring Boot backend authentication API.

## Changes Made

### 1. Updated Login Logic
- Removed hardcoded credentials
- Added real API call to `/api/v1/auth/login`
- Simplified to email-only authentication (matching your backend)

### 2. Updated Registration Logic  
- Added real API call to `/api/v1/auth/register`
- Simplified form to focus on email registration
- Added email validation
- Made phone number optional

### 3. Added Configuration
- **`src/config/api.js`**: API base URL and endpoints configuration
- **`src/utils/authStorage.js`**: Secure token storage using AsyncStorage
- **`src/utils/errorHandler.js`**: Centralized error handling
- **`src/types/user.js`**: API structure documentation

### 4. UI Changes
- Removed phone/email authentication toggle from both screens
- Simplified forms to match backend requirements
- Added better input validation and user feedback

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @react-native-async-storage/async-storage
```

### 2. Update Backend URL
Edit `src/config/api.js` and update the `API_BASE_URL` to match your backend:

```javascript
export const API_BASE_URL = 'http://your-backend-server:8080';
```

For local development:
- **Android Emulator**: `http://10.0.2.2:8080`
- **iOS Simulator**: `http://localhost:8080`
- **Physical Device**: `http://YOUR_COMPUTER_IP:8080`

### 3. Backend Requirements
Make sure your Spring Boot backend:
- Is running on the configured URL
- Has CORS configured to allow requests from your React Native app
- **Login endpoint** `/api/v1/auth/login` returns:
  ```json
  {
    "token": "jwt_token_here",
    "role": "Farmer"
  }
  ```
- **Register endpoint** `/api/v1/auth/register` returns:
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Error responses** return:
  ```json
  {
    "error": "Error message here"
  }
  ```

## Features

### Secure Token Storage
- JWT tokens are stored securely using AsyncStorage
- User data is persisted for session management
- Easy logout functionality available

### Error Handling
- Network error detection
- HTTP status code handling
- User-friendly error messages

### Form Validation
- Email format validation
- Required field validation
- Loading states during API calls

## Testing the Integration

### Registration Flow
1. Start your Spring Boot backend
2. Update the API URL in `src/config/api.js`
3. Try registering a new user with:
   - Valid email format
   - Password (minimum 6 characters)
   - Full name
   - Optional phone number
4. Check that the user is created in your database

### Login Flow
1. Use credentials from a registered user
2. Verify JWT token is stored securely
3. Check successful navigation to Home screen
4. Test with invalid credentials to verify error handling

### Debugging
- Check network requests in React Native debugger
- Monitor backend logs for API calls
- Use console.log to verify data flow

## API Request Examples

### Registration Request
```javascript
POST /api/v1/auth/register
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "mypassword",
  "phone": "+1234567890"  // optional
}
```

### Login Request  
```javascript
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "mypassword"
}
```

## Next Steps

Consider adding:
- Email format validation enhancement
- Password strength requirements
- Confirm password field
- Remember me functionality
- Biometric authentication
- Auto-logout on token expiration
- Refresh token handling
- Terms of service acceptance tracking