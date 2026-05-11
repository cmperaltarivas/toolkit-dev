import { qrun, qget, qtransaction } from '../../../lib/db';
import { json } from '../../../lib/validate';
import { verifyGoogleToken, signJwt } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
  try {
    const { id_token } = await request.json();
    if (!id_token) return json({ error: 'id_token requerido' }, 400);

    const googleUser = await verifyGoogleToken(id_token);

    let user = qget('SELECT * FROM users WHERE google_id = ?', googleUser.googleId);

    if (!user) {
      const id = uuidv4();
      const now = new Date().toISOString();
      qrun('INSERT INTO users (id, name, email, avatar, google_id, created_at) VALUES (?,?,?,?,?,?)',
        id, googleUser.name, googleUser.email, googleUser.avatar, googleUser.googleId, now);
      user = { id, name: googleUser.name, email: googleUser.email, avatar: googleUser.avatar, google_id: googleUser.googleId, created_at: now };
    } else if (user.name !== googleUser.name || user.avatar !== googleUser.avatar) {
      qrun('UPDATE users SET name = ?, avatar = ? WHERE id = ?', googleUser.name, googleUser.avatar, user.id);
      user.name = googleUser.name;
      user.avatar = googleUser.avatar;
    }

    const jwt = signJwt(user);
    return json({ jwt, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (e) {
    return json({ error: 'Error al autenticar: ' + (e.message || 'desconocido') }, 401);
  }
}
