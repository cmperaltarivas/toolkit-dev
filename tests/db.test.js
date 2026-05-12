import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
  process.env.JWT_SECRET = 'test-secret-for-unit-tests-only';
});

describe('DB operations', () => {
  it('qrun inserts a row into herramientas', async () => {
    const { qrun, qget } = await import('../src/lib/db');
    const id = 'test-' + Date.now();
    const now = new Date().toISOString();
    qrun(
      'INSERT INTO herramientas (id, name, url, category, importance, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id, 'Test Tool', 'https://test.dev', 'Frontend', 'util', 'dev-user', now, now
    );
    const row = qget('SELECT * FROM herramientas WHERE id = ?', id);
    expect(row).not.toBeNull();
    expect(row.name).toBe('Test Tool');
    expect(row.category).toBe('Frontend');
    expect(row.importance).toBe('util');
    qrun('DELETE FROM herramientas WHERE id = ?', id);
  });

  it('qall returns multiple rows', async () => {
    const { qrun, qall } = await import('../src/lib/db');
    const id1 = 'test-all-1-' + Date.now();
    const id2 = 'test-all-2-' + Date.now();
    const now = new Date().toISOString();
    qrun(
      'INSERT INTO herramientas (id, name, url, category, importance, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id1, 'Tool A', 'https://a.dev', 'Backend', 'esencial', 'dev-user', now, now
    );
    qrun(
      'INSERT INTO herramientas (id, name, url, category, importance, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id2, 'Tool B', 'https://b.dev', 'Backend', 'critico', 'dev-user', now, now
    );
    const rows = qall('SELECT * FROM herramientas WHERE user_id = ? ORDER BY name', 'dev-user');
    const ourRows = rows.filter(r => r.id === id1 || r.id === id2);
    expect(ourRows.length).toBe(2);
    qrun('DELETE FROM herramientas WHERE id IN (?, ?)', id1, id2);
  });

  it('qtransaction commits changes atomically', async () => {
    const { qtransaction, qget, qrun } = await import('../src/lib/db');
    const id1 = 'txn-1-' + Date.now();
    const id2 = 'txn-2-' + Date.now();
    const now = new Date().toISOString();

    qtransaction(() => {
      qrun(
        'INSERT INTO herramientas (id, name, url, category, importance, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        id1, 'Txn Tool 1', 'https://txn1.dev', 'Frontend', 'util', 'dev-user', now, now
      );
      qrun(
        'INSERT INTO herramientas (id, name, url, category, importance, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        id2, 'Txn Tool 2', 'https://txn2.dev', 'Frontend', 'util', 'dev-user', now, now
      );
    });

    expect(qget('SELECT * FROM herramientas WHERE id = ?', id1)).not.toBeNull();
    expect(qget('SELECT * FROM herramientas WHERE id = ?', id2)).not.toBeNull();

    qrun('DELETE FROM herramientas WHERE id IN (?, ?)', id1, id2);
  });

  it('qtransaction rolls back on error', async () => {
    const { qtransaction, qget } = await import('../src/lib/db');
    const id = 'rollback-' + Date.now();
    const now = new Date().toISOString();

    try {
      qtransaction(() => {
        qrun(
          'INSERT INTO herramientas (id, name, url, category, importance, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          id, 'Rollback Tool', 'https://rollback.dev', 'Frontend', 'util', 'dev-user', now, now
        );
        throw new Error('forced error');
      });
    } catch {}

    const row = qget('SELECT * FROM herramientas WHERE id = ?', id);
    expect(row).toBeNull();
  });

  it('qget returns null for non-existent row', async () => {
    const { qget } = await import('../src/lib/db');
    expect(qget('SELECT * FROM herramientas WHERE id = ?', 'non-existent-id')).toBeNull();
  });
});
