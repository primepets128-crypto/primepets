import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatBot from './ChatBot';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';

describe('ChatBot Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            {component}
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders the chatbot toggle button', () => {
    renderWithProviders(<ChatBot />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('opens chat window when toggle button is clicked', async () => {
    renderWithProviders(<ChatBot />);
    const toggleButton = screen.getByRole('button');
    
    // Initial state: chat is closed
    expect(screen.queryByText(/To get started, could you please tell me your name\?/i)).not.toBeInTheDocument();
    
    // Click toggle
    fireEvent.click(toggleButton);
    
    // Wait for animation to finish and chat to open
    await waitFor(() => {
      expect(screen.getByText(/To get started, could you please tell me your name\?/i)).toBeInTheDocument();
    });
  });

  test('allows user to enter name', async () => {
    renderWithProviders(<ChatBot />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your message.../i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // It should display the user's message
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});
