import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'
 
test('Page', () => {
  const label = 'Button'
  render(<Button label={label} />)
  expect(screen.getByText(label)).toBeDefined()
})