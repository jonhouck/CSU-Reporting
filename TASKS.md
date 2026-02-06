# Project Tasks: CSU Reporting Application

This file serves as the backlog, critical path, and issue tracker for the development of the CSU Reporting Application.

**Developer Considerations:**
*   **GitHub Integration:** Connect to the `CSU Reporting` repository using the `github-mcp-server`.
*   **Testing Mandate:** EVERY task requires a corresponding battery of unit and automation tests. Integration tests are required where applicable.
*   **Quality Gate:** verified by GitHub Actions. A Pull Request cannot be merged unless all linting, unit, and automation tests pass.
*   **Pick Strategy:** Pick the next unchecked item from the top down. Dependencies must be respected. Mark as `[x]` when done.

## 1. Project Foundation & Infrastructure

- [x] **Initialize Next.js Project & GitHub Connection**
    - **Goal:** Create the repository scaffolding and connect to version control.
    - **Requirements:**
        - **Connect:** Use MCP to connect to the existing `CSU Reporting` GitHub repository.
        - **Scaffold:** Use `npx create-next-app@latest` (TypeScript, Tailwind, ESLint).
        - **UI Library:** Setup `shadcn/ui` + `lucide-react` for "Corporate Chic" styling.
        - **Linting:** Configure ESLint and Prettier. Ensure `npm run lint` passes.
        - **Tests:** Setup `vitest` (or Jest) and `testing-library/react`.
    - **Deliverable:** Compilable app committed to the `CSU Reporting` repo.

- [ ] **Configure CI/CD Pipeline (GitHub Actions)**
    - **Goal:** enforce code quality on every push.
    - **Requirements:**
        - Create `.github/workflows/ci.yml`.
        - **Jobs:**
            1.  **Lint:** Runs `npm run lint` & Prettier check.
            2.  **Test:** Runs `npm run test` (Unit/Automation).
            3.  **Build:** Runs `npm run build`.
        - **Rules:** Workflow must pass for any PR to be merged.
    - **Deliverable:** Green build badge on the repo.

- [ ] **Configure Environment Management**
    - **Goal:** Secure configuration constants.
    - **Requirements:**
        - Create `.env.local` template.
        - Define: `AZURE_AD_*`, `NEXTAUTH_*`.
        - **Mocking:** Setup mock values for test environments.
    - **Deliverable:** `.env.example` in repo, verify config triggers no build warnings.

## 2. Authentication & Security (Azure EntraID)

- [ ] **Implement Authentication with NextAuth.js**
    - **Goal:** Secure the application.
    - **Requirements:**
        - Install `next-auth@beta` (for App Router support).
        - **Components:** `AuthProvider`, `SignInButton`, `SignOutButton`.
        - **Protection:** middleware to protect `/` and redirect to login.
        - **Testing:**
            - *Unit:* Test Auth components render correctly.
            - *Mock:* Create a `MockAuthProvider` for convenient dev/testing.
    - **Deliverable:** Working secure login flow with passing tests.

## 3. Data Integration (SharePoint)

- [ ] **Create SharePoint Service Interface**
    - **Goal:** Abstract data fetching logic.
    - **Requirements:**
        - Create `src/lib/sharepoint.ts`.
        - Interface: `getProjects()`, `getShiftConfig()`.
        - **Data Source:** Use mock JSON initially (mirrors SP List).
        - **Testing:**
            - *Unit:* Verify service returns correct types/mock data.
    - **Deliverable:** Service returning list of projects.

## 4. UI Components (Forms & Input)

- [ ] **Design "Shift Details" Form**
    - **Goal:** Capture meta-data.
    - **Requirements:**
        - `ShiftReportForm` using `react-hook-form` + `zod`.
        - Fields: Project (Select), Date, Shift (Select).
        - **Testing:**
            - *Unit:* Verify validation (required fields).
            - *Automation:* Simulate user selection and form state update.
    - **Deliverable:** Functional form with passing validation tests.

- [ ] **Implement "Bullet Point" Editor**
    - **Goal:** Freeform text entries.
    - **Requirements:**
        - Dynamic list (Add/Delete rows).
        - **Testing:**
            - *Unit:* Add item, delete item, verify state.
    - **Deliverable:** Array input component with tests.

- [ ] **Build Photo Upload Component**
    - **Goal:** Handle attachments.
    - **Requirements:**
        - Drag & Drop zone.
        - Image Preview + Caption Input.
        - **Testing:**
            - *Unit:* Mock file upload event, verify preview rendering.
    - **Deliverable:** Upload UI with tests.

## 5. Report Generation (PDF)

- [ ] **Implement PDF Document Definition**
    - **Goal:** PDF Template.
    - **Requirements:**
        - `@react-pdf/renderer` layout matching "Power App Request.pdf".
        - **Testing:**
            - *Snapshot:* Render PDF to stream/blob and verify structure (if possible) or visually verify via test harness.
    - **Deliverable:** React component definition for the PDF.

- [ ] **Finalize "Download Report" Flow**
    - **Goal:** End-to-end generation.
    - **Requirements:**
        - Connect Form Data -> PDF Document.
        - Button triggers download.
        - **Testing:**
            - *Integration:* Fill form -> Click Generate -> Verify function call to generate PDF.
    - **Deliverable:** Working Report Download.

## 6. Polish & UX

- [ ] **Responsive Design Review**
    - **Goal:** Mobile optimization.
    - **Requirements:**
        - Verify layouts on mobile breakpoints.
    - **Deliverable:** CSS Tweaks.

- [ ] **Final QA & Deployment Prep**
    - **Goal:** Deployment.
    - **Requirements:**
        - Update README.
        - Final Full Suite Test Run.
    - **Deliverable:** Production build.
