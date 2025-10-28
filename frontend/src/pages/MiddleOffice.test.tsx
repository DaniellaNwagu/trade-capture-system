import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import MiddleOffice from './MiddleOffice';
import React from 'react';
import { renderWithProviders  } from '../utils/test-utils';

describe('MiddleOffice Page', () => {
  it('renders the welcome heading', () => {
    renderWithProviders (<MiddleOffice />);
    expect(screen.getByText(/Welcome to the Trade Platform/i)).toBeInTheDocument();
  });
});
