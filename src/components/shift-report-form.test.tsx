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
