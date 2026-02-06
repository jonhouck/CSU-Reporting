
import { render, screen } from "@testing-library/react"
import { SignIn, SignOut } from "./auth-components"
import { describe, it, expect, vi } from "vitest"

// Mock the imports from @/auth
vi.mock("@/auth", () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
}))

describe("Auth Components", () => {
    it("SignIn renders correctly", () => {
        render(<SignIn />)
        const button = screen.getByRole("button", { name: /sign in/i })
        expect(button).toBeDefined()
    })

    it("SignOut renders correctly", () => {
        render(<SignOut />)
        const button = screen.getByRole("button", { name: /sign out/i })
        expect(button).toBeDefined()
    })
})
