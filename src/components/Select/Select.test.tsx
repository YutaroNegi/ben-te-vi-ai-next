// __tests__/components/Select.test.tsx
import React from 'react';
import { render, screen , fireEvent} from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Select from './Select';

describe('Select component', () => {
  const options = [
    { value: '', label: 'Selecione uma opção' },
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
  ];

  it('deve renderizar a label corretamente', () => {
    render(<Select label="Escolha:" options={options} />);
    expect(screen.getByText('Escolha:')).toBeDefined();
  });
});