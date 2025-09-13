import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Layout', () => {
  it('renders children', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders navigation header', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    expect(screen.getByText('Dealer Support')).toBeInTheDocument()
    expect(screen.getByText('Case Management System')).toBeInTheDocument()
  })

  it('has link to home page', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const homeLink = screen.getByRole('link', { name: /dealer support/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('applies correct layout classes', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const mainElement = screen.getByText('Test Content').closest('main')
    expect(mainElement).toHaveClass('max-w-7xl', 'mx-auto', 'py-6')
  })

  it('renders navigation with correct styling', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('bg-white', 'shadow')
  })
})
