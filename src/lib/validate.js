const CATEGORIES = [
  'Frontend', 'Backend', 'DevOps', 'Base de Datos', 'Mobile', 'Testing',
  'Design/UI', 'Data Science', 'Productividad', 'Contenido/YouTube',
  'Blog/Artículos', 'Herramienta CLI', 'API/Service', 'Educación', 'Otro'
];
const IMPORTANCIAS = ['critico', 'esencial', 'util', 'opcional'];
const MAX_FIELD_LENGTHS = { name: 200, url: 2000, desc: 2000 };

export function validarTool(data, partial = false) {
  const errors = [];

  if (!partial || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.push('name: requerido');
    } else if (data.name.trim().length > MAX_FIELD_LENGTHS.name) {
      errors.push(`name: máximo ${MAX_FIELD_LENGTHS.name} caracteres`);
    }
  }

  if (!partial || data.url !== undefined) {
    if (!data.url || typeof data.url !== 'string' || !data.url.trim()) {
      errors.push('url: requerido');
    } else if (data.url.trim().length > MAX_FIELD_LENGTHS.url) {
      errors.push(`url: máximo ${MAX_FIELD_LENGTHS.url} caracteres`);
    } else {
      try { new URL(data.url.trim()); } catch { errors.push('url: formato inválido'); }
    }
  }

  if (!partial || data.desc !== undefined) {
    if (data.desc !== undefined && data.desc !== null) {
      if (typeof data.desc !== 'string') {
        errors.push('desc: debe ser texto');
      } else if (data.desc.trim().length > MAX_FIELD_LENGTHS.desc) {
        errors.push(`desc: máximo ${MAX_FIELD_LENGTHS.desc} caracteres`);
      }
    }
  }

  if (!partial || data.category !== undefined) {
    if (data.category && !CATEGORIES.includes(data.category)) {
      errors.push(`category: debe ser uno de: ${CATEGORIES.join(', ')}`);
    }
  }

  if (!partial || data.importance !== undefined) {
    if (data.importance && !IMPORTANCIAS.includes(data.importance)) {
      errors.push(`importance: debe ser uno de: ${IMPORTANCIAS.join(', ')}`);
    }
  }

  if (!partial || data.tags !== undefined) {
    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      errors.push('tags: debe ser un array');
    }
  }

  if (!partial || data.favicon !== undefined) {
    if (data.favicon && typeof data.favicon === 'string' && data.favicon.trim()) {
      try { new URL(data.favicon.trim()); } catch { errors.push('favicon: formato de URL inválido'); }
    }
  }

  return errors;
}

const SECURITY_HEADERS = {
  'content-type': 'application/json',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-xss-protection': '1; mode=block',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...SECURITY_HEADERS }
  });
}
