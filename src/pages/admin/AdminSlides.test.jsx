import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminSlides from './AdminSlides';
import { DataProvider } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';

describe('AdminSlides', () => {
  it('renders manage slides header', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminSlides />
        </CartProvider>
      </DataProvider>
    );
    expect(screen.getByText('Hero Slides')).toBeInTheDocument();
    expect(screen.getByText('Add Slide')).toBeInTheDocument();
  });

  it('can open add slide modal', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminSlides />
        </CartProvider>
      </DataProvider>
    );
    fireEvent.click(screen.getByText('Add Slide'));
    expect(screen.getByText('Add New Slide')).toBeInTheDocument();
  });
});
