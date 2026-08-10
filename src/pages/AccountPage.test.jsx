import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AccountPage from './AccountPage';
import { CartProvider } from '../context/CartContext';
import { DataProvider } from '../context/DataContext';
import * as AuthContextModule from '../context/AuthContext';

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('AccountPage Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <DataProvider>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataProvider>
      </MemoryRouter>
    );
  };

  it('renders guest view by default', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      logout: vi.fn(),
      isAdmin: false
    });

    renderWithProviders(<AccountPage />);
    expect(screen.getByText('Welcome to Prime Pets')).toBeInTheDocument();
    expect(screen.getAllByText('Sign In')[0]).toBeInTheDocument();
  });

  it('renders logged in view when user is authenticated', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { name: 'Priya Sharma', email: 'priya.sharma@email.com', role: 'user' },
      logout: vi.fn(),
      isAdmin: false
    });

    renderWithProviders(<AccountPage />);
    
    // Should show logged in view
    expect(screen.getByText('Hey, Priya! 🐾')).toBeInTheDocument();
    expect(screen.getByText('priya.sharma@email.com')).toBeInTheDocument();
  });
});
