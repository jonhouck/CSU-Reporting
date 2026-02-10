# Manual Walkthrough: UI Components (Forms & Input)

This guide provides steps to manually verify the functionality of the shift reporting UI components.

## Prerequisites
- The application should be running locally (`npm run dev`).
- You should be authenticated as a CSU supervisor.

## Verification Steps

### 1. Access the Reporting Page
1.  Navigate to the Home page of the application.
2.  Click the **"Create Daily Report"** button.
3.  Ensure you are redirected to `/report`.

### 2. Shift Details Form
1.  Verify that the **"Shift Details"** card is visible.
2.  Click the **"Project"** dropdown and select a project (e.g., "Site Shutdown - Main North").
3.  Click the **"Date"** picker and select today's date.
4.  Click the **"Shift"** dropdown and select a shift (e.g., "Day").
5.  Click the **"Save Shift Details"** button.
6.  Ensure no validation errors appear and the form reflects your selections.

### 3. Bullet Point Editor
1.  In the **"Work Details"** section, click the **"Add Bullet"** button.
2.  Verify a new row with a text input and a trash icon appears.
3.  Enter a description of work performed (e.g., "Inspected main pipeline bypass").
4.  Add another bullet and enter more details.
5.  Click the trash icon on one of the rows and ensure it is removed.

### 4. Photo Upload
1.  In the **"Report Photos"** section, either click the upload zone or drag and drop an image file (PNG/JPG).
2.  Verify the image appears with a preview.
3.  Enter a caption in the input field below the image preview (e.g., "Initial site inspection").
4.  Add another photo and verify it also renders correctly.
5.  Click the "X" button on one of the photos to remove it.

### 5. Report Generation
1.  Verify that the **"Generate PDF Report"** button is enabled only after saving shift details and adding at least one bullet point.
2.  Click **"Generate PDF Report"**.
3.  Verify that an alert appears confirming the data capture. (Actual PDF generation implementation is Task #5).
