# End-to-End Deployment Guide: Next.js to Azure App Service

This guide covers everything you need to do to deploy your CSU Reporting Next.js application to Azure, including provisioning the necessary resources, configuring environment variables with Azure Key Vault, updating your local files and Entra ID app registration, and deploying the codebase.

## Prerequisites
- An active **Azure Subscription** (e.g., your Dev subscription).
- You have an empty **Azure Resource Group** created.
- You have access to your **Microsoft Entra ID (Active Directory)** Application Registration used for authentication.
- **Azure CLI** installed locally (optional, but helpful), or access to the **Azure Portal**.
- Your codebase is hosted in **GitHub** (recommended for CI/CD).

---

## Phase 1: Provisioning Azure Resources

### 1. Create an Azure App Service (Web App)
You need a host for your Next.js application. We will use Azure App Service (Linux).

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Search for **App Services** and click **Create -> Web App**.
3. **Basics Tab**:
   - **Subscription**: Select your Dev subscription.
   - **Resource Group**: Select your existing empty resource group.
   - **Name**: Provide a unique name (e.g., `csudailyreport`). This becomes your URL: `https://<name>.azurewebsites.net`.
   - **Publish**: Choose **Code**.
   - **Runtime stack**: Choose **Node 20 LTS** (or the exact Node.js version you are using natively).
   - **Operating System**: Choose **Linux**.
   - **Region**: Choose a region close to your users (e.g., West US, East US).
   - **Pricing plan**: Select an appropriate App Service Plan (e.g., Basic B1 or Standard S1 for production workloads). Next.js requires a plan with sufficient memory for the build process if building on the server.
4. Click **Review + create**, then **Create**.

### 2. Create the Azure Key Vault
We will use Azure Key Vault to securely store the secrets from your `.env.local` file.

1. Go to your Resource Group and click **Create**.
2. Search for **Key Vault** and click **Create**.
3. **Basics Tab**:
   - **Key vault name**: Provide a globally unique name (e.g., `csu-reporting-kv`).
   - **Region**: Match the region of your App Service.
4. **Access Configuration Tab**:
   - Under Permission model, select **Azure role-based access control** (recommended).
5. Click **Review + create**, then **Create**.

---

## Phase 2: Security & Configuration

### 1. Enable System-Assigned Managed Identity
Your App Service needs a "system identity" to securely fetch secrets from the Key Vault without hardcoding passwords.

1. Go to your **App Service**.
2. In the left menu under **Settings**, select **Identity**.
3. On the **System assigned** tab, toggle Status to **On**.
4. Click **Save** and confirm.

### 2. Grant the App Service Access to the Key Vault
1. Go to your **Key Vault**.
2. In the left menu, select **Access control (IAM)**.
3. Click **Add** -> **Add role assignment**.
4. Select the **Key Vault Secrets User** role and click **Next**.
5. Under **Assign access to**, select **Managed identity**.
6. Click **Select members**, select your Subscription, and under Managed identity choose **App Service**. Select your newly created App Service from the list.
7. Click **Review + assign**.

### 3. Grant Yourself Access to the Key Vault
Depending on how the Key Vault was created, you may not automatically have permission to create secrets within it.

1. Go to your **Key Vault**.
2. In the left menu, select **Access control (IAM)**.
3. Click **Add** -> **Add role assignment**.
4. Select the **Key Vault Secrets Officer** role and click **Next**.
5. Under **Assign access to**, keep **User, group, or service principal** selected.
6. Click **Select members** and search for your own Azure Active Directory account/email. Select it.
7. Click **Review + assign**. Wait a minute or two for propagation.

### 4. Add Secrets to the Key Vault
Key Vault secret names can only contain alphanumeric characters and dashes (`-`), so we must replace underscores (`_`) from your `.env.local` file with dashes.

1. Go to your **Key Vault**.
2. Under **Objects**, select **Secrets**, then **Generate/Import**.
3. Add the following secrets, using the exact values from your `.env.local` file:

| .env.local Variable (For Reference) | Key Vault Secret Name |
| :--- | :--- |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | `AUTH-MICROSOFT-ENTRA-ID-ID` |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | `AUTH-MICROSOFT-ENTRA-ID-SECRET` |
| `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` | `AUTH-MICROSOFT-ENTRA-ID-TENANT-ID` |
| `AUTH_SECRET` | `AUTH-SECRET` |
| `SHAREPOINT_SITE_ID` | `SHAREPOINT-SITE-ID` |
| `SHAREPOINT_LIST_ID` | `SHAREPOINT-LIST-ID` |

### 5. Link App Service Environment Variables to Key Vault
Now tell your App Service to pull those secrets into the Node.js runtime environment variables.

1. Go to your **App Service**.
2. Under **Settings**, select **Environment variables**.
3. Under the **App settings** tab, add a new setting for each of your variables. 
4. The **Name** must match your `.env.local` perfectly (with underscores). 
5. The **Value** will use Key Vault Reference Syntax: `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=your-secret-name)`

**Add these exact App Settings:**
- `AUTH_MICROSOFT_ENTRA_ID_ID` = `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=AUTH-MICROSOFT-ENTRA-ID-ID)`
- `AUTH_MICROSOFT_ENTRA_ID_SECRET` = `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=AUTH-MICROSOFT-ENTRA-ID-SECRET)`
- `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` = `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=AUTH-MICROSOFT-ENTRA-ID-TENANT-ID)`
- `AUTH_SECRET` = `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=AUTH-SECRET)`
- `SHAREPOINT_SITE_ID` = `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=SHAREPOINT-SITE-ID)`
- `SHAREPOINT_LIST_ID` = `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=SHAREPOINT-LIST-ID)`
- `AUTH_URL` = `https://<your-app-service-name>.azurewebsites.net/api/auth` *(This tells NextAuth/Auth.js where your app is hosted)*
- `AUTH_TRUST_HOST` = `true` *(Necessary for Azure environments)*

Click **Apply** at the bottom to save the configurations. If connected properly, you will see a green checkmark indicating the Key Vault connection was successful.

---

## Phase 3: External & Local Entra ID Updates

### 1. Update the Microsoft Entra ID Application Registration
To ensure users can log in on the live site, you must whitelist the production Azure App Service URL as a valid redirect URI in Microsoft Entra ID.

1. Go to the Azure Portal and search for **Microsoft Entra ID**.
2. Select **App registrations** from the left menu and click on your application.
3. In the left menu, click **Authentication**.
4. Under **Web -> Redirect URIs**, click **Add URI**.
5. Add exactly: `https://<your-app-service-name>.azurewebsites.net/api/auth/callback/microsoft-entra-id`
6. Click **Save** at the bottom.

### 2. Local File Changes
Because your code dynamically relies on `process.env` logic, **almost no local source code changes are required** to use Azure Key Vault or deploy to Azure Linux! The App service injects Key Vault reference values directly into `process.env` at startup.

Make sure `.env.local` and `.env` files are in your `.gitignore` file (which they normally are for Next.js) so you don't accidentally commit development secrets.

---

## Phase 4: Deployment

Because this is a Next.js (React) application, it needs to be "built" (`npm run build`) before running. We have included a pre-configured **GitHub Actions** workflow (`.github/workflows/azure-deploy.yml`) to handle this deployment process automatically when you push or merge code to `main`.

### 1. Configure the Publish Profile Secret
Before the workflow can successfully deploy your code to Azure, it needs permission to publish to your specific App Service.

1. Go to your **App Service** in the Azure Portal.
2. At the very top of the Overview blade, click **Download publish profile**.
3. Open the downloaded file in a text editor and copy all of its XML contents to your clipboard.
4. Go to your repository on **GitHub**.
5. Click **Settings** -> **Secrets and variables** -> **Actions** (in the left menu).
6. Click the green **New repository secret** button.
7. **Name:** Enter exactly `AZUREAPPSERVICE_PUBLISHPROFILE`
8. **Secret:** Paste the entire XML content from the publish profile you downloaded.
9. Click **Add secret**.

### 2. Triggering the Deployment

The deployment workflow is configured to run automatically anytime code is pushed or merged into the `main` branch. 

To monitor a deployment:
1. Go to your repository on **GitHub** and click the **Actions** tab.
2. Click on the most recent workflow run (e.g., "Build and deploy Node.js app to Azure Web App").
3. Watch the workflow run consisting of two phases: "build" and "deploy".
3. Once finished, visit your site at `https://<your-app-service-name>.azurewebsites.net`.

To view application runtime logs (if you get a 500 error):
- Go to your App Service -> **Log stream** to watch the server output live.
