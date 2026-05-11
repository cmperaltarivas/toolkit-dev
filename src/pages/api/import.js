import { qrun, qget, qtransaction } from '../../lib/db';
import { parseBookmarksHtml } from '../../lib/parser';
import { json } from '../../lib/validate';
import { getUserFromRequest } from '../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return json({ error: 'Subí un archivo' }, 400);

    const content = await file.text();
    let imported = 0;

    if (file.name.endsWith('.json')) {
      const items = JSON.parse(content);
      if (!Array.isArray(items)) return json({ error: 'JSON debe ser un array' }, 400);
      qtransaction(() => {
        for (const t of items) {
          if (!t.name || !t.url) continue;
          qrun('INSERT OR REPLACE INTO herramientas (id,name,url,desc,category,importance,tags,favorite,visits,user_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            t.id||uuidv4(), t.name, t.url, t.desc||'', t.category||'Otro', t.importance||'util',
            JSON.stringify(t.tags||[]), t.favorite||0, t.visits||0, user.id,
            t.created_at||new Date().toISOString(), new Date().toISOString());
          imported++;
        }
      });
    } else {
      const tools = parseBookmarksHtml(content);
      qtransaction(() => {
        for (const t of tools) {
          const existing = qget('SELECT id FROM herramientas WHERE url = ? AND user_id = ?', t.url, user.id);
          if (existing) continue;
          qrun('INSERT INTO herramientas (id,name,url,desc,category,importance,tags,user_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
            uuidv4(), t.name, t.url, `Importado de ${t.category}`, t.category, 'util',
            JSON.stringify([t.category.toLowerCase()]), user.id,
            new Date().toISOString(), new Date().toISOString());
          imported++;
        }
      });
    }

    return json({ imported, message: `${imported} herramientas importadas` });
  } catch (e) {
    return json({ error: e.message || 'Error al importar' }, 400);
  }
}
