import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminPayment from './AdminPayment';
import { DataProvider } from '../../context/DataContext';
import { AuthProvider } from '../../context/AuthContext';

describe('AdminPayment', () => {
  it('renders payment settings correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AdminPayment />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Payment Integrations')).toBeInTheDocument();
    expect(screen.getByText('Razorpay Integration')).toBeInTheDocument();
  });
});
