import { render, screen } from '@testing-library/react'
import Page from './page'
import { describe, it, expect } from 'vitest'

describe('Page', () => {
    it('renders without crashing', () => {
        render(<Page />)
        const main = screen.getByRole('main') // Next.js default template usually has a main tag
        // If not, we might need to adjust, but let's assume default structure or just check simple existence
        expect(main).toBeInTheDocument()
    })
})
