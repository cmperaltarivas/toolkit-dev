import { describe, it, expect } from 'vitest';
import { validarTool, json } from '../src/lib/validate';

describe('validarTool', () => {
  const validTool = {
    name: 'React',
    url: 'https://react.dev',
    desc: 'Biblioteca de UI',
    category: 'Frontend',
    importance: 'esencial',
    tags: ['react', 'ui'],
  };

  it('acepta herramienta válida', () => {
    expect(validarTool(validTool)).toEqual([]);
  });

  it('rechaza name vacío', () => {
    const errs = validarTool({ ...validTool, name: '' });
    expect(errs.some(e => e.startsWith('name'))).toBe(true);
  });

  it('rechaza name muy largo', () => {
    const errs = validarTool({ ...validTool, name: 'x'.repeat(201) });
    expect(errs.some(e => e.startsWith('name'))).toBe(true);
  });

  it('rechaza url vacío', () => {
    const errs = validarTool({ ...validTool, url: '' });
    expect(errs.some(e => e.startsWith('url'))).toBe(true);
  });

  it('rechaza url mal formada', () => {
    const errs = validarTool({ ...validTool, url: 'no-es-url' });
    expect(errs.some(e => e.startsWith('url'))).toBe(true);
  });

  it('rechaza category inválida', () => {
    const errs = validarTool({ ...validTool, category: 'Inexistente' });
    expect(errs.some(e => e.startsWith('category'))).toBe(true);
  });

  it('rechaza importance inválida', () => {
    const errs = validarTool({ ...validTool, importance: 'super-importante' });
    expect(errs.some(e => e.startsWith('importance'))).toBe(true);
  });

  it('rechaza tags que no es array', () => {
    const errs = validarTool({ ...validTool, tags: 'no-un-array' });
    expect(errs.some(e => e.startsWith('tags'))).toBe(true);
  });

  it('acepta desc vacío (opcional)', () => {
    expect(validarTool({ ...validTool, desc: '' })).toEqual([]);
  });

  it('acepta category vacío (usa default)', () => {
    expect(validarTool({ ...validTool, category: '' })).toEqual([]);
  });

  it('acepta importance vacío (usa default)', () => {
    expect(validarTool({ ...validTool, importance: '' })).toEqual([]);
  });

  it('desc demasiado larga', () => {
    const errs = validarTool({ ...validTool, desc: 'x'.repeat(2001) });
    expect(errs.some(e => e.startsWith('desc'))).toBe(true);
  });
});

describe('validarTool partial (PUT)', () => {
  it('permite actualizar solo name', () => {
    expect(validarTool({ name: 'Nuevo nombre' }, true)).toEqual([]);
  });

  it('permite actualizar solo url', () => {
    expect(validarTool({ url: 'https://nuevo.dev' }, true)).toEqual([]);
  });

  it('valida url en modo partial', () => {
    const errs = validarTool({ url: 'mal' }, true);
    expect(errs.some(e => e.startsWith('url'))).toBe(true);
  });

  it('valida name vacío en modo partial', () => {
    const errs = validarTool({ name: '' }, true);
    expect(errs.some(e => e.startsWith('name'))).toBe(true);
  });

  it('permite partial vacío', () => {
    expect(validarTool({}, true)).toEqual([]);
  });
});

describe('json helper', () => {
  it('devuelve Response con JSON', () => {
    const res = json({ ok: true });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
  });

  it('devuelve Response con status personalizado', () => {
    const res = json({ error: 'not found' }, 404);
    expect(res.status).toBe(404);
  });
});
