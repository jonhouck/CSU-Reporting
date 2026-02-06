import { auth } from "@/auth"

export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/login") {
        // If not authenticated and not on the login page, redirect to sign-in
        // Note: The logic in auth.ts callback handles the decision, this middleware applies it.
        // However, for simplicity with EntraID, we can often let the 'authorized' callback handle it.
    }
})

export const config = {
    // Matcher ignoring api, static files, images, etc.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
