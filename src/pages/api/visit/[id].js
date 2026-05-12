import { qrun, qget } from '../../../lib/db';
import { json } from '../../../lib/validate';
import { getUserFromRequest } from '../../../lib/auth';

export function PATCH({ params, request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const existing = qget('SELECT id FROM herramientas WHERE id = ? AND user_id = ?', params.id, user.id);
    if (!existing) return json({ error: 'No encontrada' }, 404);
    qrun("UPDATE herramientas SET visits = visits + 1, last_visited_at = datetime('now') WHERE id = ? AND user_id = ?", params.id, user.id);
    return json({ ok: true });
  } catch (e) {
    return json({ error: 'Error al registrar visita' }, 500);
  }
}
