import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusFilter } from './StatusFilter';

describe('StatusFilter', () => {
  it('renders all status options', () => {
    const handleStatusChange = vi.fn();
    render(
      <StatusFilter selectedStatus='ALL' onStatusChange={handleStatusChange} />
    );

    expect(screen.getByText('All Cases')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
    expect(screen.getByText('Breached')).toBeInTheDocument();
  });

  it('calls onStatusChange when a status is clicked', () => {
    const handleStatusChange = vi.fn();
    render(
      <StatusFilter selectedStatus='ALL' onStatusChange={handleStatusChange} />
    );

    fireEvent.click(screen.getByText('Open'));
    expect(handleStatusChange).toHaveBeenCalledWith('OPEN');
  });

  it('highlights the selected status', () => {
    const handleStatusChange = vi.fn();
    render(
      <StatusFilter
        selectedStatus='IN_PROGRESS'
        onStatusChange={handleStatusChange}
      />
    );

    const selectedButton = screen.getByText('In Progress');
    expect(selectedButton).toHaveClass('bg-primary-600', 'text-white');
  });

  it('applies correct styling to unselected statuses', () => {
    const handleStatusChange = vi.fn();
    render(
      <StatusFilter selectedStatus='ALL' onStatusChange={handleStatusChange} />
    );

    const unselectedButton = screen.getByText('Open');
    expect(unselectedButton).toHaveClass('bg-gray-200', 'text-gray-700');
  });

  it('renders all status buttons as clickable', () => {
    const handleStatusChange = vi.fn();
    render(
      <StatusFilter selectedStatus='ALL' onStatusChange={handleStatusChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5); // All Cases, Open, In Progress, Resolved, Breached
  });
});
