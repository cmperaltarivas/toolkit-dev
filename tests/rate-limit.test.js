import { describe, it, expect } from 'vitest';
import { rateLimit } from '../src/lib/rate-limit';

describe('rateLimit', () => {
  it('permite hasta el máximo', () => {
    const key = 'test-' + Math.random();
    for (let i = 0; i < 60; i++) {
      const rl = rateLimit(key, 60);
      expect(rl.allowed).toBe(true);
      expect(rl.remaining).toBeGreaterThanOrEqual(0);
    }
  });

  it('bloquea después del máximo', () => {
    const key = 'test-block-' + Math.random();
    const max = 3;
    for (let i = 0; i < max; i++) {
      expect(rateLimit(key, max).allowed).toBe(true);
    }
    const blocked = rateLimit(key, max);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('usa máximo default de 60', () => {
    const key = 'test-default-' + Math.random();
    for (let i = 0; i < 60; i++) {
      expect(rateLimit(key).allowed).toBe(true);
    }
    expect(rateLimit(key).allowed).toBe(false);
  });

  it('cada key tiene su propio contador', () => {
    const key1 = 'test-key1-' + Math.random();
    const key2 = 'test-key2-' + Math.random();
    const max = 2;
    rateLimit(key1, max);
    rateLimit(key1, max);
    const blocked1 = rateLimit(key1, max);
    expect(blocked1.allowed).toBe(false);
    const allowed2 = rateLimit(key2, max);
    expect(allowed2.allowed).toBe(true);
  });
});
