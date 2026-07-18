import React from 'react';
import { render } from '@testing-library/react';
import Contact from './Contact';

describe('Contact component', () => {
  test('renders the contact component with the correct title', () => {
    const { getByText } = render(<Contact />);
    
    expect(getByText('ติดต่อเรา')).toBeInTheDocument();
  });
});
