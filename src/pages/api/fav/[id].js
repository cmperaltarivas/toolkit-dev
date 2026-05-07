import { qget, qrun } from '../../../lib/db';
import { json } from '../../../lib/validate';

export function PATCH({ params }) {
  try {
    const existing = qget('SELECT * FROM herramientas WHERE id = ?', params.id);
    if (!existing) return json({ error: 'No encontrada' }, 404);
    const newVal = existing.favorite ? 0 : 1;
    qrun("UPDATE herramientas SET favorite = ?, updated_at = datetime('now') WHERE id = ?", newVal, params.id);
    return json({ favorite: !!newVal });
  } catch (e) {
    return json({ error: 'Error al cambiar favorito' }, 500);
  }
}
