import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CaseCard } from './CaseCard';
import type { Case } from '../../../graphql/client';

const mockCase: Case = {
  id: 'test-case-1',
  title: 'Test Case Title',
  description: 'This is a test case description',
  status: 'OPEN',
  priority: 3,
  slaMinutes: 60,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
  notes: [],
  notifications: [],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CaseCard', () => {
  it('renders case title and description', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    expect(screen.getByText('Test Case Title')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test case description')
    ).toBeInTheDocument();
  });

  it('renders case status with correct icon', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    expect(screen.getByText('OPEN')).toBeInTheDocument();
  });

  it('renders priority with correct color', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    const priorityElement = screen.getByText('3');
    expect(priorityElement).toHaveClass('text-yellow-600');
  });

  it('renders SLA information', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    expect(screen.getByText('SLA: 60m')).toBeInTheDocument();
  });

  it('renders notes count', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    expect(screen.getByText('0 notes')).toBeInTheDocument();
  });

  it('renders formatted creation date', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    // Check that the date is formatted and contains expected parts
    const dateElement = screen.getByText(/Jan 1/);
    expect(dateElement).toBeInTheDocument();
    expect(dateElement.textContent).toMatch(/Jan 1, \d{1,2}:\d{2} (AM|PM)/);
  });

  it('links to case detail page', () => {
    renderWithRouter(<CaseCard case_={mockCase} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/cases/test-case-1');
  });

  it('applies correct priority colors', () => {
    const { rerender } = renderWithRouter(
      <CaseCard case_={{ ...mockCase, priority: 1 }} />
    );
    expect(screen.getByText('1')).toHaveClass('text-green-600');

    rerender(
      <BrowserRouter>
        <CaseCard case_={{ ...mockCase, priority: 4 }} />
      </BrowserRouter>
    );
    expect(screen.getByText('4')).toHaveClass('text-red-600');
  });

  it('displays correct status for different case statuses', () => {
    const { rerender } = renderWithRouter(
      <CaseCard case_={{ ...mockCase, status: 'IN_PROGRESS' }} />
    );
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <CaseCard case_={{ ...mockCase, status: 'RESOLVED' }} />
      </BrowserRouter>
    );
    expect(screen.getByText('RESOLVED')).toBeInTheDocument();
  });
});
