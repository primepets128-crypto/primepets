import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminMusic from './AdminMusic';
import { DataProvider } from '../../context/DataContext';
import { AuthProvider } from '../../context/AuthContext';

describe('AdminMusic', () => {
  it('renders music settings correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AdminMusic />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Site Background Music/i)).toBeInTheDocument();
  });
});
