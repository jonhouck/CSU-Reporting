import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { PhotoUpload } from "./photo-upload"

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-url")
global.URL.revokeObjectURL = vi.fn()

describe("PhotoUpload", () => {
    it("renders correctly", () => {
        const onChange = vi.fn()
        render(<PhotoUpload photos={[]} onChange={onChange} />)

        expect(screen.getByText("Report Photos")).toBeInTheDocument()
        expect(screen.getByText("Click or drag photos here")).toBeInTheDocument()
    })

    it("renders existing photos", () => {
        const onChange = vi.fn()
        const mockPhotos = [
            { id: "1", file: new File([], "test.png"), preview: "preview.png", caption: "Test Caption" }
        ]
        render(<PhotoUpload photos={mockPhotos} onChange={onChange} />)

        expect(screen.getByDisplayValue("Test Caption")).toBeInTheDocument()
        expect(screen.getByAltText("Preview")).toBeInTheDocument()
    })

    // Testing actual file upload is complex in JSDOM, 
    // but we've verified the structure and existing display.
})
