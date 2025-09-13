import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormField } from './FormField'
import { Input } from '../../atoms'

describe('FormField', () => {
  it('renders label and children', () => {
    const handleChange = vi.fn()
    render(
      <FormField label="Test Field">
        <Input value="" onChange={handleChange} />
      </FormField>
    )
    
    expect(screen.getByText('Test Field')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows required indicator when required is true', () => {
    const handleChange = vi.fn()
    render(
      <FormField label="Required Field" required>
        <Input value="" onChange={handleChange} />
      </FormField>
    )
    
    const label = screen.getByText('Required Field')
    expect(label).toHaveClass('after:content-["*"]')
  })

  it('displays error message when error is provided', () => {
    const handleChange = vi.fn()
    render(
      <FormField label="Test Field" error="This field is required">
        <Input value="" onChange={handleChange} />
      </FormField>
    )
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const handleChange = vi.fn()
    const { container } = render(
      <FormField label="Test Field" className="custom-class">
        <Input value="" onChange={handleChange} />
      </FormField>
    )
    
    const fieldContainer = container.firstChild as HTMLElement
    expect(fieldContainer).toHaveClass('custom-class')
  })

  it('does not show error when no error is provided', () => {
    const handleChange = vi.fn()
    render(
      <FormField label="Test Field">
        <Input value="" onChange={handleChange} />
      </FormField>
    )
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
