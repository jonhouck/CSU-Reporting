# Manual Verification: Authentication

This document guides you through the manual verification of the Authentication features (Azure EntraID).

## Prerequisites
- You have followed `authentication_instructions.md` and updated `.env.local` with valid Azure credentials.
- The development server is running (`npm run dev`).

## Scenarios

### 1. Unauthenticated Access
1.  Open an incognito window or ensure you are logged out.
2.  Navigate to `http://localhost:3000/`.
3.  **Verify:** You are redirected to `/login`.
    *   *Note*: The middleware is configured to redirect to login for protected routes.
4.  **Verify:** The Login Page loads with the "Welcome Back" message and "Sign In" button.

### 2. Sign In Flow
1.  Click the "Sign In" button.
2.  **Verify:** You are redirected to the Microsoft Login page.
3.  Enter your organization credentials.
4.  **Verify:** You are redirected back to `http://localhost:3000/`.
5.  **Verify:** The homepage now displays "Current Session" with your Name and Email.

### 3. Sign Out Flow
1.  On the homepage, click the "Sign Out" button.
2.  **Verify:** You are signed out and the page updates (or redirects) to show the unauthenticated state (or back to login depending on flow).
    *   *Note*: Default behavior might keep you on the page or redirect. Confirm you see "Not authenticated" or the Login page.

### 4. Direct Access to Protected Routes
1.  Try to navigate to any other route (if enabled) while logged out.
2.  **Verify:** Redirected to `/login`.
