import { render, screen, fireEvent } from '@testing-library/react'
import { CurrencyInput } from './currency-input'

describe('CurrencyInput', () => {
  it('renders correctly with initial value', () => {
    const handleChange = jest.fn()
    render(<CurrencyInput value={10000} onValueChange={handleChange} placeholder="Amount" />)
    
    const input = screen.getByPlaceholderText('Amount') as HTMLInputElement
    // ID-ID format for 10000 is 10.000
    expect(input.value).toBe('10.000')
  })

  it('formats input value correctly as user types', () => {
    const handleChange = jest.fn()
    render(<CurrencyInput value={0} onValueChange={handleChange} placeholder="Amount" />)
    
    const input = screen.getByPlaceholderText('Amount')
    
    // Simulate typing "12345"
    fireEvent.change(input, { target: { value: '12345' } })
    
    // The onValueChange should be called with raw number
    expect(handleChange).toHaveBeenCalledWith(12345)
  })

  it('handles non-numeric input', () => {
    const handleChange = jest.fn()
    render(<CurrencyInput value={0} onValueChange={handleChange} placeholder="Amount" />)
    
    const input = screen.getByPlaceholderText('Amount')
    
    // Simulate typing "abc"
    fireEvent.change(input, { target: { value: 'abc' } })
    
    // Should default to 0
    expect(handleChange).toHaveBeenCalledWith(0)
  })
})
