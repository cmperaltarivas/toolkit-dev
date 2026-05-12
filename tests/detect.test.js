import { describe, it, expect } from 'vitest';
import { isPrivateIP } from '../src/pages/api/detect';

describe('isPrivateIP', () => {
  it('bloquea localhost', () => {
    expect(isPrivateIP('localhost')).toBe(true);
    expect(isPrivateIP('LOCALHOST')).toBe(true);
  });

  it('bloquea loopback', () => {
    expect(isPrivateIP('127.0.0.1')).toBe(true);
    expect(isPrivateIP('::1')).toBe(true);
  });

  it('bloquea 0.0.0.0', () => {
    expect(isPrivateIP('0.0.0.0')).toBe(true);
  });

  it('bloquea private ranges', () => {
    expect(isPrivateIP('10.0.0.1')).toBe(true);
    expect(isPrivateIP('172.16.0.1')).toBe(true);
    expect(isPrivateIP('172.31.255.255')).toBe(true);
    expect(isPrivateIP('192.168.1.1')).toBe(true);
  });

  it('bloquea link-local', () => {
    expect(isPrivateIP('169.254.1.1')).toBe(true);
    expect(isPrivateIP('169.254.169.254')).toBe(true);
  });

  it('bloquea metadata service', () => {
    expect(isPrivateIP('metadata.google.internal')).toBe(true);
  });

  it('permite IPs públicas', () => {
    expect(isPrivateIP('8.8.8.8')).toBe(false);
    expect(isPrivateIP('1.1.1.1')).toBe(false);
  });

  it('permite dominios públicos', () => {
    expect(isPrivateIP('react.dev')).toBe(false);
    expect(isPrivateIP('github.com')).toBe(false);
    expect(isPrivateIP('example.com')).toBe(false);
  });

  it('bloquea 172.15 (no es rango privado)', () => {
    expect(isPrivateIP('172.15.0.1')).toBe(false);
  });

  it('bloquea 172.32 (fuera de rango privado)', () => {
    expect(isPrivateIP('172.32.0.1')).toBe(false);
  });
});
