# SharePoint & Entra ID Provisioning Guide

This guide explains how to fetch the required environment variables for SharePoint integration and how to verify the permissions of your Entra ID application.

## 1. Finding the SharePoint Site ID (`SHAREPOINT_SITE_ID`)

The Microsoft Graph API requires a specific format for the Site ID: `hostname,spsite.id,spweb.id`.

### Method A: Using Graph Explorer (Recommended)
1. Go to [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer).
2. Sign in with your enterprise account.
3. Run a `GET` query to search for your site:
   ```
   https://graph.microsoft.com/v1.0/sites/mwdsocal.sharepoint.com:/teams/CSUMANAGERS
   ```
4. In the JSON response, look for the `id` property. It will look something like this:
   `mwdsocal.sharepoint.com,12345678-1234-1234-1234-123456789012,87654321-4321-4321-4321-210987654321`
5. Copy this entire string and set it as your `SHAREPOINT_SITE_ID` in `.env.local`.

## 2. Finding the SharePoint List ID (`SHAREPOINT_LIST_ID`)

Once you have the Site ID, you can find the List ID.

### Method A: Using Graph Explorer (Recommended)
1. In Graph Explorer, run a `GET` query to list all lists in that site:
   ```
   https://graph.microsoft.com/v1.0/sites/{SHAREPOINT_SITE_ID}/lists
   ```
   *(Replace `{SHAREPOINT_SITE_ID}` with the ID you found in Step 1)*
2. Search the response for the list named "Project Tracker".
3. Copy the `id` property of that list (it will be a standard GUID, e.g., `a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab`).
4. Set this GUID as your `SHAREPOINT_LIST_ID` in `.env.local`.

### Method B: From the SharePoint URL
If you cannot use Graph Explorer, you can extract the List ID from the URL you provided:
1. URL: `https://mwdsocal.sharepoint.com/teams/CSUMANAGERS/Lists/query%2024187b54fb7664efc99b432799457cee3/AllItems.aspx`
2. Sometimes, you can go to **List Settings** in SharePoint.
3. The URL of the settings page will contain `List=%7B...%7D`. 
4. Decode the `%7B` (which is `{`) and `%7D` (which is `}`). The GUID inside is your `SHAREPOINT_LIST_ID`.

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
