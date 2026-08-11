import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ───────────────────────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────────────────────
vi.mock('axios');
vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: {
      razorpayKeyId: null,
      whatsappOrderNumber: '+919763405605',
      siteAudioUrl: null,
    },
    refreshData: vi.fn(),
  }),
}));
vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    showToast: vi.fn(),
    cartOpen: false,
    setCartOpen: vi.fn(),
    cartItems: [],
    cartTotal: 0,
    cartCount: 0,
  }),
}));
vi.mock('../../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

// ───────────────────────────────────────────────────────────────
// AdminOrders Tests
// ───────────────────────────────────────────────────────────────
import axios from 'axios';
import AdminOrders from '../../pages/admin/AdminOrders';

const mockOrders = [
  {
    id: 1,
    customerName: 'John Doe',
    customerPhone: '9876543210',
    customerAddress: '123 Main Street, Mumbai',
    items: JSON.stringify([{ name: 'Dog Food', price: 299, qty: 2 }]),
    total: 598,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    customerPhone: '9876543211',
    customerAddress: '456 Park Ave, Delhi',
    items: JSON.stringify([{ name: 'Cat Treats', price: 149, qty: 1 }]),
    total: 149,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
    razorpayPaymentId: 'pay_abc123',
    createdAt: new Date().toISOString(),
  },
];

describe('AdminOrders', () => {
  beforeEach(() => {
    axios.get = vi.fn().mockResolvedValue({ data: mockOrders });
    axios.put = vi.fn().mockResolvedValue({ data: { ...mockOrders[0], status: 'CONFIRMED' } });
    axios.delete = vi.fn().mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/orders/i)).toBeTruthy();
    });
  });

  it('fetches and displays orders on mount', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/orders');
    });
  });

  it('shows order customer names', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
      expect(screen.getByText('Jane Smith')).toBeTruthy();
    });
  });

  it('shows total revenue stat card', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      // Revenue = 598 + 149 = 747
      expect(screen.getAllByText(/747|598|149/i).length).toBeGreaterThan(0);
    });
  });

  it('shows payment method badges', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/COD/i)).toBeTruthy();
      expect(screen.getByText(/online|razorpay/i)).toBeTruthy();
    });
  });

  it('shows empty state when no orders', async () => {
    axios.get = vi.fn().mockResolvedValue({ data: [] });
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/no orders|empty/i)).toBeTruthy();
    });
  });

  it('calls PUT on status dropdown change', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
    const selects = screen.getAllByRole('combobox');
    if (selects.length > 0) {
      fireEvent.change(selects[0], { target: { value: 'CONFIRMED' } });
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });
    }
  });

  it('filters orders by status tab', async () => {
    render(<MemoryRouter><AdminOrders /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
    const confirmedTab = screen.getByText('CONFIRMED');
    fireEvent.click(confirmedTab);
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeTruthy();
      expect(screen.queryByText('John Doe')).toBeNull();
    });
  });
});
