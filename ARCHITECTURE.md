# CSU Reporting Application - System Architecture

## Overview
A modern web application to streamline the creation of end-of-shift PDF reports for Construction Services Unit (CSU) supervisors. The application integrates with Azure EntraID for authentication and SharePoint (via Microsoft Graph) for retrieving project data.

## Tech Stack
- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile-responsive, "Corporate Chic" aesthetic)
- **Authentication**: NextAuth.js (Auth.js) v5 with Azure EntraID Provider
- **State Management**: React Hook Form + Zod (for robust form handling and validation)
- **PDF Generation**: `@react-pdf/renderer` (React-based PDF generation)
- **API Integration**: `@microsoft/microsoft-graph-client` (SharePoint Data)
- **Deployment**: Azure Static Web Apps or Azure App Service

## Security & Auth Flow
1.  **Authentication**: Users authenticate via Azure EntraID.
    *   MFA/Device compliance handled by EntraID/Workspace One policies upstream.
2.  **Authorization**: NextAuth.js handles the session.
3.  **SharePoint Access**:
    *   Application acts as a confidential client (or delegated user depending on permissions/setup, likely delegated for "User's" SharePoint access, but requirements imply "pass through credentials").
    *   Scopes: `Sites.Read.All` or specific list permissions.
4.  **Secrets**: Stored in Azure Key Vault (production) / `.env.local` (development, mocked).

## Data Flow
1.  **User Login**: Redirect to Microsoft Login -> Callback with Tokens using NextAuth.
2.  **Initialization**: App fetches available Projects from SharePoint "Project Tracker" List.
3.  **User Input**:
    *   User selects Project (populates Description).
    *   User enters Date, Shift.
    *   User enters bullet points (Work Description).
    *   User uploads Photos + Captions.
4.  **Report Generation**:
    *   Client-side generation of PDF using `@react-pdf/renderer` components.
    *   Integrates `CSU_Logo_BBY` (Base64 or static import).
    *   PDF downloaded to client device (Blob).

## Key Components
1.  **`AuthProvider`**: Wraps app to handle EntraID session.
2.  **`ProjectSelector`**: Dropdown component fetching data from SP.
3.  **`ShiftReportForm`**: Main form container.
    *   `BulletPointInput`: Dynamic list input for textual updates.
    *   `PhotoUploadZone`: Drag-and-drop zone with image preview and caption fields.
4.  **`PDFRenderer`**: hidden or memory-only component that renders the Report definition to a blob.

## SharePoint Integration
- **Project Tracker**: Read-Only.
    - URL: `https://mwdsocal.sharepoint.com/teams/CSUMANAGERS/Lists/query...`
    - Fields to fetch: Project Name, Job Number, Description.

## OWASP Considerations
- **Input Sanitization**: All text inputs sanitized before rendering (though PDF reduces XSS risk, it's good practice).
- **Authentication**: Relying on robust Azure AD.
- **Data Protection**: HTTPS only. No sensitive data persistence in the app's own database (stateless).
