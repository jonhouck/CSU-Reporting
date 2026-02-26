import { Client } from "@microsoft/microsoft-graph-client"

export interface Project {
    id: string
    fields: {
        Title: string
        Description?: string
        ProjectStatus?: string
        field_4?: string
        field_17?: string
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
            let allItems: Project[] = [];
            let response = await this.client.api(`/sites/${siteId}/lists/${listId}/items`)
                .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
                .expand('fields')
                .top(500) // Fetch a larger batch
                .get()

            if (response.value) {
                allItems = allItems.concat(response.value as Project[]);
            }

            // Loop through all pages to ensure we don't drop items
            while (response['@odata.nextLink']) {
                response = await this.client.api(response['@odata.nextLink'])
                    .header('Prefer', 'HonorNonIndexedQueriesWarningMayFailRandomly')
                    .get();
                if (response.value) {
                    allItems = allItems.concat(response.value as Project[]);
                }
            }

            // Filter projects assigned to "This Weeks Work" 
            // Handles missing or modified internal SharePoint field names 
            const weeklyProjects = allItems.filter(
                (item) => {
                    const f = item.fields;

                    // 1. Try common status keys including field_4 as identified from the SharePoint payload
                    const status = f.field_4 || f.ProjectStatus || f.Project_x0020_Status || f.Status || f.OData__Status;
                    if (typeof status === 'string') {
                        const statusLower = status.toLowerCase();
                        if (statusLower === "this weeks work" || statusLower === "this week's work") {
                            return true;
                        }
                    }

                    // 2. Dynamic Fallback: SharePoint often masks custom columns as "field_1", "field_2", etc.
                    // If we didn't find it via a known key, sweep all field values for our target string.
                    for (const key in f) {
                        if (typeof f[key] === 'string') {
                            const valLower = f[key].toLowerCase();
                            if (valLower === "this weeks work" || valLower === "this week's work") {
                                // We found the status in an opaque field (e.g., field_24).
                                return true;
                            }
                        }
                    }

                    return false;
                }
            )

            console.log(`[SharePoint Debug] Fetched ${allItems.length} total raw items. Filtered down to ${weeklyProjects.length} matching "This Weeks Work".`)

            if (allItems.length > 0) {
                console.log(`[SharePoint Debug] First item full data dump for field identification:`, JSON.stringify(allItems[0].fields, null, 2))
            }

            // Return only the firmly filtered projects
            return weeklyProjects
        } catch (error) {
            console.error("Error fetching projects from SharePoint:", error)
            throw new Error("Failed to fetch projects from SharePoint")
        }
    }
}
