import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');
const refreshDataMock = vi.fn();
vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: {
      razorpayKeyId: 'rzp_test_123',
    },
    refreshData: refreshDataMock,
  }),
}));

vi.mock('../../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

import axios from 'axios';
import AdminPayment from '../../pages/admin/AdminPayment';

describe('AdminPayment', () => {
  beforeEach(() => {
    axios.put = vi.fn().mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<MemoryRouter><AdminPayment /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/Payment Configuration/i)).toBeTruthy();
    });
  });

  it('shows razorpay key id input when online payment is enabled', async () => {
    render(<MemoryRouter><AdminPayment /></MemoryRouter>);
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/rzp_test_/i);
      expect(input).toBeTruthy();
      expect(input.value).toBe('rzp_test_123');
    });
  });

  it('calls PUT on save with updated settings', async () => {
    render(<MemoryRouter><AdminPayment /></MemoryRouter>);
    const input = await screen.findByPlaceholderText(/rzp_test_/i);
    fireEvent.change(input, { target: { value: 'rzp_live_456' } });
    
    const saveButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/settings', expect.objectContaining({
        razorpayKeyId: 'rzp_live_456'
      }));
    });
  });
});
