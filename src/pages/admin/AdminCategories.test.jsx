import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminCategories from './AdminCategories';
import { DataProvider } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';

describe('AdminCategories', () => {
  it('renders manage categories header', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminCategories />
        </CartProvider>
      </DataProvider>
    );
    expect(screen.getByText('Categories', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('can open add category modal', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminCategories />
        </CartProvider>
      </DataProvider>
    );
    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Add New Category')).toBeInTheDocument();
  });
});
