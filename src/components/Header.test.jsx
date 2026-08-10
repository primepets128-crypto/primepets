import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

// Mock matchMedia if not supported by jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Header Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              {ui}
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders the logo and brand name', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Prime Pets')).toBeInTheDocument();
    expect(screen.getByText('Prime Pets')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Offer Zone')).toBeInTheDocument();
    expect(screen.getByText('Prime Pets Hub')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('opens mobile menu on hamburger click', () => {
    renderWithProviders(<Header />);
    const menuButton = screen.getByLabelText('Menu');
    
    // Initially hidden - only desktop items are visible
    // After clicking menu button, the mobile menu with Sign In / Register should be visible
    fireEvent.click(menuButton);
    expect(screen.getByText('Sign In / Register')).toBeInTheDocument();
    
    // Click close
    const closeBtn = screen.getByLabelText('Menu'); 
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Sign In / Register')).not.toBeInTheDocument();
  });

  it('updates search query', () => {
    renderWithProviders(<Header />);
    const searchInput = screen.getByPlaceholderText(/Search for/i);
    fireEvent.change(searchInput, { target: { value: 'Dog Food' } });
    expect(searchInput.value).toBe('Dog Food');
  });
});
