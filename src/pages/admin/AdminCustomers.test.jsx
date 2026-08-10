import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import AdminCustomers from './AdminCustomers';
import { AuthContext } from '../../context/AuthContext';

// Mock matchMedia
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

const mockUsersDb = [
  { id: '1', name: 'Admin User', email: 'admin@primepets.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: '2', name: 'Test Customer', email: 'test@customer.com', phone: '1234567890', role: 'user', createdAt: new Date(Date.now() - 86400000).toISOString() }
];

const renderAdminCustomers = () => {
  return render(
    <AuthContext.Provider value={{ usersDb: mockUsersDb }}>
      <AdminCustomers />
    </AuthContext.Provider>
  );
};

test('renders customers table correctly', () => {
  renderAdminCustomers();
  
  expect(screen.getByText('Customers & Leads')).toBeInTheDocument();
  expect(screen.getByText('Admin User')).toBeInTheDocument();
  expect(screen.getByText('Test Customer')).toBeInTheDocument();
});

test('filters customers by search term', () => {
  renderAdminCustomers();
  
  const searchInput = screen.getByPlaceholderText('Search name, email, phone...');
  fireEvent.change(searchInput, { target: { value: 'Admin User' } });
  
  expect(screen.getByText('Admin User')).toBeInTheDocument();
  expect(screen.queryByText('Test Customer')).not.toBeInTheDocument();
});
