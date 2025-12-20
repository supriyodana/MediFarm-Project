# Authentication System Overview

## Authentication Method Used
This API uses Session-based Authentication (not JWT tokens). When a user/admin logs in successfully, the server creates a server-side session and sends a session cookie to the client.

## Session Cookie Management

Cookie Name: medifarm_session (configurable via SESSION_NAME env variable)

The cookie is automatically sent/received by browsers in all subsequent requests to the same domain

No need to manually handle tokens - the browser handles cookie storage and transmission

## Important Frontend Considerations

Use credentials: 'include' in all fetch requests:

fetch('http://localhost:5000/api/user/protected', {
  method: 'GET',
  credentials: 'include'  // ← This is REQUIRED
})

Set up CORS correctly in your frontend (if using fetch/axios):
// Axios example
axios.defaults.withCredentials = true;

// Fetch example for all requests
fetch(url, {
  credentials: 'include'
})

## to remember 

Don't store the session ID manually in localStorage/sessionStorage

Don't try to read the session cookie via JavaScript (it's httpOnly)

Don't forget to include credentials in API calls


## Session Flow

### Login Success:
Frontend → POST /api/user/login
Backend → Creates session, sets cookie in response
Browser → Automatically stores cookie
Subsequent requests → Browser automatically includes cookie

### Logout:
Frontend → POST /api/logout
Backend → Destroys session, clears cookie
Browser → Removes the cookie


## CORS Configuration

The backend is configured with:
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  credentials: true  // ← Allows cookies to be sent
}));

### remember 
Make sure your frontend runs on the exact origin specified (default: http://localhost:5173)

## example auth setup for frontend
// Auth context/store setup example
class AuthService {
  async login(email, password) {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async getCurrentUser() {
    const response = await fetch('/api/me', {
      credentials: 'include'
    });
    
    if (response.status === 401) return null; // Not logged in
    return response.json();
  }

  async logout() {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    // Clear frontend state here
  }
}


## Flow Diagram 
Frontend App Start
        ↓
Call GET /api/me (with credentials)
        ↓
If 200 → User authenticated → Load app with user data
        ↓
If 401 → User not logged in → Show login page
        ↓
Login Form Submit → POST /api/user/login
        ↓
On Success → Browser stores cookie automatically
        ↓
All future requests → Browser auto-includes cookie
