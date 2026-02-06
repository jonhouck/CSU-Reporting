/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionProvider } from "next-auth/react"
import { vi } from "vitest"

// Mock the next-auth/react module
vi.mock("next-auth/react", async () => {
    const actual = await vi.importActual("next-auth/react")
    return {
        ...actual,
        useSession: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        SessionProvider: ({ children, session }: any) => <>{children}</>,
    }
})

export const MockAuthProvider = ({
    children,
    session = null,
}: {
    children: React.ReactNode
    session?: any
}) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}
