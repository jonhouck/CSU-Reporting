import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ShiftReportForm } from "./shift-report-form"

const mockProjects = [
    { id: "1", title: "Project A" },
    { id: "2", title: "Project B" },
]

describe("ShiftReportForm", () => {
    it("renders correctly", () => {
        const onChange = vi.fn()
        render(<ShiftReportForm projects={mockProjects} onChange={onChange} />)

        expect(screen.getByText("Shift Details")).toBeInTheDocument()
    })

    it("no longer renders a manual save button", async () => {
        const onChange = vi.fn()
        render(<ShiftReportForm projects={mockProjects} onChange={onChange} />)

        const submitButton = screen.queryByText("Save Shift Details")
        expect(submitButton).not.toBeInTheDocument()
    })
})

import { shiftFormSchema } from "./shift-report-form"

describe("shiftFormSchema validation", () => {
    it("fails when a future date is provided", () => {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 1)
        
        const result = shiftFormSchema.safeParse({
            projectId: "1",
            shift: "Day Shift",
            date: futureDate
        })
        
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Date cannot be in the future.")
        }
    })

    it("succeeds when a valid past or present date is provided", () => {
        const result = shiftFormSchema.safeParse({
            projectId: "1",
            shift: "Day Shift",
            date: new Date()
        })
        
        expect(result.success).toBe(true)
    })
})
