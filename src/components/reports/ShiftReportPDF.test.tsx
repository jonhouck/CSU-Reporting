/* eslint-disable @next/next/no-img-element */
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ShiftReportPDF from './ShiftReportPDF'

// Mock @react-pdf/renderer since it doesn't work well in JSDOM environment
/*
  The actual PDF generation relies on canvas/node APIs not fully present in jsdom.
  However, we can at least test that the component renders without crashing if we mock the primitives
  or just ensure the component function runs.
  
  For now, we'll do a basic smoke test.
*/

vi.mock('@react-pdf/renderer', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Document: ({ children }: any) => <div>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Page: ({ children }: any) => <div>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Text: ({ children }: any) => <span>{children}</span>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    View: ({ children }: any) => <div>{children}</div>,
    Image: () => <img alt="mock" />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StyleSheet: { create: (styles: any) => styles },
    Font: { register: () => { } },
}))

describe('ShiftReportPDF', () => {
    it('renders without crashing', () => {
        const props = {
            projectTitle: 'Test Project',
            date: new Date('2023-01-01T12:00:00'), // Noon to avoid timezone shifts
            shift: 'Day',
            bullets: ['Task 1', 'Task 2'],
            photos: [
                {
                    id: '1',
                    preview: 'blob:test',
                    caption: 'Test Photo',
                    file: new File([''], 'test.png', { type: 'image/png' })
                }
            ]
        }

        // Since we mocked the primitives, we can render it with RTL
        const { getByText } = render(<ShiftReportPDF {...props} />)

        expect(getByText('Test Project')).toBeInTheDocument()
        expect(getByText('January 1st, 2023')).toBeInTheDocument()
        expect(getByText('Day')).toBeInTheDocument()
        expect(getByText('Task 1')).toBeInTheDocument()
        expect(getByText('Task 2')).toBeInTheDocument()
        expect(getByText('Test Photo')).toBeInTheDocument()
    })

    it('renders "No work details recorded" when bullets are empty', () => {
        const props = {
            projectTitle: 'Test Project',
            date: new Date(),
            shift: 'Day',
            bullets: [],
            photos: []
        }

        const { getByText } = render(<ShiftReportPDF {...props} />)
        expect(getByText('No work details recorded.')).toBeInTheDocument()
        expect(getByText('No photos attached.')).toBeInTheDocument()
    })
})
