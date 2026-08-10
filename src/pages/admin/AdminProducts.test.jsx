import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';
import AdminProducts from './AdminProducts';
import React from 'react';

const renderAdminProducts = () => {
  return render(
    <BrowserRouter>
      <DataProvider>
        <CartProvider>
          <AdminProducts />
        </CartProvider>
      </DataProvider>
    </BrowserRouter>
  );
};

describe('AdminProducts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true); // Mock window.confirm to return true
  });

  it('renders existing products from context', () => {
    renderAdminProducts();
    expect(screen.getByText('Products', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Royal Canin Adult Dog')).toBeInTheDocument();
  });

  it('can open modal to add a new product and save it', () => {
    renderAdminProducts();
    
    // Open modal
    act(() => {
      fireEvent.click(screen.getByText('Add Product'));
    });
    
    expect(screen.getByText('Add New Product', { selector: 'h3' })).toBeInTheDocument();
    
    // Fill form
    const nameInput = screen.getByLabelText(/Product Name/i);
    const brandInput = screen.getByLabelText(/Brand/i);
    const priceInput = screen.getByLabelText(/Selling Price/i);
    const mrpInput = screen.getByLabelText(/MRP/i);
    const imgInput = screen.getByLabelText(/Image URL/i);
    
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test Product 123' } });
      fireEvent.change(brandInput, { target: { value: 'Test Brand' } });
      fireEvent.change(priceInput, { target: { value: '100' } });
      fireEvent.change(mrpInput, { target: { value: '150' } });
      fireEvent.change(imgInput, { target: { value: 'http://test.img' } });
    });
    
    // Save
    act(() => {
      fireEvent.click(screen.getByText('Create Product'));
    });
    
    // Verify it was added to table
    expect(screen.queryByText('Add New Product', { selector: 'h3' })).not.toBeInTheDocument();
    expect(screen.getByText('Test Product 123')).toBeInTheDocument();
  });

  it('can edit an existing product', () => {
    renderAdminProducts();
    
    // Find first product edit button by its test id
    const editButton = screen.getByTestId('edit-btn-1');
    
    act(() => {
      fireEvent.click(editButton);
    });
    
    expect(screen.getByText('Edit Product', { selector: 'h3' })).toBeInTheDocument();
    
    // Change name
    const nameInput = screen.getByLabelText(/Product Name/i);
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Updated Royal Canin' } });
      fireEvent.click(screen.getByText('Save Changes'));
    });
    
    // Verify update
    expect(screen.getByText('Updated Royal Canin')).toBeInTheDocument();
  });

  it('can delete an existing product', () => {
    renderAdminProducts();
    
    expect(screen.getByText('Whiskas Dry Cat Food')).toBeInTheDocument();
    
    // Whiskas is ID 2
    const deleteButton = screen.getByTestId('del-btn-2');
    
    // Click delete on second product
    act(() => {
      fireEvent.click(deleteButton);
    });
    
    expect(global.confirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Whiskas Dry Cat Food')).not.toBeInTheDocument();
  });
});
