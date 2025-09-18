import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with value', () => {
    const handleChange = vi.fn();
    render(<Input value='test value' onChange={handleChange} />);

    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input value='' onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('renders with placeholder', () => {
    const handleChange = vi.fn();
    render(<Input value='' onChange={handleChange} placeholder='Enter text' />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('is required when required prop is true', () => {
    const handleChange = vi.fn();
    render(<Input value='' onChange={handleChange} required />);

    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('is disabled when disabled prop is true', () => {
    const handleChange = vi.fn();
    render(<Input value='' onChange={handleChange} disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    const handleChange = vi.fn();
    render(<Input value='' onChange={handleChange} className='custom-class' />);

    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('renders with correct type', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <Input value='' onChange={handleChange} type='email' />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input value='' onChange={handleChange} type='password' />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });

  it('renders with id and name attributes', () => {
    const handleChange = vi.fn();
    render(
      <Input value='' onChange={handleChange} id='test-id' name='test-name' />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-id');
    expect(input).toHaveAttribute('name', 'test-name');
  });
});
