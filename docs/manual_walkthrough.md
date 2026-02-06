# Manual Verification: Project Foundation

This guide describes how to verify the initialization of the CSU Reporting project.

## 1. Verify Application Startup
- Open a terminal in the project root.
- Run `npm run dev`.
- navigating to `http://localhost:3000` in your browser.
- **Expected Result:** The standard Next.js landing page should appear.

## 2. Verify UI Components (Shadcn)
- Confirm that `components.json` exists in the root.
- Confirm that `src/components/ui` directory exists (it may be empty if no components added yet, or contain utils).
- **Expected Result:** Configuration files are present.

## 3. Verify Linting
- Run `npm run lint`.
- **Expected Result:** No errors should be reported.

## 4. Verify Testing
- Run `npm run test`.
- **Expected Result:** Tests should execute (if any exist) or at least the test runner should start without configuration errors.
