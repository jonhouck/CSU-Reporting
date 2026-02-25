"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function UserWidget() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <div className="h-10 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    }

    if (!session?.user) {
        return (
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => signIn()}>Sign In</Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-1 px-4 shadow-sm">
            <div className="flex items-center gap-3">
                {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium text-sm border border-blue-200 dark:border-blue-800">
                        {session.user.name?.charAt(0) || "U"}
                    </div>
                )}
                <div className="hidden sm:block">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                </div>
            </div>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
            <Button size="sm" variant="ghost" onClick={() => signOut()}>Sign Out</Button>
        </div>
    )
}
