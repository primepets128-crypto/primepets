import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { DataProvider } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';

// Mock recharts to prevent ResizeObserver errors in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: () => <div data-testid="area-chart" />,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

describe('AdminDashboard', () => {
  it('renders the dashboard statistics', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <AdminDashboard />
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Welcome back, Admin 👋')).toBeInTheDocument();
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('Total Leads/Users')).toBeInTheDocument();
    expect(screen.getByText('Active Deals')).toBeInTheDocument();
  });
});
