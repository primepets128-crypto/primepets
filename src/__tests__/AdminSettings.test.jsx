import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');
const refreshDataMock = vi.fn();

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: {
      storeName: 'Prime Pets',
      whatsappOrderNumber: '+919763405605',
      contactPhone: '9876543210',
    },
    refreshData: refreshDataMock,
  }),
}));

vi.mock('../../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

import axios from 'axios';
import AdminSettings from '../../pages/admin/AdminSettings';

describe('AdminSettings', () => {
  beforeEach(() => {
    axios.put = vi.fn().mockResolvedValue({ data: { success: true } });
  });

  it('renders general settings by default', () => {
    render(<MemoryRouter><AdminSettings /></MemoryRouter>);
    expect(screen.getByText('Store Name')).toBeTruthy();
    expect(screen.getByDisplayValue('Prime Pets')).toBeTruthy();
  });

  it('switches to contact tab and shows contact fields', () => {
    render(<MemoryRouter><AdminSettings /></MemoryRouter>);
    
    const contactTab = screen.getByText('Contact & WhatsApp');
    fireEvent.click(contactTab);
    
    expect(screen.getByText(/Order Notifications WhatsApp Number/i)).toBeTruthy();
    expect(screen.getByDisplayValue('+919763405605')).toBeTruthy();
  });

  it('saves settings', async () => {
    render(<MemoryRouter><AdminSettings /></MemoryRouter>);
    
    const input = screen.getByDisplayValue('Prime Pets');
    fireEvent.change(input, { target: { name: 'storeName', value: 'Prime Pets Updated' } });
    
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/settings', expect.objectContaining({
        storeName: 'Prime Pets Updated'
      }));
    });
  });
});
