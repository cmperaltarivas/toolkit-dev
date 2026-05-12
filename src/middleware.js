import { getUserFromRequest } from './lib/auth';
import { json } from './lib/validate';

export function onRequest(context, next) {
  const { request, url } = context;
  const pathname = new URL(url).pathname;

  if (!pathname.startsWith('/api/')) return next();
  if (pathname.startsWith('/api/_astro/')) return next();

  const publicEndpoints = [
    '/api/auth/google',
    '/api/health',
    '/api/detect',
  ];

  if (!publicEndpoints.some(e => pathname === e)) {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
  }

  return next();
}
