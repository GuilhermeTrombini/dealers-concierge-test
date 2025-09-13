import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from './Label'

describe('Label', () => {
  it('renders with children', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders as label element', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label').tagName).toBe('LABEL')
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </>
    )
    
    const label = screen.getByText('Test Label')
    const input = screen.getByRole('textbox')
    
    expect(label).toHaveAttribute('for', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('shows required indicator when required is true', () => {
    render(<Label required>Required Label</Label>)
    
    const label = screen.getByText('Required Label')
    expect(label).toHaveClass('after:content-["*"]')
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Test Label</Label>)
    
    expect(screen.getByText('Test Label')).toHaveClass('custom-class')
  })

  it('has correct base classes', () => {
    render(<Label>Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700')
  })
})
