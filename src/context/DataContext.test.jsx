import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataProvider, useData } from './DataContext';

function TestComponent() {
  const { products, setProducts, categories, setCategories, slides, setSlides, deals, setDeals } = useData();

  return (
    <div>
      <div data-testid="product-count">{products.length}</div>
      <div data-testid="category-count">{categories.length}</div>
      <div data-testid="slide-count">{slides.length}</div>
      <div data-testid="deal-count">{deals.length}</div>
      
      <button 
        data-testid="add-product-btn" 
        onClick={() => setProducts([...products, { id: 999, name: 'Test Product' }])}
      >
        Add Product
      </button>
      <button 
        data-testid="add-category-btn" 
        onClick={() => setCategories([...categories, { id: 999, label: 'Test Category' }])}
      >
        Add Category
      </button>
      <button 
        data-testid="add-slide-btn" 
        onClick={() => setSlides([...slides, { id: 999, tag: 'Test Slide' }])}
      >
        Add Slide
      </button>
      <button 
        data-testid="add-deal-btn" 
        onClick={() => setDeals([...deals, { id: 999, title: 'Test Deal' }])}
      >
        Add Deal
      </button>
    </div>
  );
}

describe('DataContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides initial data when localStorage is empty', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('product-count').textContent).toBe('21');
    expect(screen.getByTestId('category-count').textContent).toBe('12');
    expect(screen.getByTestId('slide-count').textContent).toBe('3');
    expect(screen.getByTestId('deal-count').textContent).toBe('8');
  });

  it('updates state and persists to localStorage on setProducts', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-product-btn').click();
    });

    expect(screen.getByTestId('product-count').textContent).toBe('22');
    const savedProducts = JSON.parse(localStorage.getItem('prime-pets-products-v3'));
    expect(savedProducts.length).toBe(22);
    expect(savedProducts[21].name).toBe('Test Product');
  });

  it('updates state and persists to localStorage on setCategories', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-category-btn').click();
    });

    expect(screen.getByTestId('category-count').textContent).toBe('13');
    const savedCats = JSON.parse(localStorage.getItem('prime-pets-categories-v2'));
    expect(savedCats.length).toBe(13);
  });

  it('updates state and persists to localStorage on setSlides', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-slide-btn').click();
    });

    expect(screen.getByTestId('slide-count').textContent).toBe('4');
    const savedSlides = JSON.parse(localStorage.getItem('prime-pets-slides-v2'));
    expect(savedSlides.length).toBe(4);
  });

  it('updates state and persists to localStorage on setDeals', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      screen.getByTestId('add-deal-btn').click();
    });

    expect(screen.getByTestId('deal-count').textContent).toBe('9');
    const savedDeals = JSON.parse(localStorage.getItem('prime-pets-deals-v2'));
    expect(savedDeals.length).toBe(9);
  });

  it('loads data from localStorage on initialization', () => {
    localStorage.setItem('prime-pets-products-v3', JSON.stringify([{ id: 101, name: 'Cached Product' }]));
    
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('product-count').textContent).toBe('1');
  });

  it('throws an error if useData is used outside DataProvider', () => {
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => render(<TestComponent />)).toThrow('useData must be used within DataProvider');
    
    console.error = originalError;
  });
});
