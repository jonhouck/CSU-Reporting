import { Client } from "@microsoft/microsoft-graph-client"

export interface Project {
    id: string
    fields: {
        Title: string
        Description?: string
        ProjectStatus?: string
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
                .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
                .expand('fields')
                .top(500) // Fetch a larger batch
                .get()

            const allItems = response.value as Project[]

            // Filter projects assigned to "This Weeks Work" 
            // Handles missing or modified internal SharePoint field names 
            const weeklyProjects = allItems.filter(
                (item) => {
                    const f = item.fields;
                    const status = f.ProjectStatus || f.Project_x0020_Status || f.Status || f.OData__Status;
                    return status === "This Weeks Work" || status === "This Week's Work";
                }
            )

            console.log(`[SharePoint Debug] Fetched ${allItems.length} total raw items. Filtered down to ${weeklyProjects.length} matching "This Weeks Work".`)

            if (weeklyProjects.length === 0 && allItems.length > 0) {
                console.log(`[SharePoint Debug] Missing matching items! Here are the actual fields available on the first item:`, Object.keys(allItems[0].fields))
            }

            return weeklyProjects
        } catch (error) {
            console.error("Error fetching projects from SharePoint:", error)
            throw new Error("Failed to fetch projects from SharePoint")
        }
    }
}
