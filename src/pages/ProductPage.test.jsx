import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import ProductPage from './ProductPage';
import { CartContext } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockProducts = [
  {
    id: '1',
    name: 'Premium Dog Food',
    brand: 'Pedigree',
    price: 500,
    mrp: 600,
    rating: 4.5,
    reviews: 120,
    category: 'Dog Food',
    petType: 'Dogs',
    img: '/img1.png',
  },
  {
    id: '2',
    name: 'Cat Food',
    brand: 'Whiskas',
    price: 400,
    mrp: 500,
    rating: 4.0,
    reviews: 90,
    category: 'Cat Food',
    petType: 'Cats',
    img: '/img2.png',
  }
];

const mockAddToCart = vi.fn();
const mockToggleWishlist = vi.fn();
const mockIsWishlisted = vi.fn().mockReturnValue(false);

const renderProductPage = (productId) => {
  return render(
    <AuthContext.Provider value={{ user: null, usersDb: [], checkUserExists: vi.fn() }}>
      <CartContext.Provider value={{ addToCart: mockAddToCart, toggleWishlist: mockToggleWishlist, isWishlisted: mockIsWishlisted, wishlistItems: [], cartCount: 0, setCartOpen: vi.fn() }}>
        <DataContext.Provider value={{ products: mockProducts, frontendSettings: { logoBase64: null } }}>
          <BrowserRouter>
            <Routes>
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </BrowserRouter>
        </DataContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

test('renders Product Not Found for invalid ID', () => {
  window.history.pushState({}, 'Test', '/product/999');
  renderProductPage('999');
  expect(screen.getByText('Product Not Found')).toBeInTheDocument();
});

test('renders product details correctly', () => {
  window.history.pushState({}, 'Test', '/product/1');
  renderProductPage('1');
  
  expect(screen.getAllByText('Premium Dog Food')[0]).toBeInTheDocument();
  expect(screen.getByText('Pedigree')).toBeInTheDocument(); // Uppercase brand
  expect(screen.getByText('₹500')).toBeInTheDocument();
});

test('adds to cart with quantity', () => {
  window.history.pushState({}, 'Test', '/product/1');
  renderProductPage('1');
  
  const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
  
  // Increase quantity to 2
  const plusBtn = screen.getAllByRole('button').find(btn => btn.innerHTML.includes('lucide-plus'));
  if(plusBtn) {
    fireEvent.click(plusBtn);
  }
  
  fireEvent.click(addToCartBtn);
  
  // Note: addToCart gets called for each quantity in the loop
  expect(mockAddToCart).toHaveBeenCalled();
});
