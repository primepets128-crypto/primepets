import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminOrders from './AdminOrders';
import { DataProvider } from '../../context/DataContext';
import { AuthProvider } from '../../context/AuthContext';
import axios from 'axios';

vi.mock('axios');

describe('AdminOrders', () => {
  it('renders orders correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AdminOrders />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Orders Management')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('No orders found')).toBeInTheDocument();
    });
  });
});
