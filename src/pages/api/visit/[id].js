import { qrun, qget } from '../../../lib/db';
import { json } from '../../../lib/validate';

export function PATCH({ params }) {
  try {
    const existing = qget('SELECT id FROM herramientas WHERE id = ?', params.id);
    if (!existing) return json({ error: 'No encontrada' }, 404);
    qrun('UPDATE herramientas SET visits = visits + 1 WHERE id = ?', params.id);
    return json({ ok: true });
  } catch (e) {
    return json({ error: 'Error al registrar visita' }, 500);
  }
}
