import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateCaseModal } from './CreateCaseModal'

describe('CreateCaseModal', () => {
  const mockOnSubmit = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when isOpen is true', () => {
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    expect(screen.getByText('Create New Case')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter case title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter case description')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <CreateCaseModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    expect(screen.queryByText('Create New Case')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    fireEvent.click(screen.getByLabelText('Close modal'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('submits form with correct data', async () => {
    mockOnSubmit.mockResolvedValue(undefined)
    
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    fireEvent.change(screen.getByPlaceholderText('Enter case title'), { target: { value: 'Test Case' } })
    fireEvent.change(screen.getByPlaceholderText('Enter case description'), { target: { value: 'Test Description' } })
    fireEvent.change(screen.getByDisplayValue('2 - Normal'), { target: { value: '3' } })
    fireEvent.change(screen.getByDisplayValue('60'), { target: { value: '120' } })
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Case' }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Case',
        description: 'Test Description',
        priority: 3,
        slaMinutes: 120,
      })
    })
  })

  it('shows loading state when submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    fireEvent.change(screen.getByPlaceholderText('Enter case title'), { target: { value: 'Test Case' } })
    fireEvent.change(screen.getByPlaceholderText('Enter case description'), { target: { value: 'Test Description' } })
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Case' }))
    
    expect(screen.getByText('Creating...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()
  })

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(undefined)
    
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    fireEvent.change(screen.getByPlaceholderText('Enter case title'), { target: { value: 'Test Case' } })
    fireEvent.change(screen.getByPlaceholderText('Enter case description'), { target: { value: 'Test Description' } })
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Case' }))
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('has required fields marked as required', () => {
    render(
      <CreateCaseModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    expect(screen.getByPlaceholderText('Enter case title')).toBeRequired()
    expect(screen.getByPlaceholderText('Enter case description')).toBeRequired()
  })
})