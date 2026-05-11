import { qget, qall } from '../../lib/db';
import { json } from '../../lib/validate';
import { getUserFromRequest } from '../../lib/auth';

export function GET({ request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const uid = user.id;

    const total = qget('SELECT COUNT(*) as count FROM herramientas WHERE user_id = ?', uid);
    const favoritas = qget('SELECT COUNT(*) as count FROM herramientas WHERE user_id = ? AND favorite = 1', uid);
    const rowsCat = qall('SELECT category, COUNT(*) as count FROM herramientas WHERE user_id = ? GROUP BY category ORDER BY count DESC', uid);
    const allTools = qall('SELECT id, name, url, category, importance FROM herramientas WHERE user_id = ? ORDER BY name', uid);
    const toolsByCat = {};
    allTools.forEach(t => { const c = t.category || 'Otro'; if (!toolsByCat[c]) toolsByCat[c] = []; if (toolsByCat[c].length < 10) toolsByCat[c].push({ id: t.id, name: t.name, url: t.url }); });
    const porCategoria = rowsCat.map(r => ({ category: r.category, count: r.count, tools: toolsByCat[r.category] || [] }));
    const rowsImp = qall('SELECT importance, COUNT(*) as count FROM herramientas WHERE user_id = ? GROUP BY importance ORDER BY count DESC', uid);
    const toolsByImp = {};
    allTools.forEach(t => { const imp = t.importance || 'util'; if (!toolsByImp[imp]) toolsByImp[imp] = []; if (toolsByImp[imp].length < 10) toolsByImp[imp].push({ id: t.id, name: t.name, url: t.url }); });
    const porImportancia = rowsImp.map(r => ({ importance: r.importance, count: r.count, tools: toolsByImp[r.importance] || [] }));
    const masVisitadas = qall('SELECT id, name, url, visits FROM herramientas WHERE user_id = ? ORDER BY visits DESC LIMIT 5', uid);
    const totalVisits = qget('SELECT COALESCE(SUM(visits), 0) as total FROM herramientas WHERE user_id = ?', uid);
    const nuncaVisitadas = qall('SELECT id, name, url, category FROM herramientas WHERE user_id = ? AND visits = 0 ORDER BY created_at DESC LIMIT 10', uid);
    const prioSinVisitar = qall("SELECT id, name, url, importance, visits, last_visited_at FROM herramientas WHERE user_id = ? AND importance IN ('critico','esencial') AND (last_visited_at IS NULL OR last_visited_at < datetime('now', '-7 days')) ORDER BY importance DESC, last_visited_at ASC NULLS FIRST LIMIT 10", uid);
    const allTagsRaw = qall('SELECT tags FROM herramientas WHERE user_id = ?', uid);
    const tagCount = {};
    allTagsRaw.forEach(r => { try { JSON.parse(r.tags || '[]').forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }); } catch {} });
    const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([tag, count]) => ({ tag, count }));

    return json({
      total: total.count, favoritas: favoritas.count, totalVisits: totalVisits.total,
      porCategoria, porImportancia, masVisitadas, topTags, nuncaVisitadas, prioSinVisitar
    });
  } catch (e) {
    return json({ error: 'Error al obtener estadísticas' }, 500);
  }
}
