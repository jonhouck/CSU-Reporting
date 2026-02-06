# Azure Entra ID Configuration Instructions

To enable secure authentication for the CSU Reporting Application, you need to register the application in your organization's Microsoft Entra ID (formerly Azure AD) tenant.

Please follow these steps and provide the generated credentials.

## 1. Register the Application

1.  Log in to the [Azure Portal](https://portal.azure.com/).
2.  Navigate to **Microsoft Entra ID** service.
3.  In the left menu, select **App registrations** > **New registration**.
4.  Fill in the form:
    *   **Name**: `CSU Reporting App` (or similar).
    *   **Supported account types**: Select **Accounts in this organizational directory only** (Single tenant).
    *   **Redirect URI (optional)**: Select **Web** and enter `http://localhost:3000/api/auth/callback/microsoft-entra-id`.
5.  Click **Register**.

## 2. Configure Authentication

1.  In your new app registration, go to **Authentication** in the left menu.
2.  Ensure the **Redirect URI** is correct: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
    *   *Note: When deploying to production, you will need to add the production URL here as well (e.g., `https://your-app.azurewebsites.net/api/auth/callback/microsoft-entra-id`).*
3.  Under **Implicit grant and hybrid flows**, leave them **unchecked** (we are using the secure server-side flow).
4.  Click **Save**.

## 3. Create a Client Secret

1.  Go to **Certificates & secrets** in the left menu.
2.  Select the **Client secrets** tab.
3.  Click **New client secret**.
4.  **Description**: `NextAuth Secret`.
5.  **Expires**: Select an appropriate duration (e.g., 6 months or 12 months).
6.  Click **Add**.
7.  **IMPORTANT:** Copy the **Value** immediately. You will not be able to see it again. This is your `AUTH_MICROSOFT_ENTRA_ID_SECRET`.

## 4. Gather Credentials

You need to collect the following three values to configure the application:

1.  **Client ID**: Go to **Overview**. Copy the **Application (client) ID**.
2.  **Tenant ID**: Go to **Overview**. Copy the **Directory (tenant) ID**.
3.  **Client Secret**: The **Value** you copied in Step 3.

## 5. Configure Local Environment

Open your `.env.local` file (create it if it doesn't exist) and add the following:

```bash
AUTH_MICROSOFT_ENTRA_ID_ID="<Your Application (client) ID>"
AUTH_MICROSOFT_ENTRA_ID_SECRET="<Your Client Secret Value>"
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID="<Your Directory (tenant) ID>"

# Generate a random secret for the app encryption
# You can generate one by running `npx auth secret` or `openssl rand -base64 32`
AUTH_SECRET="<Randomly Generated String>"
```

## 6. Token Configuration (Optional but Recommended)

If we need specific claims (like groups or roles) in the future:
1. Go to **Token configuration**.
2. Click **Add optional claim**.
3. Select **ID**, then choose `email`, `family_name`, `given_name`.
4. Click **Add**.

---

**Next Steps:**
Once you have configured these values in your local environment, restart your development server (`npm run dev`) to enable the login flow.
