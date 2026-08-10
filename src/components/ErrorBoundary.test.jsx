import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test Error');
};

test('catches error and displays fallback UI', () => {
  // Suppress console.error for this expected error test
  const originalError = console.error;
  console.error = vi.fn();
  
  render(
    <ErrorBoundary>
      <ProblemChild />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Oops! Something broke.')).toBeInTheDocument();
  
  // Restore console.error
  console.error = originalError;
});

test('renders children if no error', () => {
  render(
    <ErrorBoundary>
      <div>All good here!</div>
    </ErrorBoundary>
  );
  
  expect(screen.getByText('All good here!')).toBeInTheDocument();
});
