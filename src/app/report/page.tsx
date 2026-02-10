"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ShiftReportForm, ShiftFormValues } from "@/components/shift-report-form"
import { BulletPointEditor } from "@/components/bullet-point-editor"
import { PhotoUpload, PhotoAttachment } from "@/components/photo-upload"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Mock projects for now until we have a real siteId/listId in ENV
const MOCK_PROJECTS = [
    { id: "1", title: "Site Shutdown - Main North" },
    { id: "2", title: "Project Alpha - Pipeline Repair" },
    { id: "3", title: "CSU Maintenance - Western Region" },
]

export default function ReportingPage() {
    const { data: session } = useSession()
    const [bullets, setBullets] = useState<string[]>([])
    const [photos, setPhotos] = useState<PhotoAttachment[]>([])
    const [shiftDetails, setShiftDetails] = useState<ShiftFormValues | null>(null)

    const handleShiftSubmit = (data: ShiftFormValues) => {
        setShiftDetails(data)
    }

    const handleGenerateReport = () => {
        console.log("Generating Report with:", {
            shiftDetails,
            bullets,
            photos,
        })
        alert("Report data captured! PDF Generation is the next task.")
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Daily Shift Report</h1>
                <p className="text-muted-foreground">Complete the details below to generate your shift report.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <section className="space-y-4">
                    <ShiftReportForm
                        projects={MOCK_PROJECTS}
                        onSubmit={handleShiftSubmit}
                        defaultValues={shiftDetails || undefined}
                    />
                </section>

                <section className="space-y-4">
                    <BulletPointEditor
                        bullets={bullets}
                        onChange={setBullets}
                    />
                </section>

                <section className="space-y-4">
                    <PhotoUpload
                        photos={photos}
                        onChange={setPhotos}
                    />
                </section>

                <div className="pt-4 flex flex-col gap-4">
                    <Separator />
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Reset Form
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleGenerateReport}
                            disabled={!shiftDetails || bullets.length === 0}
                        >
                            Generate PDF Report
                        </Button>
                    </div>
                    {!shiftDetails && (
                        <p className="text-xs text-center text-muted-foreground">
                            Please save shift details before generating the report.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
