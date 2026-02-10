import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { BulletPointEditor } from "./bullet-point-editor"

describe("BulletPointEditor", () => {
    it("renders the empty state correctly", () => {
        const onChange = vi.fn()
        render(<BulletPointEditor bullets={[]} onChange={onChange} />)

        expect(screen.getByText("Work Details")).toBeInTheDocument()
        expect(screen.getByText(/No bullet points added yet/)).toBeInTheDocument()
    })

    it("calls onChange when 'Add Bullet' is clicked", () => {
        const onChange = vi.fn()
        render(<BulletPointEditor bullets={[]} onChange={onChange} />)

        const addButton = screen.getByText("Add Bullet")
        fireEvent.click(addButton)

        expect(onChange).toHaveBeenCalledWith([""])
    })

    it("calls onChange when a bullet is updated", () => {
        const onChange = vi.fn()
        render(<BulletPointEditor bullets={["Test Bullet"]} onChange={onChange} />)

        const input = screen.getByDisplayValue("Test Bullet")
        fireEvent.change(input, { target: { value: "Updated Bullet" } })

        expect(onChange).toHaveBeenCalledWith(["Updated Bullet"])
    })

    it("calls onChange when a bullet is removed", () => {
        const onChange = vi.fn()
        render(<BulletPointEditor bullets={["Bullet 1", "Bullet 2"]} onChange={onChange} />)

        const removeButtons = screen.getAllByRole("button").filter(b => b.querySelector('svg'))
        // The first two buttons are "Add Bullet" and the two trash icons
        // Actually, better to use test IDs or more specific selectors if available
        // But let's try removing the first bullet
        fireEvent.click(removeButtons[1]) // Index 0 is "Add Bullet", 1 is first Trash

        expect(onChange).toHaveBeenCalledWith(["Bullet 2"])
    })
})
