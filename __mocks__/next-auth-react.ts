import { vi } from 'vitest'

export const useSession = vi.fn(() => ({ data: null, status: 'unauthenticated' }))
export const SessionProvider = ({ children }: { children: React.ReactNode }) => children
export const signIn = vi.fn()
export const signOut = vi.fn()
export const getCsrfToken = vi.fn()
export const getProviders = vi.fn()
export const getSession = vi.fn()
