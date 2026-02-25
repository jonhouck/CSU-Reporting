import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ReportingPage from './page'

// Mock DownloadPDFButton to avoid full PDF generation during tests
vi.mock('@/components/reports/DownloadPDFButton', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ projectTitle, date, shift, bullets, photos, fileName }: any) => (
        <button data-testid="mock-download-btn" onClick={() => console.log('Download clicked', { projectTitle, date, shift, bullets, photos, fileName })}>
            Download PDF Report
        </button>
    )
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
    useSession: () => ({ data: null, status: 'unauthenticated' })
}))

// Mock UserWidget to prevent loading auth and next-auth
vi.mock('@/components/user-widget', () => ({
    UserWidget: () => <div data-testid="user-widget-mock">Mock User Widget</div>
}))

// Mock next/server to avoid next-auth resolution error
vi.mock('next/server', () => ({}))

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
    default: () => {
        const MockComponent = () => <div>Mock Dynamic Component</div>
        return MockComponent
    }
}))

describe('ReportingPage', () => {
    it('renders the main heading', () => {
        render(<ReportingPage />)
        const heading = screen.getByRole('heading', { level: 1, name: /Daily Shift Report/i })
        expect(heading).toBeDefined()
    })

    it('renders the subtext', () => {
        render(<ReportingPage />)
        const subtext = screen.getByText(/Complete the details below to generate your shift report./i)
        expect(subtext).toBeDefined()
    })

    it('renders the form sections', () => {
        render(<ReportingPage />)
        // Check for specific text that appears in the sub-components
        expect(screen.getByText('Project')).toBeDefined()
        expect(screen.getByText('Work Details')).toBeDefined()
        expect(screen.getByText('Report Photos')).toBeDefined()
    })

    it('renders the download button as disabled initially', () => {
        render(<ReportingPage />)
        // Initially, the main "Generate PDF Report" button is shown and disabled
        const generateBtn = screen.getByRole('button', { name: /Generate PDF Report/i })
        expect(generateBtn).toBeDefined()
        expect(generateBtn).toBeDisabled()
    })
})
