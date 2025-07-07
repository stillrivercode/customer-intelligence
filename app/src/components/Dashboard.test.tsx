import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

test('renders dashboard title', () => {
  render(<Dashboard />)
  const element = screen.getByRole('heading', { name: /customer intelligence dashboard/i })
  expect(element).toBeInTheDocument()
})

test('renders custom title', () => {
  render(<Dashboard title="Custom Dashboard" />)
  const element = screen.getByText(/custom dashboard/i)
  expect(element).toBeInTheDocument()
})

test('renders welcome message', () => {
  render(<Dashboard />)
  const element = screen.getByText(/welcome to your customer intelligence dashboard/i)
  expect(element).toBeInTheDocument()
})

test('renders stat cards', () => {
  render(<Dashboard />)
  const totalCustomers = screen.getByText(/total customers/i)
  const activeSessions = screen.getByText(/active sessions/i)
  const conversionRate = screen.getByText(/conversion rate/i)
  
  expect(totalCustomers).toBeInTheDocument()
  expect(activeSessions).toBeInTheDocument()
  expect(conversionRate).toBeInTheDocument()
})

test('applies custom className', () => {
  const { container } = render(<Dashboard className="custom-class" />)
  const dashboard = container.querySelector('.dashboard')
  expect(dashboard).toHaveClass('custom-class')
})