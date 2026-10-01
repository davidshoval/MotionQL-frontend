import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the hero headline', () => {
  render(<App />);
  expect(screen.getByText(/build free with xquery\.io/i)).toBeInTheDocument();
});
