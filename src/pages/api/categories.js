import { qall } from '../../lib/db';
import { json } from '../../lib/validate';
import { getUserFromRequest } from '../../lib/auth';

export function GET({ request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const rows = qall('SELECT DISTINCT category FROM herramientas WHERE user_id = ? ORDER BY category', user.id);
    return json(rows.map(r => r.category));
  } catch (e) {
    return json({ error: 'Error al obtener categorías' }, 500);
  }
}
