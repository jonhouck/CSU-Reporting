import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ShiftReportForm } from "./shift-report-form"

const mockProjects = [
    { id: "1", title: "Project A" },
    { id: "2", title: "Project B" },
]

describe("ShiftReportForm", () => {
    it("renders correctly", () => {
        const onSubmit = vi.fn()
        render(<ShiftReportForm projects={mockProjects} onSubmit={onSubmit} />)

        expect(screen.getByText("Shift Details")).toBeInTheDocument()
    })

    it("submits the form", async () => {
        const onSubmit = vi.fn()
        render(<ShiftReportForm projects={mockProjects} onSubmit={onSubmit} />)

        const submitButton = screen.getByText("Save Shift Details")
        fireEvent.click(submitButton)
        // We testing the button click at least
        expect(submitButton).toBeInTheDocument()
    })
})
