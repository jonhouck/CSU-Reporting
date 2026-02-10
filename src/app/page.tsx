
import { auth } from "@/auth"
import { SignOut } from "@/components/auth-components"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CSU Reporting</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Daily Shift Reporting System
          </p>
        </div>

        <div className="p-6 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <h2 className="font-semibold mb-4">Current Session</h2>
          {session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {session.user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="User"
                    className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-700"
                  />
                )}
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-sm text-zinc-500">{session.user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <SignOut />
              </div>
            </div>
          ) : (
            <div className="text-amber-600 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md text-sm border border-amber-200 dark:border-amber-900/50">
              Not authenticated. You should have been redirected to login.
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/report">Create Daily Report</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Go to Login Page</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
