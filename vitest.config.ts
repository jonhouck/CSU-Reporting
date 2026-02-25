import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            'next/server': path.resolve(__dirname, './vitest.setup.ts'),
            'next-auth/react': path.resolve(__dirname, './__mocks__/next-auth-react.ts')
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'next/server': path.resolve(__dirname, './vitest.setup.ts'),
            'next-auth/react': path.resolve(__dirname, './__mocks__/next-auth-react.ts')
        }
    }
})
