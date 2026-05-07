import { qall } from '../../lib/db';
import { json } from '../../lib/validate';

export function GET() {
  try {
    const tools = qall('SELECT * FROM herramientas ORDER BY created_at DESC');
    return new Response(JSON.stringify(tools), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'content-disposition': 'attachment; filename=toolkit-backup.json',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block',
        'referrer-policy': 'strict-origin-when-cross-origin',
      }
    });
  } catch (e) {
    return json({ error: 'Error al exportar' }, 500);
  }
}
