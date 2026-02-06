# Manual Verification Walkthrough - SharePoint Integration

This guide describes how to verify the SharePoint Service implementation. Since this task is a backend service implementation without a UI, verification primarily relies on automated tests and code inspection.

## 1. Automated Verification

Execute the unit tests to confirm the service correctly initializes the Microsoft Graph Client and handles responses.

```bash
npm test src/lib/sharepoint.test.ts
```

**Expected Result:**
- API calls to `Microsoft Graph` are mocked.
- Tests pass (Green).
- Error handling scenarios are covered.

## 2. Manual Code Inspection

Verify the `SharePointService` in `src/lib/sharepoint.ts`.

1.  **Auth Integration**: Confirm `Client.init` uses the passed `accessToken`.
2.  **View Constraint**: Note the comment regarding "This week's work" view. The current implementation fetches items which will need to be filtered by the calling component or via updated API calls once View IDs are available.

## 3. Integration Verification (Future)

To test against the real SharePoint API (once a UI or CLI harness is built):
1.  Ensure `.env.local` has valid `AUTH_MICROSOFT_ENTRA_ID_*` credentials.
2.  The user logging in must have access to the site `mwdsocal.sharepoint.com`.
3.  Upon first login, consent to the `Sites.Read.All` permission.
