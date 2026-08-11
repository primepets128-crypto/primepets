import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('axios');
vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: {
      razorpayKeyId: 'rzp_test_123',
      whatsappOrderNumber: '+919763405605',
    },
  }),
}));

import axios from 'axios';
import CheckoutModal from '../../components/CheckoutModal';

describe('CheckoutModal', () => {
  const mockOnClose = vi.fn();
  const mockOnOrderSuccess = vi.fn();
  const cartItems = [{ id: 1, name: 'Food', price: 100, qty: 1 }];
  
  beforeEach(() => {
    axios.post = vi.fn().mockResolvedValue({ data: { id: 999 } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<CheckoutModal isOpen={false} onClose={mockOnClose} cartItems={cartItems} cartTotal={100} onOrderSuccess={mockOnOrderSuccess} />);
    expect(screen.queryByText(/Delivery Details/i)).toBeNull();
  });

  it('renders Step 1 when opened', async () => {
    render(<CheckoutModal isOpen={true} onClose={mockOnClose} cartItems={cartItems} cartTotal={100} onOrderSuccess={mockOnOrderSuccess} />);
    expect(screen.getByText(/Delivery Details/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/full name/i)).toBeTruthy();
  });

  it('validates Step 1 and proceeds to Step 2', async () => {
    render(<CheckoutModal isOpen={true} onClose={mockOnClose} cartItems={cartItems} cartTotal={100} onOrderSuccess={mockOnOrderSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/10-digit mobile number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByPlaceholderText(/complete delivery address/i), { target: { value: '123 Main St' } });
    
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Choose Payment Method/i)).toBeTruthy();
    });
  });

  it('handles COD order placement', async () => {
    render(<CheckoutModal isOpen={true} onClose={mockOnClose} cartItems={cartItems} cartTotal={100} onOrderSuccess={mockOnOrderSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/10-digit mobile number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByPlaceholderText(/complete delivery address/i), { target: { value: '123 Main St' } });
    
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Choose Payment Method/i)).toBeTruthy();
    });
    
    fireEvent.click(screen.getByText(/Cash on Delivery/i));
    fireEvent.click(screen.getByRole('button', { name: /place order/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/orders', expect.objectContaining({
        paymentMethod: 'COD',
        customerName: 'John Doe'
      }));
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Order #999 Placed Successfully/i)).toBeTruthy();
    });
  });
});
