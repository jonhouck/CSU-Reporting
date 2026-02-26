"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { ShiftReportForm, ShiftFormValues } from "@/components/shift-report-form"
import { BulletPointEditor } from "@/components/bullet-point-editor"
import { PhotoUpload, PhotoAttachment } from "@/components/photo-upload"
import { UserWidget } from "@/components/user-widget"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getSharePointProjects } from "@/app/actions/sharepoint"
import type { Project as SPProject } from "@/lib/sharepoint"

// Dynamically import DownloadButton to avoid SSR issues with react-pdf
const DownloadPDFButton = dynamic(
    () => import("@/components/reports/DownloadPDFButton"),
    { ssr: false }
)

// Removed mock projects, using real SharePoint data now

export default function ReportingPage() {
    const { data: session, status } = useSession()
    const [bullets, setBullets] = useState<string[]>([])
    const [photos, setPhotos] = useState<PhotoAttachment[]>([])
    const [shiftDetails, setShiftDetails] = useState<ShiftFormValues | null>(null)
    const [projects, setProjects] = useState<SPProject[]>([])
    const [hasLoadedProjects, setHasLoadedProjects] = useState(false)

    useEffect(() => {
        if (session?.user) {
            getSharePointProjects().then((data) => {
                setProjects(data)
                setHasLoadedProjects(true)
            }).catch((error) => {
                console.error("Failed to load projects", error)
                setHasLoadedProjects(true)
            })
        }
    }, [session])

    const handleProjectChange = useCallback((projectId: string) => {
        setShiftDetails(prev => prev ? { ...prev, projectId } : { projectId, shift: "Day Shift", date: new Date() })
    }, []);

    const isLoadingProjects = status === "loading" || (status === "authenticated" && !hasLoadedProjects)

    const handleShiftSubmit = (data: ShiftFormValues) => {
        setShiftDetails(data)
    }

    const getProjectTitle = (id: string) => {
        return projects.find(p => p.id === id)?.fields?.Title || "Unknown Project"
    }

    const selectedProject = projects.find(p => p.id === shiftDetails?.projectId)
    const projectDescription = selectedProject?.fields?.field_17 || selectedProject?.fields?.Description || ""

    const mappedProjects = projects.map(p => ({
        id: p.id,
        title: p.fields?.Title || "Untitled Project"
    }))

    // Prepare data for the PDF
    const pdfProps = shiftDetails ? {
        projectTitle: getProjectTitle(shiftDetails.projectId),
        projectDescription: projectDescription,
        date: shiftDetails.date,
        shift: shiftDetails.shift,
        bullets: bullets,
        photos: photos.map(p => ({
            id: p.id,
            preview: p.preview,
            caption: p.caption,
            file: p.file
        })),
        user: session?.user || undefined
    } : null

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
            <div className="flex flex-row justify-between items-start gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Daily Shift Report</h1>
                    <p className="text-muted-foreground">Complete the details below to generate your shift report.</p>
                </div>
                <div>
                    <UserWidget />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <section className="space-y-4">
                    {isLoadingProjects ? (
                        <p className="text-sm text-muted-foreground">Loading projects from SharePoint...</p>
                    ) : (
                        <ShiftReportForm
                            projects={mappedProjects}
                            onSubmit={handleShiftSubmit}
                            defaultValues={shiftDetails || undefined}
                            onProjectChange={handleProjectChange}
                        />
                    )}
                </section>

                {projectDescription && (
                    <section className="space-y-2 bg-secondary/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Project Description</h3>
                        <p className="text-sm">{projectDescription}</p>
                    </section>
                )}

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

                        {shiftDetails && bullets.length > 0 && pdfProps ? (
                            <DownloadPDFButton
                                {...pdfProps}
                                fileName={`ShiftReport_${shiftDetails.projectId}_${shiftDetails.date.toISOString().split('T')[0]}.pdf`}
                            />
                        ) : (
                            <Button size="lg" disabled>
                                Generate PDF Report
                            </Button>
                        )}
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
