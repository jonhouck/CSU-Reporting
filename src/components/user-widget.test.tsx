import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { UserWidget } from "./user-widget"
import { useSession } from "next-auth/react"

// Mock next-auth/react useSession
vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}))

// Mock auth-components
vi.mock("@/components/auth-components", () => ({
    SignIn: () => <button>Sign In</button>,
    SignOut: () => <button>Sign Out</button>,
}))

describe("UserWidget", () => {
    it("renders loading state", () => {
        vi.mocked(useSession).mockReturnValue({
            data: null,
            status: "loading",
            update: vi.fn(),
        })

        const { container } = render(<UserWidget />)
        expect(container.querySelector(".animate-pulse")).toBeInTheDocument()
    })

    it("renders sign in button when unauthenticated", () => {
        vi.mocked(useSession).mockReturnValue({
            data: null,
            status: "unauthenticated",
            update: vi.fn(),
        })

        render(<UserWidget />)
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("renders user information when authenticated", () => {
        vi.mocked(useSession).mockReturnValue({
            data: {
                user: {
                    name: "John Doe",
                    email: "john@example.com",
                    image: "http://example.com/avatar.png",
                },
                expires: "9999-12-31T23:59:59.999Z",
            },
            status: "authenticated",
            update: vi.fn(),
        })

        render(<UserWidget />)
        expect(screen.getByText("John Doe")).toBeInTheDocument()
        expect(screen.getByRole("img", { name: /john doe/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument()
    })
})
