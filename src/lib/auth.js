import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.DEV_BYPASS_AUTH) {
  if (!GOOGLE_CLIENT_ID) {
    console.error('ERROR: GOOGLE_CLIENT_ID no está definido en las variables de entorno.');
    process.exit(1);
  }
  if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET no está definido en las variables de entorno. Usá un string aleatorio de al menos 32 caracteres.');
    process.exit(1);
  }
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
  };
}

export function signJwt(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

const MOCK_USER = { id: 'dev-user', email: 'dev@localhost', name: 'Dev Local' };

export function getUserFromRequest(request) {
  if (process.env.DEV_BYPASS_AUTH === 'true') return MOCK_USER;
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return verifyJwt(auth.slice(7));
}
