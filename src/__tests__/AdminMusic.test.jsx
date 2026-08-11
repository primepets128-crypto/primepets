import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');
const refreshDataMock = vi.fn();
vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: {
      siteAudioUrl: 'https://example.com/audio.mp3',
    },
    refreshData: refreshDataMock,
  }),
}));

vi.mock('../../components/ScrollReveal', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

import axios from 'axios';
import AdminMusic from '../../pages/admin/AdminMusic';

describe('AdminMusic', () => {
  beforeEach(() => {
    axios.put = vi.fn().mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<MemoryRouter><AdminMusic /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/Site Audio/i)).toBeTruthy();
    });
  });

  it('shows current audio url', async () => {
    render(<MemoryRouter><AdminMusic /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('https://example.com/audio.mp3')).toBeTruthy();
    });
  });

  it('calls PUT on save with new audio url', async () => {
    render(<MemoryRouter><AdminMusic /></MemoryRouter>);
    
    const input = await screen.findByPlaceholderText(/https:\/\//i);
    fireEvent.change(input, { target: { value: 'https://example.com/new.mp3' } });
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/settings', expect.objectContaining({
        siteAudioUrl: 'https://example.com/new.mp3'
      }));
    });
  });

  it('resets to default', async () => {
    render(<MemoryRouter><AdminMusic /></MemoryRouter>);
    
    const resetButton = await screen.findByRole('button', { name: /reset to default/i });
    fireEvent.click(resetButton);
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/settings', expect.objectContaining({
        siteAudioUrl: null
      }));
    });
  });
});
