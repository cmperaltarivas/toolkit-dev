import { qget } from '../../../lib/db';
import { json } from '../../../lib/validate';
import { getUserFromRequest } from '../../../lib/auth';

export function GET({ request }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return json({ error: 'No autenticado' }, 401);

    const dbUser = qget('SELECT id, name, email, avatar, created_at FROM users WHERE id = ?', user.id);
    if (!dbUser) return json({ error: 'Usuario no encontrado' }, 404);

    return json({ user: dbUser });
  } catch (e) {
    return json({ error: 'Error al obtener usuario' }, 500);
  }
}
