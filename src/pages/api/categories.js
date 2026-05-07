import { qall } from '../../lib/db';
import { json } from '../../lib/validate';

export function GET() {
  try {
    const rows = qall('SELECT DISTINCT category FROM herramientas ORDER BY category');
    return json(rows.map(r => r.category));
  } catch (e) {
    return json({ error: 'Error al obtener categorías' }, 500);
  }
}
