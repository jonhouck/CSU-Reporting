# SharePoint & Entra ID Provisioning Guide

This guide explains how to fetch the required environment variables for SharePoint integration and how to verify the permissions of your Entra ID application.

## 1. Finding the SharePoint Site ID (`SHAREPOINT_SITE_ID`)

The Microsoft Graph API requires a specific format for the Site ID: `hostname,spsite.id,spweb.id`.

### Method: Using your Web Browser (No Graph Explorer Required)
1. Go to your SharePoint site in your browser: `https://mwdsocal.sharepoint.com/teams/CSUMANAGERS`
2. **Find the Site Collection ID (`spsite.id`)**:
   - In a new tab, navigate to this URL: `https://mwdsocal.sharepoint.com/teams/CSUMANAGERS/_api/site/id`
   - You will see an XML response with a GUID (e.g., `12345678-1234-1234-1234-123456789012`). Save this.
3. **Find the Web ID (`spweb.id`)**:
   - In another tab, navigate to this URL: `https://mwdsocal.sharepoint.com/teams/CSUMANAGERS/_api/web/id`
   - You will see another XML response with a different GUID (e.g., `87654321-4321-4321-4321-210987654321`). Save this.
4. **Construct the Final String**:
   - Format: `mwdsocal.sharepoint.com,{SiteCollectionID},{WebID}`
   - Example: `mwdsocal.sharepoint.com,12345678-1234-1234-1234-123456789012,87654321-4321-4321-4321-210987654321`
   - Set this entire constructed string as your `SHAREPOINT_SITE_ID` in `.env.local`.

## 2. Finding the SharePoint List ID (`SHAREPOINT_LIST_ID`)

### Method: From the SharePoint List Settings
1. Navigate to your "Project Tracker" list in SharePoint.
2. Click the **Gear icon** (Settings) in the top-right corner.
3. Select **List settings**.
4. In your browser's address bar, look at the URL. It will look like this:
   `.../listedit.aspx?List=%7Ba1b2c3d4-e5f6-7a8b-9c0d-1234567890ab%7D`
5. Extract the part between `%7B` and `%7D`.
   - In the example above, the ID is `a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab`.
6. Set this GUID as your `SHAREPOINT_LIST_ID` in `.env.local`.

## 3. Example `.env.local` Configuration

Once you have gathered your credentials and IDs, your `.env.local` file should look like this (with your actual values replacing the placeholders):

```env
# Azure Entra ID Credentials
AUTH_MICROSOFT_ENTRA_ID_ID="your-client-id-here"
AUTH_MICROSOFT_ENTRA_ID_SECRET="your-client-secret-here"
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID="your-tenant-id-here"

# SharePoint Configuration
SHAREPOINT_SITE_ID="mwdsocal.sharepoint.com,12345678-1234-1234-1234-123456789012,87654321-4321-4321-4321-210987654321"
SHAREPOINT_LIST_ID="a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab"
```

## 3. Verifying Entra ID App Permissions

The application uses NextAuth with the Entra ID provider. To access SharePoint resources on behalf of the user, the Entra ID App Registration must have the correct **Delegated Permissions**.

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Navigate to **Microsoft Entra ID** > **App registrations**.
3. Select your application.
4. In the left menu, click **API permissions**.
5. Verify that the following permissions are listed under "Microsoft Graph" and are of type **Delegated**:
   - `User.Read`
   - `Sites.Read.All`
   - `openid`
   - `profile`
   - `email`
   - `offline_access`
6. If any are missing, click **Add a permission** -> **Microsoft Graph** -> **Delegated permissions** and add them.
7. **Important**: Since `Sites.Read.All` is a high-privilege permission, it might require **Admin Consent**. Ensure the "Status" column has a green checkmark saying "Granted for [Your Organization]". If not, click the "Grant admin consent for [Your Organization]" button.

Once these variables are set and permissions are verified, the application will be able to query the "Project Tracker" list dynamically.
