import { qget, qall } from '../../lib/db';
import { json } from '../../lib/validate';

export function GET() {
  try {
    const total = qget('SELECT COUNT(*) as count FROM herramientas');
    const favoritas = qget('SELECT COUNT(*) as count FROM herramientas WHERE favorite = 1');
    const rowsCat = qall('SELECT category, COUNT(*) as count FROM herramientas GROUP BY category ORDER BY count DESC');
    const allTools = qall('SELECT id, name, url, category FROM herramientas ORDER BY name');
    const toolsByCat = {};
    allTools.forEach(t => { const c = t.category || 'Otro'; if (!toolsByCat[c]) toolsByCat[c] = []; if (toolsByCat[c].length < 10) toolsByCat[c].push({ id: t.id, name: t.name, url: t.url }); });
    const porCategoria = rowsCat.map(r => ({ category: r.category, count: r.count, tools: toolsByCat[r.category] || [] }));
    const porImportancia = qall('SELECT importance, COUNT(*) as count FROM herramientas GROUP BY importance ORDER BY count DESC');
    const masVisitadas = qall('SELECT id, name, url, visits FROM herramientas ORDER BY visits DESC LIMIT 5');
    const totalVisits = qget('SELECT COALESCE(SUM(visits), 0) as total FROM herramientas');
    const nuncaVisitadas = qall('SELECT id, name, url, category FROM herramientas WHERE visits = 0 ORDER BY created_at DESC LIMIT 10');
    const prioSinVisitar = qall("SELECT id, name, url, importance FROM herramientas WHERE visits = 0 AND importance IN ('critico','esencial') ORDER BY importance DESC, created_at DESC LIMIT 10");
    const allTags = qall('SELECT tags FROM herramientas');
    const tagCount = {};
    allTags.forEach(r => {
      try { JSON.parse(r.tags || '[]').forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }); } catch {}
    });
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));

    return json({
      total: total.count, favoritas: favoritas.count, totalVisits: totalVisits.total,
      porCategoria, porImportancia, masVisitadas, topTags, nuncaVisitadas, prioSinVisitar
    });
  } catch (e) {
    return json({ error: 'Error al obtener estadísticas' }, 500);
  }
}
