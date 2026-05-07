import { qrun, qget } from './src/lib/db.js';
import { v4 as uuidv4 } from 'uuid';

const seed = [
  { name: 'React', url: 'https://react.dev', desc: 'Biblioteca de JS para interfaces de usuario.', category: 'Frontend', importance: 'esencial', tags: ['react', 'frontend', 'ui', 'spa'] },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com', desc: 'Framework CSS utility-first.', category: 'Frontend', importance: 'esencial', tags: ['css', 'frontend', 'ui', 'utility'] },
  { name: 'Next.js', url: 'https://nextjs.org', desc: 'Framework React con SSR + SSG.', category: 'Frontend', importance: 'esencial', tags: ['react', 'ssr', 'frontend', 'fullstack'] },
  { name: 'Node.js', url: 'https://nodejs.org', desc: 'Entorno JS del lado del servidor.', category: 'Backend', importance: 'esencial', tags: ['javascript', 'backend', 'runtime', 'api'] },
  { name: 'Express', url: 'https://expressjs.com', desc: 'Framework web para Node.js.', category: 'Backend', importance: 'esencial', tags: ['node', 'backend', 'api', 'framework'] },
  { name: 'Prisma', url: 'https://prisma.io', desc: 'ORM para Node.js/TypeScript.', category: 'Base de Datos', importance: 'esencial', tags: ['orm', 'database', 'typescript', 'node'] },
  { name: 'Supabase', url: 'https://supabase.com', desc: 'Backend como servicio open-source.', category: 'Backend', importance: 'util', tags: ['baas', 'postgres', 'auth', 'realtime'] },
  { name: 'Docker', url: 'https://docker.com', desc: 'Plataforma de contenedores.', category: 'DevOps', importance: 'critico', tags: ['containers', 'devops', 'deployment', 'infra'] },
  { name: 'Vercel', url: 'https://vercel.com', desc: 'Plataforma de deploy frontend.', category: 'DevOps', importance: 'util', tags: ['deploy', 'serverless', 'frontend', 'hosting'] },
  { name: 'Figma', url: 'https://figma.com', desc: 'Herramienta de diseño colaborativa.', category: 'Design/UI', importance: 'util', tags: ['design', 'ui', 'ux', 'prototyping'] },
  { name: 'Vitest', url: 'https://vitest.dev', desc: 'Framework de testing ultrarrápido.', category: 'Testing', importance: 'util', tags: ['testing', 'vite', 'javascript', 'tdd'] },
  { name: 'Neovim', url: 'https://neovim.io', desc: 'Editor extensible basado en Vim.', category: 'Herramienta CLI', importance: 'util', tags: ['editor', 'vim', 'cli', 'productivity'] },
  { name: 'Oh My Zsh', url: 'https://ohmyz.sh', desc: 'Framework Zsh con plugins y temas.', category: 'Productividad', importance: 'opcional', tags: ['terminal', 'zsh', 'productivity', 'cli'] },
  { name: 'Midudev — YouTube', url: 'https://youtube.com/@midudev', desc: 'Canal de desarrollo web.', category: 'Contenido/YouTube', importance: 'esencial', tags: ['youtube', 'javascript', 'react', 'tutorial'] },
  { name: 'Fireship.io', url: 'https://fireship.io', desc: 'Tutoriales rápidos de desarrollo web.', category: 'Contenido/YouTube', importance: 'util', tags: ['youtube', 'firebase', 'flutter', 'tutorial'] },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', desc: 'Comunidad tech y tendencias.', category: 'Blog/Artículos', importance: 'opcional', tags: ['news', 'community', 'tech', 'discussion'] },
  { name: 'Theo — t3.gg', url: 'https://t3.gg', desc: 'Contenido sobre TypeScript y T3 Stack.', category: 'Contenido/YouTube', importance: 'opcional', tags: ['youtube', 'typescript', 't3', 'web'] },
  { name: 'SQLite', url: 'https://sqlite.org', desc: 'Base de datos embebida más usada.', category: 'Base de Datos', importance: 'esencial', tags: ['database', 'sql', 'embedded', 'lightweight'] },
  { name: 'TypeScript', url: 'https://typescriptlang.org', desc: 'Superset tipado de JavaScript.', category: 'Frontend', importance: 'critico', tags: ['typescript', 'javascript', 'language', 'types'] },
  { name: 'curl', url: 'https://curl.se', desc: 'CLI para transferir datos con URLs.', category: 'Herramienta CLI', importance: 'esencial', tags: ['cli', 'http', 'api', 'networking'] },
];

function main() {
  const existing = qget('SELECT COUNT(*) as count FROM herramientas');
  if (existing && existing.count > 0) {
    console.log(`Ya hay ${existing.count} herramientas. Saltando seed.`);
    process.exit(0);
  }

  for (const s of seed) {
    const visits = Math.floor(Math.random() * 45);
    const favorite = Math.random() > 0.7 ? 1 : 0;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    const created = date.toISOString();
    qrun('INSERT INTO herramientas (id,name,url,desc,category,importance,tags,favorite,visits,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      uuidv4(), s.name, s.url, s.desc, s.category, s.importance, JSON.stringify(s.tags), favorite, visits, created, created);
  }

  console.log(`${seed.length} herramientas insertadas correctamente.`);
  process.exit(0);
}

main();
