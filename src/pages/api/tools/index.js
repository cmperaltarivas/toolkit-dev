import { qall, qrun, qget } from '../../../lib/db';
import { validarTool, json } from '../../../lib/validate';
import { getUserFromRequest } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export function GET({ request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    const importance = url.searchParams.get('importance');
    const tag = url.searchParams.get('tag');
    const favorite = url.searchParams.get('favorite');
    const sort = url.searchParams.get('sort');
    const order = url.searchParams.get('order');
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 50, 200);
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    let where = 'WHERE user_id = ?';
    const params = [user.id];

    if (search) { const q = `%${search}%`; where += ' AND (name LIKE ? OR desc LIKE ? OR url LIKE ?)'; params.push(q, q, q); }
    if (category) { where += ' AND category = ?'; params.push(category); }
    if (importance) { where += ' AND importance = ?'; params.push(importance); }
    if (favorite === 'true') { where += ' AND favorite = 1'; }
    if (tag) { where += ' AND (tags LIKE ? OR tags LIKE ?)'; params.push(`%"${tag}"%`, `%${tag}%`); }

    const allowed = { name:'name', fecha:'created_at', importancia:'importance', visits:'visits', updated:'updated_at' };
    const sc = allowed[sort] || 'created_at';
    const so = order === 'asc' ? 'ASC' : 'DESC';

    const total = qget(`SELECT COUNT(*) as count FROM herramientas ${where}`, ...params).count;
    const tools = qall(`SELECT * FROM herramientas ${where} ORDER BY ${sc} ${so} LIMIT ? OFFSET ?`, ...params, limit, offset);

    return json({ tools, total, limit, offset });
  } catch (e) {
    return json({ error: 'Error al listar herramientas' }, 500);
  }
}

export async function POST({ request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);
    const body = await request.json();
    const errors = validarTool(body);
    if (errors.length) return json({ error: errors.join('; ') }, 400);

    const id = body.id || uuidv4();
    const now = new Date().toISOString();
    qrun('INSERT OR REPLACE INTO herramientas (id,name,url,desc,category,importance,tags,favicon,user_id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      id, body.name.trim(), body.url.trim(), (body.desc||'').trim(),
      body.category||'Otro', body.importance||'util', JSON.stringify(body.tags||[]), (body.favicon||'').trim(), user.id, now, now);
    const tool = qget('SELECT * FROM herramientas WHERE id = ?', id);
    return json(tool, 201);
  } catch (e) {
    return json({ error: 'Error al crear herramienta' }, 500);
  }
}
