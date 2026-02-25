"use server"

import { auth } from "@/auth"
import { SharePointService, Project } from "@/lib/sharepoint"

export async function getSharePointProjects(): Promise<Project[]> {
    const session = await auth()

    if (!session || !session.accessToken) {
        console.error("User is not authenticated or missing access token")
        return []
    }

    const siteId = process.env.SHAREPOINT_SITE_ID
    const listId = process.env.SHAREPOINT_LIST_ID

    if (!siteId || !listId) {
        console.error("Missing SharePoint Site ID or List ID in environment variables")
        return []
    }

    try {
        const spService = new SharePointService(session.accessToken)
        const projects = await spService.getProjects(siteId, listId)
        return projects
    } catch (error) {
        console.error("Failed to execute getSharePointProjects server action:", error)
        return []
    }
}
