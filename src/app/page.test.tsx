import { render, screen } from '@testing-library/react'
import Page from './page'
import { describe, it, expect, vi } from 'vitest'

// Mock auth
vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

// Mock auth components
vi.mock('@/components/auth-components', () => ({
    SignOut: () => <button>Sign Out</button>,
}))

import { auth } from '@/auth'

describe('Page', () => {
    it('renders authenticated state', async () => {
        // Mock session
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vi.mocked(auth) as any).mockResolvedValue({
            user: { name: 'Test User', email: 'test@example.com' }
        })

        const jsx = await Page()
        render(jsx)

        expect(screen.getByText('Test User')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('renders unauthenticated state', async () => {
        // Mock no session
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vi.mocked(auth) as any).mockResolvedValue(null)

        const jsx = await Page()
        render(jsx)

        expect(screen.getByText(/Not authenticated/i)).toBeInTheDocument()
    })
})
