import { render, screen } from '@testing-library/react'
import App from './App'

test('renders App component', () => {
  render(<App />)
  const dashboard = screen.getByRole('heading', { name: /customer intelligence dashboard/i })
  expect(dashboard).toBeInTheDocument()
})

test('renders Dashboard component within App', () => {
  const { container } = render(<App />)
  const app = container.querySelector('.app')
  const dashboard = container.querySelector('.dashboard')
  
  expect(app).toBeInTheDocument()
  expect(dashboard).toBeInTheDocument()
})