import { qget, qrun } from '../../../lib/db';
import { validarTool, json } from '../../../lib/validate';
import { getUserFromRequest } from '../../../lib/auth';

export function GET({ params, request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const tool = qget('SELECT * FROM herramientas WHERE id = ? AND user_id = ?', params.id, user.id);
    if (!tool) return json({ error: 'No encontrada' }, 404);
    return json(tool);
  } catch (e) {
    return json({ error: 'Error al obtener herramienta' }, 500);
  }
}

export async function PUT({ params, request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const existing = qget('SELECT * FROM herramientas WHERE id = ? AND user_id = ?', params.id, user.id);
    if (!existing) return json({ error: 'No encontrada' }, 404);

    const body = await request.json();
    const errors = validarTool(body, true);
    if (errors.length) return json({ error: errors.join('; ') }, 400);

    const now = new Date().toISOString();
    qrun('UPDATE herramientas SET name=?,url=?,desc=?,category=?,importance=?,tags=?,favicon=?,updated_at=? WHERE id=?',
      (body.name||existing.name).trim(), (body.url||existing.url).trim(),
      body.desc !== undefined ? body.desc.trim() : existing.desc.trim(),
      body.category||existing.category, body.importance||existing.importance,
      JSON.stringify(body.tags || JSON.parse(existing.tags)),
      body.favicon !== undefined ? body.favicon.trim() : (existing.favicon || ''),
      now, params.id);
    const tool = qget('SELECT * FROM herramientas WHERE id = ?', params.id);
    return json(tool);
  } catch (e) {
    return json({ error: 'Error al actualizar herramienta' }, 500);
  }
}

export function DELETE({ params, request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const existing = qget('SELECT * FROM herramientas WHERE id = ? AND user_id = ?', params.id, user.id);
    if (!existing) return json({ error: 'No encontrada' }, 404);
    qrun('DELETE FROM herramientas WHERE id = ?', params.id);
    return json({ ok: true });
  } catch (e) {
    return json({ error: 'Error al eliminar herramienta' }, 500);
  }
}
