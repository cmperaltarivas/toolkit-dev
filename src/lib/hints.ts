import type { DomainHint, DetectedTool } from '../types';

const DOMAIN_HINTS: Record<string, DomainHint> = {
  'react.dev': { name: 'React', desc: 'Biblioteca de JS para interfaces de usuario.', cat: 'Frontend', tags: ['react', 'frontend', 'ui'] },
  'nextjs.org': { name: 'Next.js', desc: 'Framework React con SSR + SSG.', cat: 'Frontend', tags: ['react', 'ssr', 'frontend', 'fullstack'] },
  'tailwindcss.com': { name: 'Tailwind CSS', desc: 'Framework CSS utility-first.', cat: 'Frontend', tags: ['css', 'frontend', 'ui', 'utility'] },
  'vuejs.org': { name: 'Vue.js', desc: 'Framework progresivo de JS para interfaces.', cat: 'Frontend', tags: ['vue', 'frontend', 'spa'] },
  'nuxt.com': { name: 'Nuxt', desc: 'Framework Vue con SSR + SSG.', cat: 'Frontend', tags: ['vue', 'ssr', 'frontend'] },
  'angular.io': { name: 'Angular', desc: 'Framework de JS para apps empresariales.', cat: 'Frontend', tags: ['angular', 'frontend', 'spa'] },
  'svelte.dev': { name: 'Svelte', desc: 'Framework de UI que compila a JS vanilla.', cat: 'Frontend', tags: ['svelte', 'frontend', 'compiler'] },
  'vite.dev': { name: 'Vite', desc: 'Build tool ultrarrápida para JS moderno.', cat: 'Frontend', tags: ['vite', 'bundler', 'frontend'] },
  'astro.build': { name: 'Astro', desc: 'Framework web que genera HTML con cero JS por defecto.', cat: 'Frontend', tags: ['astro', 'ssr', 'frontend'] },
  'typescriptlang.org': { name: 'TypeScript', desc: 'Superset tipado de JavaScript.', cat: 'Frontend', tags: ['typescript', 'language', 'types'] },
  'nodejs.org': { name: 'Node.js', desc: 'Entorno JS del lado del servidor.', cat: 'Backend', tags: ['node', 'backend', 'runtime', 'javascript'] },
  'expressjs.com': { name: 'Express', desc: 'Framework web minimalista para Node.js.', cat: 'Backend', tags: ['express', 'backend', 'api', 'node'] },
  'nestjs.com': { name: 'NestJS', desc: 'Framework progresivo de Node.js con TypeScript.', cat: 'Backend', tags: ['nestjs', 'backend', 'api', 'node'] },
  'deno.com': { name: 'Deno', desc: 'Runtime seguro de JS/TS.', cat: 'Backend', tags: ['deno', 'runtime', 'javascript'] },
  'python.org': { name: 'Python', desc: 'Lenguaje de programación versátil.', cat: 'Backend', tags: ['python', 'language', 'backend'] },
  'golang.org': { name: 'Go', desc: 'Lenguaje compilado rápido y concurrente.', cat: 'Backend', tags: ['go', 'language', 'backend'] },
  'rust-lang.org': { name: 'Rust', desc: 'Lenguaje de sistemas seguro y rápido.', cat: 'Backend', tags: ['rust', 'language', 'systems'] },
  'graphql.org': { name: 'GraphQL', desc: 'Lenguaje de consulta para APIs.', cat: 'Backend', tags: ['graphql', 'api', 'query'] },
  'trpc.io': { name: 'tRPC', desc: 'APIs end-to-end typesafe.', cat: 'Backend', tags: ['trpc', 'api', 'typescript'] },
  'prisma.io': { name: 'Prisma', desc: 'ORM para Node.js/TypeScript con consultas tipadas.', cat: 'Base de Datos', tags: ['prisma', 'orm', 'database', 'node'] },
  'supabase.com': { name: 'Supabase', desc: 'Backend como servicio open-source.', cat: 'Base de Datos', tags: ['supabase', 'baas', 'postgres', 'realtime'] },
  'sqlite.org': { name: 'SQLite', desc: 'Base de datos embebida más usada.', cat: 'Base de Datos', tags: ['sqlite', 'database', 'embedded', 'sql'] },
  'mongodb.com': { name: 'MongoDB', desc: 'Base de datos NoSQL documental.', cat: 'Base de Datos', tags: ['mongodb', 'nosql', 'database'] },
  'postgresql.org': { name: 'PostgreSQL', desc: 'Base de datos relacional open-source.', cat: 'Base de Datos', tags: ['postgres', 'database', 'sql'] },
  'redis.io': { name: 'Redis', desc: 'Base de datos en memoria para caché.', cat: 'Base de Datos', tags: ['redis', 'cache', 'database'] },
  'docker.com': { name: 'Docker', desc: 'Plataforma de contenedores.', cat: 'DevOps', tags: ['docker', 'containers', 'devops', 'deployment'] },
  'kubernetes.io': { name: 'Kubernetes', desc: 'Orquestador de contenedores.', cat: 'DevOps', tags: ['kubernetes', 'containers', 'orchestration'] },
  'vercel.com': { name: 'Vercel', desc: 'Plataforma de deploy para frontend.', cat: 'DevOps', tags: ['vercel', 'deploy', 'serverless', 'hosting'] },
  'netlify.com': { name: 'Netlify', desc: 'Plataforma de deploy con serverless.', cat: 'DevOps', tags: ['netlify', 'deploy', 'serverless', 'hosting'] },
  'github.com': { name: 'GitHub', desc: 'Plataforma de desarrollo colaborativo.', cat: 'DevOps', tags: ['github', 'git', 'collaboration', 'ci-cd'] },
  'cloudflare.com': { name: 'Cloudflare', desc: 'CDN, DNS, seguridad y edge computing.', cat: 'DevOps', tags: ['cloudflare', 'cdn', 'dns', 'security'] },
  'figma.com': { name: 'Figma', desc: 'Editor de diseño colaborativo en el navegador.', cat: 'Design/UI', tags: ['figma', 'design', 'ui', 'ux'] },
  'vitest.dev': { name: 'Vitest', desc: 'Framework de testing ultrarrápido nativo de Vite.', cat: 'Testing', tags: ['vitest', 'testing', 'vite'] },
  'playwright.dev': { name: 'Playwright', desc: 'Framework de testing e2e multi-navegador.', cat: 'Testing', tags: ['playwright', 'e2e', 'testing'] },
  'reactnative.dev': { name: 'React Native', desc: 'Framework para apps móviles nativas con React.', cat: 'Mobile', tags: ['react-native', 'mobile', 'cross-platform'] },
  'flutter.dev': { name: 'Flutter', desc: 'Framework de Google para apps nativas multi-plataforma.', cat: 'Mobile', tags: ['flutter', 'mobile', 'dart'] },
  'youtube.com': { name: 'YouTube', desc: 'Tutoriales, cursos y contenido tech.', cat: 'Contenido/YouTube', tags: ['youtube', 'tutorial', 'video'] },
  'midu.dev': { name: 'Midudev', desc: 'Canal de desarrollo web con tutoriales y live coding.', cat: 'Contenido/YouTube', tags: ['midudev', 'javascript', 'react', 'tutorial'] },
  'fireship.io': { name: 'Fireship', desc: 'Tutoriales rápidos de desarrollo web moderno.', cat: 'Contenido/YouTube', tags: ['fireship', 'javascript', 'tutorial'] },
  'news.ycombinator.com': { name: 'Hacker News', desc: 'Comunidad tech con noticias y tendencias.', cat: 'Blog/Artículos', tags: ['hacker-news', 'news', 'community'] },
  'dev.to': { name: 'DEV Community', desc: 'Comunidad de desarrolladores con artículos.', cat: 'Blog/Artículos', tags: ['devto', 'blog', 'community'] },
  'neovim.io': { name: 'Neovim', desc: 'Editor de texto moderno basado en Vim.', cat: 'Herramienta CLI', tags: ['neovim', 'editor', 'vim', 'cli'] },
  'curl.se': { name: 'curl', desc: 'CLI para transferir datos con URLs.', cat: 'Herramienta CLI', tags: ['curl', 'http', 'cli', 'networking'] },
  'git-scm.com': { name: 'Git', desc: 'Sistema de control de versiones distribuido.', cat: 'Herramienta CLI', tags: ['git', 'vcs', 'cli'] },
  'notion.so': { name: 'Notion', desc: 'Espacio de trabajo todo-en-uno.', cat: 'Productividad', tags: ['notion', 'notes', 'productivity'] },
  'obsidian.md': { name: 'Obsidian', desc: 'Gestor de conocimiento basado en Markdown.', cat: 'Productividad', tags: ['obsidian', 'notes', 'knowledge'] },
  'stripe.com': { name: 'Stripe', desc: 'Plataforma de pagos online.', cat: 'API/Service', tags: ['stripe', 'payments', 'api'] },
  'sentry.io': { name: 'Sentry', desc: 'Monitoreo de errores y rendimiento.', cat: 'API/Service', tags: ['sentry', 'error-tracking', 'monitoring'] },
  'postman.com': { name: 'Postman', desc: 'Plataforma para desarrollo y testing de APIs.', cat: 'API/Service', tags: ['postman', 'api', 'testing'] },
};

export function findHint(urlStr: string): DomainHint | null {
  try {
    const url = new URL(urlStr.trim());
    let host = url.hostname.replace(/^www\./, '').toLowerCase();
    let match = DOMAIN_HINTS[host];
    if (!match) {
      const p = host.split('.');
      if (p.length >= 2) match = DOMAIN_HINTS[`${p[p.length - 2]}.${p[p.length - 1]}`];
    }
    return match ?? null;
  } catch { return null; }
}

function makeNameFromUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr.trim());
    let host = url.hostname.replace(/^www\./, '').toLowerCase();
    const parts = host.split('.');
    let name = parts[0];
    if (name === 'news') name = parts.slice(0, -1).join(' ');
    name = name.replace(/[_-]/g, ' ');
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } catch { return ''; }
}

export function autoDetectFromUrl(urlStr: string): DetectedTool {
  const hint = findHint(urlStr);
  return {
    name: hint ? hint.name : makeNameFromUrl(urlStr),
    category: hint ? hint.cat : '',
    tags: hint ? [...hint.tags] : [],
    desc: hint ? hint.desc : '',
    url: urlStr,
    detected: !!hint,
  };
}

export const CATEGORIES = [
  'Frontend', 'Backend', 'DevOps', 'Base de Datos', 'Mobile', 'Testing',
  'Design/UI', 'Data Science', 'Productividad', 'Contenido/YouTube',
  'Blog/Artículos', 'Herramienta CLI', 'API/Service', 'Educación', 'Otro',
];

export const IMPORTANCIAS = [
  { id: 'critico', label: '⭐ Crítico', cls: 'tag-imp-critico' },
  { id: 'esencial', label: '🔥 Esencial', cls: 'tag-imp-esencial' },
  { id: 'util', label: '💡 Útil', cls: 'tag-imp-util' },
  { id: 'opcional', label: '🔹 Opcional', cls: 'tag-imp-opcional' },
];
