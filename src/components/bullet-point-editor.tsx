"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BulletPointEditorProps {
    bullets: string[]
    onChange: (bullets: string[]) => void
    title?: string
}

export function BulletPointEditor({ bullets, onChange, title = "Work Details" }: BulletPointEditorProps) {
    const addBullet = () => {
        onChange([...bullets, ""])
    }

    const updateBullet = (index: number, value: string) => {
        const newBullets = [...bullets]
        newBullets[index] = value
        onChange(newBullets)
    }

    const removeBullet = (index: number) => {
        const newBullets = bullets.filter((_, i) => i !== index)
        onChange(newBullets)
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-semibold">{title}</CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBullet}
                    className="h-8 gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Bullet
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {bullets.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No bullet points added yet. Click &quot;Add Bullet&quot; to start.
                    </p>
                ) : (
                    bullets.map((bullet, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={bullet}
                                onChange={(e) => updateBullet(index, e.target.value)}
                                placeholder="Enter work details..."
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBullet(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
