import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import HomePage from './HomePage';
import React from 'react';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <HomePage />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders successfully without crashing', () => {
    renderHomePage();
    // Verify header exists
    expect(screen.getAllByText('Prime Pets')[0]).toBeInTheDocument();
  });

  it('renders the initial data from DataContext', () => {
    renderHomePage();
    
    // QuickCategories should render "Bone Broth"
    expect(screen.getAllByText('Bone Broth').length).toBeGreaterThan(0);
    
    // DealsSection should render "UP TO 30% OFF" and "DOG FOOD"
    expect(screen.getAllByText('UP TO 30% OFF')[0]).toBeInTheDocument();
    expect(screen.getAllByText('DOG FOOD')[0]).toBeInTheDocument();
    
    // FeaturedProducts should render "Royal Canin Adult Dog"
    expect(screen.getByText('Royal Canin Adult Dog')).toBeInTheDocument();
  });
});
