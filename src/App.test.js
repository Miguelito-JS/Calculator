import { fireEvent, render, screen } from '@testing-library/react';
import Calculator from './components/Calculator';

test('soma corretamente quando há dois números válidos', () => {
  const { container } = render(<Calculator />);

  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '3' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));

  expect(container.querySelector('.result-inner')).toHaveTextContent('8');
});

test('não mostra NaN quando o usuário apertar = sem segundo valor', () => {
  const { container } = render(<Calculator />);

  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));

  expect(container.querySelector('.result-inner')).toHaveTextContent('5');
});

test('continua a conta a partir do resultado quando o botão + é apertado de novo', () => {
  const { container } = render(<Calculator />);

  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));

  expect(container.querySelector('.result-inner')).toHaveTextContent('10');

  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));

  expect(container.querySelector('.result-inner')).toHaveTextContent('15');
});

test('respeita precedencia de operadores: -8 + 10 * 5 = 42', () => {
  const { container } = render(<Calculator />);

  fireEvent.click(screen.getByRole('button', { name: '+/-' }));
  fireEvent.click(screen.getByRole('button', { name: '8' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '1' }));
  fireEvent.click(screen.getByRole('button', { name: '0' }));
  fireEvent.click(screen.getByRole('button', { name: 'X' }));
  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));

  expect(container.querySelector('.result-inner')).toHaveTextContent('42');
});

test('respeita precedencia: 2 + 3 * 4 = 14', () => {
  const { container } = render(<Calculator />);

  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '3' }));
  fireEvent.click(screen.getByRole('button', { name: 'X' }));
  fireEvent.click(screen.getByRole('button', { name: '4' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));

  expect(container.querySelector('.result-inner')).toHaveTextContent('14');
});
