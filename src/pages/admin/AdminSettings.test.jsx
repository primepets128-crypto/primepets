import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import AdminSettings from './AdminSettings';
import { DataContext } from '../../context/DataContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock axios
vi.mock('axios', () => ({
  default: {
    put: vi.fn().mockResolvedValue({ data: {} })
  }
}));

const mockRefreshData = vi.fn();

const renderAdminSettings = () => {
  return render(
    <MemoryRouter>
      <DataContext.Provider value={{ 
        frontendSettings: { storeName: 'Prime Pets', tagline: 'Premium Store', logoChar: 'P' }, 
        refreshData: mockRefreshData 
      }}>
        <AdminSettings />
      </DataContext.Provider>
    </MemoryRouter>
  );
};

test('renders settings form correctly', () => {
  renderAdminSettings();
  expect(screen.getByText('Frontend Settings')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Prime Pets')).toBeInTheDocument();
});

test('changes tabs and updates form data', async () => {
  renderAdminSettings();
  
  // Update general info
  const storeNameInput = screen.getByDisplayValue('Prime Pets');
  fireEvent.change(storeNameInput, { target: { value: 'New Pets Store' } });
  
  // Switch tab
  const footerTab = screen.getByText('Footer & Text');
  fireEvent.click(footerTab);
  expect(screen.getByText('Footer Description')).toBeInTheDocument();
  
  // Switch back and save
  const generalTab = screen.getByText('General Info');
  fireEvent.click(generalTab);
  
  const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
  fireEvent.click(saveBtn);
  
  expect(axios.default.put).toHaveBeenCalledWith('/api/settings', expect.objectContaining({
    storeName: 'New Pets Store',
    tagline: 'Premium Store'
  }));
  expect(mockRefreshData).toHaveBeenCalled();
});
