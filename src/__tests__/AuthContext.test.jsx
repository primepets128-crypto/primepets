import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { user, login, logout, register, isAdmin } = useAuth();
  
  return (
    <div>
      <div data-testid="user-email">{user ? user.email : 'No User'}</div>
      <div data-testid="is-admin">{isAdmin ? 'true' : 'false'}</div>
      <button onClick={() => login('admin@primepets.com', 'password')}>Login Admin</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('prime-pets-users-db', JSON.stringify([{
      name: 'Admin',
      email: 'admin@primepets.com',
      password: 'password',
      role: 'admin'
    }]));
  });

  it('provides default unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-email').textContent).toBe('No User');
    expect(screen.getByTestId('is-admin').textContent).toBe('false');
  });

  it('allows admin login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      screen.getByText('Login Admin').click();
      // Wait for simulated network delay
      await new Promise(resolve => setTimeout(resolve, 600));
    });
    
    expect(screen.getByTestId('user-email').textContent).toBe('admin@primepets.com');
    expect(screen.getByTestId('is-admin').textContent).toBe('true');
  });
  
  it('allows logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      screen.getByText('Login Admin').click();
      await new Promise(resolve => setTimeout(resolve, 600));
    });
    
    await act(async () => {
      screen.getByText('Logout').click();
    });
    
    expect(screen.getByTestId('user-email').textContent).toBe('No User');
  });
});
