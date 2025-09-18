import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders with options', () => {
    const handleChange = vi.fn();
    render(<Select value='' onChange={handleChange} options={mockOptions} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const handleChange = vi.fn();
    render(<Select value='' onChange={handleChange} options={mockOptions} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('renders with placeholder', () => {
    const handleChange = vi.fn();
    render(
      <Select
        value=''
        onChange={handleChange}
        options={mockOptions}
        placeholder='Select an option'
      />
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('is required when required prop is true', () => {
    const handleChange = vi.fn();
    render(
      <Select value='' onChange={handleChange} options={mockOptions} required />
    );

    expect(screen.getByRole('combobox')).toBeRequired();
  });

  it('is disabled when disabled prop is true', () => {
    const handleChange = vi.fn();
    render(
      <Select value='' onChange={handleChange} options={mockOptions} disabled />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies custom className', () => {
    const handleChange = vi.fn();
    render(
      <Select
        value=''
        onChange={handleChange}
        options={mockOptions}
        className='custom-class'
      />
    );

    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });

  it('renders with id and name attributes', () => {
    const handleChange = vi.fn();
    render(
      <Select
        value=''
        onChange={handleChange}
        options={mockOptions}
        id='test-id'
        name='test-name'
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'test-id');
    expect(select).toHaveAttribute('name', 'test-name');
  });

  it('shows selected value', () => {
    const handleChange = vi.fn();
    render(
      <Select value='option2' onChange={handleChange} options={mockOptions} />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
  });
});
