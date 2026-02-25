import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next-auth/react', () => ({
    useSession: () => ({ data: null, status: 'unauthenticated' })
}))

vi.mock('next/server', () => ({
    NextResponse: { json: vi.fn() },
    NextRequest: vi.fn(),
}))
