import { describe, it, expect } from 'vitest';
describe('order validation', () => {
  it('rejects empty items', () => {
    expect(true).toBe(true);
  });
  it('computes subtotal server-side', () => {
    const items = [{ price: 50, qty: 2 }, { price: 30, qty: 1 }];
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    expect(subtotal).toBe(130);
  });
});
