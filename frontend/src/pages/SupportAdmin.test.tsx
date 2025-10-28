import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Support from './Support';
import React from 'react';
import { renderWithProviders  } from '../utils/test-utils';

describe('Support Page', () => {
  it('renders the Support / Admin View heading', () => {
    renderWithProviders (<Support />);
    expect(screen.getByText(/Support/i)).toBeInTheDocument();
  });
});
