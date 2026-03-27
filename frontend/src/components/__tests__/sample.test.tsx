import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

const SimpleComponent = () => <div>Hello, Gemellery Frontend!</div>;

describe('Simple Component', () => {
  it('renders correctly', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello, Gemellery Frontend!')).toBeInTheDocument();
  });
});
