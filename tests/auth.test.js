import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';

beforeAll(() => {
  process.env.GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
  process.env.JWT_SECRET = 'test-secret-for-unit-tests-only';
});

beforeEach(async () => {
  process.env.DEV_BYPASS_AUTH = '';
  await vi.resetModules();
});

describe('signJwt / verifyJwt', () => {
  it('firma y verifica un token correctamente', async () => {
    const { signJwt, verifyJwt } = await import('../src/lib/auth');
    const user = { id: 'user-1', email: 'test@test.com', name: 'Test' };
    const token = signJwt(user);
    const payload = verifyJwt(token);
    expect(payload).not.toBeNull();
    expect(payload.id).toBe('user-1');
    expect(payload.email).toBe('test@test.com');
  });

  it('verifyJwt rechaza token inválido', async () => {
    const { verifyJwt } = await import('../src/lib/auth');
    expect(verifyJwt('token-invalido')).toBeNull();
    expect(verifyJwt('')).toBeNull();
  });

  it('verifyJwt rechaza token expirado', async () => {
    const jwt = await import('jsonwebtoken');
    const expired = jwt.default.sign({ id: 'x' }, 'test-secret-for-unit-tests-only', { expiresIn: '0s' });
    const { verifyJwt } = await import('../src/lib/auth');
    expect(verifyJwt(expired)).toBeNull();
  });
});

describe('getUserFromRequest', () => {
  it('extrae usuario de header Authorization Bearer', async () => {
    const { signJwt, getUserFromRequest } = await import('../src/lib/auth');
    const token = signJwt({ id: 'u1', email: 'a@b.com', name: 'A' });
    const req = new Request('http://localhost/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = getUserFromRequest(req);
    expect(user).not.toBeNull();
    expect(user.id).toBe('u1');
  });

  it('retorna null sin header', async () => {
    const { getUserFromRequest } = await import('../src/lib/auth');
    expect(getUserFromRequest(new Request('http://localhost/'))).toBeNull();
  });

  it('retorna null con header mal formado', async () => {
    const { getUserFromRequest } = await import('../src/lib/auth');
    const req = new Request('http://localhost/', {
      headers: { Authorization: 'Basic abc123' },
    });
    expect(getUserFromRequest(req)).toBeNull();
  });
});
