import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders with value', () => {
    const handleChange = vi.fn()
    render(<Textarea value="test value" onChange={handleChange} />)
    
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalledWith('new value')
  })

  it('renders with placeholder', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} placeholder="Enter text" />)
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('is required when required prop is true', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} required />)
    
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('is disabled when disabled prop is true', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} disabled />)
    
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies custom className', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} className="custom-class" />)
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('renders with correct number of rows', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} rows={5} />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
  })

  it('renders with id and name attributes', () => {
    const handleChange = vi.fn()
    render(<Textarea value="" onChange={handleChange} id="test-id" name="test-name" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('id', 'test-id')
    expect(textarea).toHaveAttribute('name', 'test-name')
  })
})
