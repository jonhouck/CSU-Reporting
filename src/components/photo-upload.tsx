"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface PhotoAttachment {
    id: string
    file: File
    preview: string
    caption: string
}

interface PhotoUploadProps {
    photos: PhotoAttachment[]
    onChange: (photos: PhotoAttachment[]) => void
}

export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = (files: FileList) => {
        const newPhotos = Array.from(files).map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
            caption: "",
        }))
        onChange([...photos, ...newPhotos])
    }

    const removePhoto = (id: string) => {
        const photoToRemove = photos.find((p) => p.id === id)
        if (photoToRemove) {
            URL.revokeObjectURL(photoToRemove.preview)
        }
        onChange(photos.filter((p) => p.id !== id))
    }

    const updateCaption = (id: string, caption: string) => {
        onChange(
            photos.map((p) => (p.id === id ? { ...p, caption } : p))
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-md font-semibold">Report Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
            flex flex-col items-center justify-center gap-2
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
          `}
                >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-sm font-medium">Click or drag photos here</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or JPEG</p>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileInput}
                    />
                </div>

                {photos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group border rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                                <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.preview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removePhoto(photo.id)
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="p-2">
                                    <Input
                                        placeholder="Add a caption..."
                                        value={photo.caption}
                                        onChange={(e) => updateCaption(photo.id, e.target.value)}
                                        className="h-8 text-xs"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
