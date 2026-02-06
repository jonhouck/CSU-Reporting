import { Client } from "@microsoft/microsoft-graph-client"

export interface Project {
    id: string
    fields: {
        Title: string
        [key: string]: unknown
    }
}

export class SharePointService {
    private client: Client

    constructor(accessToken: string) {
        this.client = Client.init({
            authProvider: (done) => {
                done(null, accessToken)
            },
        })
    }

    /**
     * Fetches projects from the SharePoint "Project Tracker" list.
     * Note: This implementation targets the raw list items.
     * The requirement mentions a "This week's work" view.
     * Since Graph API list item fetching by View ID is not standard in v1.0 for simple queries,
     * we are fetching items and relying on the API (or future filters) to narrow the scope.
     * 
     * @param siteId The SharePoint Site ID (e.g. mwdsocal.sharepoint.com,UUID,UUID)
     * @param listId The SharePoint List ID (GUID)
     * @returns Array of Project items
     */
    async getProjects(siteId: string, listId: string): Promise<Project[]> {
        if (!siteId || !listId) {
            throw new Error("Site ID and List ID are required");
        }

        try {
            const response = await this.client.api(`/sites/${siteId}/lists/${listId}/items`)
                .expand('fields')
                .top(50) // Limit to top 50 mostly relevant items
                .get()

            return response.value as Project[]
        } catch (error) {
            console.error("Error fetching projects from SharePoint:", error)
            throw new Error("Failed to fetch projects from SharePoint")
        }
    }
}
