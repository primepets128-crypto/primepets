import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';
import { DataProvider } from '../context/DataContext';

describe('CheckoutModal', () => {
  it('renders checkout form correctly', () => {
    render(
      <DataProvider>
        <CheckoutModal 
          isOpen={true} 
          onClose={vi.fn()} 
          cartItems={[]} 
          cartTotal={0} 
          onOrderSuccess={vi.fn()} 
        />
      </DataProvider>
    );
    
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
  });
});
