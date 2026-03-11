# Deploying to Azure with Azure Key Vault

This guide explains how to migrate your local environment variables from `.env.local` to Azure Key Vault and configure your Azure App Service to use them securely.

## Prerequisites
- An active Azure Subscription.
- Azure CLI installed (optional, but recommended for scripting).
- An Azure App Service created for hosting this application.
- Permissions to create Azure Key Vaults and assign roles.

## Step 1: Create an Azure Key Vault
1. Go to the [Azure Portal](https://portal.azure.com/).
2. Search for **Key Vaults** and click **Create**.
3. Choose your Subscription, Resource Group, and provide a unique **Key Vault Name**.
4. Select the appropriate Region.
5. Under **Access configuration**, select **Azure role-based access control (recommended)**.
6. Click **Review + create**, then **Create**.

## Step 2: Add Secrets to the Key Vault
Azure Key Vault secret names can only contain alphanumeric characters and dashes (`-`). We will need to replace the underscores (`_`) from your `.env.local` file with dashes (`-`).

1. Go to your newly created Key Vault in the Azure Portal.
2. Under **Objects** in the left menu, select **Secrets**, then click **Generate/Import**.
3. Add the following secrets, mapping their values from your `.env.local` file:

| .env.local Variable | Key Vault Secret Name |
| :--- | :--- |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | `AUTH-MICROSOFT-ENTRA-ID-ID` |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | `AUTH-MICROSOFT-ENTRA-ID-SECRET` |
| `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` | `AUTH-MICROSOFT-ENTRA-ID-TENANT-ID` |
| `AUTH_SECRET` | `AUTH-SECRET` |
| `SHAREPOINT_SITE_ID` | `SHAREPOINT-SITE-ID` |
| `SHAREPOINT_LIST_ID` | `SHAREPOINT-LIST-ID` |

*Note: Be sure to paste the exact values from `.env.local` into the Value field of each secret.*

## Step 3: Enable Managed Identity on Azure App Service
To allow your App Service to read secrets from the Key Vault without storing credentials in code, you need to enable Managed Identity.

1. Go to your **App Service** in the Azure Portal.
2. Under **Settings** in the left menu, select **Identity**.
3. In the **System assigned** tab, set Status to **On**.
4. Click **Save** and confirm.
5. Make a note of the **Object (principal) ID** that is generated.

## Step 4: Grant App Service Access to Key Vault
1. Go back to your **Key Vault**.
2. Select **Access control (IAM)** in the left menu.
3. Click **Add** -> **Add role assignment**.
4. Select the **Key Vault Secrets User** role and click **Next**.
5. Under **Assign access to**, select **Managed identity**.
6. Click **Select members**, choose your Subscription, and under Managed identity select **App Service**. Select your App Service from the list.
7. Click **Review + assign**.

## Step 5: Configure App Service Environment Variables
Now, you need to tell your App Service to pull its environment variables from the Key Vault.

1. Go to your **App Service**.
2. Under **Settings**, select **Environment variables** (or **Configuration** depending on the portal view).
3. Add a new application setting for each environment variable required by the application.
4. Name the application setting exactly as it appears in your `.env.local` file (with underscores).
5. Set the value using the following Key Vault reference syntax:
   `@Microsoft.KeyVault(VaultName=your-key-vault-name;SecretName=your-secret-name)`

Replace `your-key-vault-name` and `your-secret-name` with the actual values.

### Example Configuration:
- **Name:** `AUTH_MICROSOFT_ENTRA_ID_ID`
- **Value:** `@Microsoft.KeyVault(VaultName=my-app-vault;SecretName=AUTH-MICROSOFT-ENTRA-ID-ID)`

*Repeat this for all 6 variables.*

## Step 6: Deploy the Application
Since the application automatically reads from `process.env`, no code changes are required to use Key Vault references. The App Service securely resolves the Key Vault references at runtime and injects the actual values into the environment.

1. Push your code to your deployment branch or deploy via your preferred CI/CD pipeline (e.g., GitHub Actions, Azure DevOps).
2. Once deployed, the application will use the secrets retrieved directly from the Key Vault.

## Troubleshooting
- If the app fails to start or authentication fails, go to the **Environment variables** section in your App Service. If a Key Vault reference is invalid or the App Service lacks permission, it will show a red "X" next to the reference instead of a green checkmark.
- Ensure the Managed Identity has the **Key Vault Secrets User** role assignment on the Key Vault.
