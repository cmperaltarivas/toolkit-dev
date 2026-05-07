import { qget } from '../../lib/db';
import { json } from '../../lib/validate';

export function GET() {
  try {
    const total = qget('SELECT COUNT(*) as count FROM herramientas');
    const dbOk = total !== null && total !== undefined;
    return json({
      status: dbOk ? 'ok' : 'degraded',
      tools: total ? total.count : 0,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return json({ status: 'error', error: e.message }, 500);
  }
}
