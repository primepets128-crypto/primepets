import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from './Toast';
import React from 'react';
import * as CartContextModule from '../context/CartContext';

vi.mock('../context/CartContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useCart: vi.fn(),
  };
});

describe('Toast Component', () => {
  it('renders nothing when there is no toast message', () => {
    vi.mocked(CartContextModule.useCart).mockReturnValue({ toastMsg: '' });
    const { container } = render(<Toast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the toast message when provided', () => {
    vi.mocked(CartContextModule.useCart).mockReturnValue({ toastMsg: 'Test Toast Message' });
    render(<Toast />);
    expect(screen.getByText('Test Toast Message')).toBeInTheDocument();
  });
});
