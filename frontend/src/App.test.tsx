import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // ✅ 添加这个 import
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Casho/i);
  expect(linkElement).toBeInTheDocument();
});
