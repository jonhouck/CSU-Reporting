
import { SignIn } from "@/components/auth-components"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="flex w-full max-w-sm flex-col items-center space-y-6 rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                    <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Sign in to access the CSU Reporting Dashboard
                    </p>
                </div>

                <div className="w-full">
                    <SignIn className="w-full" size="lg" />
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Authorized personnel only. Contact IT for access.
                </p>
            </div>
        </div>
    )
}
