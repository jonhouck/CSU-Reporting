"use client"

import { useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import ShiftReportPDF from "./ShiftReportPDF"

interface DownloadPDFButtonProps {
    projectTitle: string
    projectDescription?: string
    date: Date
    shift: string
    bullets: string[]
    photos: Array<{
        id: string
        preview: string
        caption: string
        file: File
    }>
    user?: {
        name?: string | null
        email?: string | null
    }
    fileName: string
}

export default function DownloadPDFButton({
    projectTitle,
    projectDescription,
    date,
    shift,
    bullets,
    photos,
    user,
    fileName
}: DownloadPDFButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        try {
            setIsGenerating(true)

            // Create the PDF document blob
            const blob = await pdf(
                <ShiftReportPDF
                    projectTitle={projectTitle}
                    projectDescription={projectDescription}
                    date={date}
                    shift={shift}
                    bullets={bullets}
                    photos={photos}
                    user={user}
                />
            ).toBlob()

            // Create a URL for the blob
            const url = URL.createObjectURL(blob)

            // Create a temporary link element and click it
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()

            // Cleanup
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Failed to generate PDF report. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button size="lg" onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? "Generating Report..." : "Download PDF Report"}
        </Button>
    )
}
