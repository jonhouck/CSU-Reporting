import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SharePointService } from './sharepoint'
import { Client } from '@microsoft/microsoft-graph-client'

// Mock the Microsoft Graph Client
vi.mock('@microsoft/microsoft-graph-client', () => {
    return {
        Client: {
            init: vi.fn().mockReturnValue({
                api: vi.fn().mockReturnThis(),
                header: vi.fn().mockReturnThis(),
                expand: vi.fn().mockReturnThis(),
                top: vi.fn().mockReturnThis(),
                get: vi.fn()
            })
        }
    }
})

describe('SharePointService', () => {
    let service: SharePointService
    const mockAccessToken = 'mock-access-token'
    const mockSiteId = 'mock-site-id'
    const mockListId = 'mock-list-id'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new SharePointService(mockAccessToken)
    })

    it('should initialize the Graph Client with the provided access token', () => {
        expect(Client.init).toHaveBeenCalled()
    })

    it('should fetch projects successfully', async () => {
        const mockFetchData = [
            { id: '1', fields: { Title: 'Project A', field_4: 'This Weeks Work', field_17: 'Desc A' } },
            { id: '2', fields: { Title: 'Project B', field_4: 'this weeks work', field_17: 'Desc B' } },
            { id: '3', fields: { Title: 'Project C', field_4: 'Completed', field_17: 'Desc C' } }
        ]

        // Get the mocked client instance
        const mockClient = (Client.init as unknown as ReturnType<typeof vi.fn>).mock.results[0].value
        mockClient.get.mockResolvedValue({ value: mockFetchData })

        const projects = await service.getProjects(mockSiteId, mockListId)

        expect(mockClient.api).toHaveBeenCalledWith(`/sites/${mockSiteId}/lists/${mockListId}/items`)
        expect(mockClient.expand).toHaveBeenCalledWith('fields')
        expect(projects).toEqual([mockFetchData[0], mockFetchData[1]])
    })

    it('should throw an error if fetching fails', async () => {
        const mockClient = (Client.init as unknown as ReturnType<typeof vi.fn>).mock.results[0].value
        mockClient.get.mockRejectedValue(new Error('Graph API Error'))

        await expect(service.getProjects(mockSiteId, mockListId)).rejects.toThrow('Failed to fetch projects from SharePoint')
    })

    it('should throw an error is Site ID is missing', async () => {
        await expect(service.getProjects('', mockListId)).rejects.toThrow('Site ID and List ID are required')
    })
})
