import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HubPage from './HubPage';
import { CartProvider } from '../context/CartContext';
import { DataProvider } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HubPage', () => {
  it('renders hub page header', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('Prime Pets Hub 📚')).toBeInTheDocument();
  });

  it('renders featured article', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('10 Signs Your Dog Needs More Exercise')).toBeInTheDocument();
  });

  it('renders videos section', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('🎬 Video Guides')).toBeInTheDocument();
    expect(screen.getByText('How to Train Your Puppy')).toBeInTheDocument();
  });

  it('renders experts sidebar', () => {
    renderWithContext(<HubPage />);
    expect(screen.getByText('🩺 Our Experts')).toBeInTheDocument();
    expect(screen.getAllByText('Dr. Priya Sharma')[0]).toBeInTheDocument();
  });
  
  it('can switch topic tabs', () => {
    renderWithContext(<HubPage />);
    const healthTab = screen.getAllByText('Health')[0];
    fireEvent.click(healthTab);
    
    // It should still render the same articles as it currently just sets state and doesn't filter
    expect(screen.getByText('10 Signs Your Dog Needs More Exercise')).toBeInTheDocument();
  });
});
