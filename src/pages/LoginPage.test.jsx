import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import LoginPage from './LoginPage';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

// Mock matchMedia
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

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockUpdateAdminCredentials = vi.fn();

const renderLoginPage = (isAuthenticated = false) => {
  return render(
    <AuthContext.Provider value={{ login: mockLogin, register: mockRegister, updateAdminCredentials: mockUpdateAdminCredentials, isAuthenticated }}>
      <DataContext.Provider value={{ frontendSettings: { logoBase64: null } }}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

test('renders login page correctly', () => {
  renderLoginPage();
  expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});

test('toggles to register mode', () => {
  renderLoginPage();
  const signUpBtn = screen.getByText('Sign Up');
  fireEvent.click(signUpBtn);
  
  expect(screen.getByText('Join the Pack')).toBeInTheDocument();
  expect(screen.getByText('Create Account')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument();
});

test('handles login submission', () => {
  renderLoginPage();
  
  mockLogin.mockReturnValue(true);
  
  const identifierInput = screen.getByPlaceholderText('Enter your identifier');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  
  fireEvent.change(identifierInput, { target: { value: 'admin' } });
  fireEvent.change(passwordInput, { target: { value: 'Primepets@848587' } });
  
  const submitBtn = screen.getByRole('button', { name: 'Sign In' });
  fireEvent.click(submitBtn);
  
  expect(mockLogin).toHaveBeenCalledWith('admin', 'Primepets@848587');
});

test('handles registration submission', () => {
  renderLoginPage();
  const signUpBtn = screen.getByText('Sign Up');
  fireEvent.click(signUpBtn);
  
  mockRegister.mockReturnValue(true);
  
  const nameInput = screen.getByPlaceholderText('e.g. John Doe');
  const identifierInput = screen.getByPlaceholderText('Enter your identifier');
  const passwordInput = screen.getByPlaceholderText('••••••••');

  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.change(identifierInput, { target: { value: 'john@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
  fireEvent.change(nameInput, { target: { value: 'Test User' } });
  fireEvent.change(identifierInput, { target: { value: 'test@test.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
  const submitBtn = screen.getByRole('button', { name: 'Create Account' });
  fireEvent.click(submitBtn);
  
  expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@test.com', 'password123');
});
