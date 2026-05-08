const DOMAIN_HINTS = {
  // ── Frontend ──
  'react.dev':            { name: 'React', desc: 'Biblioteca de JS para interfaces de usuario. Ideal para SPA y aplicaciones interactivas.', cat: 'Frontend', tags: ['react', 'frontend', 'ui'] },
  'nextjs.org':           { name: 'Next.js', desc: 'Framework React con SSR + SSG. Ideal para sitios fullstack.', cat: 'Frontend', tags: ['react', 'ssr', 'frontend', 'fullstack'] },
  'tailwindcss.com':      { name: 'Tailwind CSS', desc: 'Framework CSS utility-first. Prototipado rápido y diseño consistente sin salir del HTML.', cat: 'Frontend', tags: ['css', 'frontend', 'ui', 'utility'] },
  'vuejs.org':            { name: 'Vue.js', desc: 'Framework progresivo de JS para interfaces de usuario.', cat: 'Frontend', tags: ['vue', 'frontend', 'spa'] },
  'nuxt.com':             { name: 'Nuxt', desc: 'Framework Vue con SSR + SSG. Fullstack sobre Vue.', cat: 'Frontend', tags: ['vue', 'ssr', 'frontend'] },
  'angular.io':           { name: 'Angular', desc: 'Framework de JS para aplicaciones web empresariales.', cat: 'Frontend', tags: ['angular', 'frontend', 'spa'] },
  'svelte.dev':           { name: 'Svelte', desc: 'Framework de UI que compila a JS vanilla. Sin runtime.', cat: 'Frontend', tags: ['svelte', 'frontend', 'compiler'] },
  'sveltekit.dev':        { name: 'SvelteKit', desc: 'Framework de aplicaciones Svelte con SSR y routing.', cat: 'Frontend', tags: ['svelte', 'ssr', 'frontend'] },
  'vite.dev':             { name: 'Vite', desc: 'Build tool ultrarrápida para proyectos modernos de JS.', cat: 'Frontend', tags: ['vite', 'bundler', 'frontend'] },
  'astro.build':          { name: 'Astro', desc: 'Framework web que genera HTML estático con cero JS por defecto.', cat: 'Frontend', tags: ['astro', 'ssr', 'frontend'] },
  'remix.run':            { name: 'Remix', desc: 'Framework React fullstack con routing anidado.', cat: 'Frontend', tags: ['react', 'ssr', 'frontend'] },
  'gatsbyjs.com':         { name: 'Gatsby', desc: 'Framework React con SSG y ecosistema de plugins.', cat: 'Frontend', tags: ['react', 'ssg', 'frontend'] },
  'typescriptlang.org':   { name: 'TypeScript', desc: 'Superset tipado de JavaScript. Compila a JS.', cat: 'Frontend', tags: ['typescript', 'language', 'types'] },
  'eslint.org':           { name: 'ESLint', desc: 'Linter extensible para JavaScript y TypeScript.', cat: 'Frontend', tags: ['linter', 'code', 'quality'] },
  'prettier.io':          { name: 'Prettier', desc: 'Formatter de código opinado. Soporta múltiples lenguajes.', cat: 'Frontend', tags: ['formatter', 'code', 'tool'] },
  'storybook.js.org':     { name: 'Storybook', desc: 'Taller de componentes para desarrollo y documentación de UI.', cat: 'Frontend', tags: ['storybook', 'ui', 'components'] },

  // ── Backend ──
  'nodejs.org':           { name: 'Node.js', desc: 'Entorno JS del lado del servidor. Ideal para APIs, herramientas CLI y backend.', cat: 'Backend', tags: ['node', 'backend', 'runtime', 'javascript'] },
  'expressjs.com':        { name: 'Express', desc: 'Framework web minimalista para Node.js. Ideal para APIs REST.', cat: 'Backend', tags: ['express', 'backend', 'api', 'node'] },
  'nestjs.com':           { name: 'NestJS', desc: 'Framework progresivo de Node.js con TypeScript, inspirado en Angular.', cat: 'Backend', tags: ['nestjs', 'backend', 'api', 'node'] },
  'deno.com':             { name: 'Deno', desc: 'Runtime seguro de JS/TS creado por el autor de Node.', cat: 'Backend', tags: ['deno', 'runtime', 'javascript'] },
  'bun.sh':               { name: 'Bun', desc: 'Runtime y toolkit JS ultrarrápido. Incluye bundler, test runner y npm.', cat: 'Backend', tags: ['bun', 'runtime', 'javascript'] },
  'python.org':           { name: 'Python', desc: 'Lenguaje de programación versátil para backend, data science y scripting.', cat: 'Backend', tags: ['python', 'language', 'backend'] },
  'djangoproject.com':    { name: 'Django', desc: 'Framework web Python con batteries included.', cat: 'Backend', tags: ['django', 'python', 'backend'] },
  'golang.org':           { name: 'Go', desc: 'Lenguaje compilado rápido y concurrente de Google.', cat: 'Backend', tags: ['go', 'language', 'backend'] },
  'rust-lang.org':        { name: 'Rust', desc: 'Lenguaje de sistemas seguro y rápido. Sin GC.', cat: 'Backend', tags: ['rust', 'language', 'systems'] },
  'graphql.org':          { name: 'GraphQL', desc: 'Lenguaje de consulta para APIs. Alternativa a REST.', cat: 'Backend', tags: ['graphql', 'api', 'query'] },
  'trpc.io':              { name: 'tRPC', desc: 'APIs end-to-end typesafe sin contratos ni generación de código.', cat: 'Backend', tags: ['trpc', 'api', 'typescript'] },

  // ── Base de Datos ──
  'prisma.io':            { name: 'Prisma', desc: 'ORM para Node.js/TypeScript. Consultas tipadas y migraciones.', cat: 'Base de Datos', tags: ['prisma', 'orm', 'database', 'node'] },
  'supabase.com':         { name: 'Supabase', desc: 'Backend como servicio open-source. PostgreSQL, auth, storage.', cat: 'Base de Datos', tags: ['supabase', 'baas', 'postgres', 'realtime'] },
  'sqlite.org':           { name: 'SQLite', desc: 'Base de datos embebida más usada del mundo. Sin servidor.', cat: 'Base de Datos', tags: ['sqlite', 'database', 'embedded', 'sql'] },
  'mongodb.com':          { name: 'MongoDB', desc: 'Base de datos NoSQL documental. Escalable y flexible.', cat: 'Base de Datos', tags: ['mongodb', 'nosql', 'database'] },
  'postgresql.org':       { name: 'PostgreSQL', desc: 'Base de datos relacional open-source avanzada.', cat: 'Base de Datos', tags: ['postgres', 'database', 'sql'] },
  'redis.io':             { name: 'Redis', desc: 'Base de datos en memoria, usada como caché y cola de mensajes.', cat: 'Base de Datos', tags: ['redis', 'cache', 'database'] },
  'neon.tech':            { name: 'Neon', desc: 'PostgreSQL serverless con bifurcación instantánea.', cat: 'Base de Datos', tags: ['postgres', 'serverless', 'database'] },
  'planetscale.com':      { name: 'PlanetScale', desc: 'Base de datos MySQL serverless con branching.', cat: 'Base de Datos', tags: ['mysql', 'serverless', 'database'] },

  // ── DevOps ──
  'docker.com':           { name: 'Docker', desc: 'Plataforma de contenedores para entornos reproducibles.', cat: 'DevOps', tags: ['docker', 'containers', 'devops', 'deployment'] },
  'kubernetes.io':        { name: 'Kubernetes', desc: 'Orquestador de contenedores para producción a escala.', cat: 'DevOps', tags: ['kubernetes', 'containers', 'orchestration'] },
  'vercel.com':           { name: 'Vercel', desc: 'Plataforma de deploy para frontend. Serverless y edge functions.', cat: 'DevOps', tags: ['vercel', 'deploy', 'serverless', 'hosting'] },
  'netlify.com':          { name: 'Netlify', desc: 'Plataforma de deploy con funciones serverless y formularios.', cat: 'DevOps', tags: ['netlify', 'deploy', 'serverless', 'hosting'] },
  'railway.app':          { name: 'Railway', desc: 'Plataforma de deploy con infraestructura simplificada.', cat: 'DevOps', tags: ['railway', 'deploy', 'hosting'] },
  'fly.io':               { name: 'Fly.io', desc: 'Plataforma de deploy con边缘 computing y Postgres global.', cat: 'DevOps', tags: ['fly', 'deploy', 'hosting'] },
  'github.com':           { name: 'GitHub', desc: 'Plataforma de desarrollo colaborativo. Git hosting, CI/CD, issues.', cat: 'DevOps', tags: ['github', 'git', 'collaboration', 'ci-cd'] },
  'gitlab.com':           { name: 'GitLab', desc: 'Plataforma DevOps completa con Git, CI/CD y registries.', cat: 'DevOps', tags: ['gitlab', 'git', 'ci-cd'] },
  'cloudflare.com':       { name: 'Cloudflare', desc: 'Red de entrega de contenido, DNS, seguridad y edge computing.', cat: 'DevOps', tags: ['cloudflare', 'cdn', 'dns', 'security'] },

  // ── Testing ──
  'vitest.dev':           { name: 'Vitest', desc: 'Framework de testing ultrarrápido nativo de Vite.', cat: 'Testing', tags: ['vitest', 'testing', 'vite'] },
  'jestjs.io':            { name: 'Jest', desc: 'Framework de testing para JS con zero config.', cat: 'Testing', tags: ['jest', 'testing', 'javascript'] },
  'playwright.dev':       { name: 'Playwright', desc: 'Framework de testing e2e para múltiples navegadores.', cat: 'Testing', tags: ['playwright', 'e2e', 'testing'] },
  'cypress.io':           { name: 'Cypress', desc: 'Framework de testing e2e moderno con time travel.', cat: 'Testing', tags: ['cypress', 'e2e', 'testing'] },

  // ── Design/UI ──
  'figma.com':            { name: 'Figma', desc: 'Editor de diseño colaborativo en el navegador. UI/UX y prototipado.', cat: 'Design/UI', tags: ['figma', 'design', 'ui', 'ux'] },
  'framer.com':           { name: 'Framer', desc: 'Herramienta de diseño y prototipado con componentes interactivos.', cat: 'Design/UI', tags: ['framer', 'design', 'prototyping'] },
  'coolors.co':           { name: 'Coolors', desc: 'Generador de paletas de colores rápido.', cat: 'Design/UI', tags: ['palette', 'color', 'design'] },
  'dribbble.com':         { name: 'Dribbble', desc: 'Comunidad de diseño para mostrar y descubrir trabajos creativos.', cat: 'Design/UI', tags: ['dribbble', 'design', 'inspiration'] },

  // ── Mobile ──
  'reactnative.dev':      { name: 'React Native', desc: 'Framework para apps móviles nativas con React.', cat: 'Mobile', tags: ['react-native', 'mobile', 'cross-platform'] },
  'flutter.dev':          { name: 'Flutter', desc: 'Framework de Google para apps nativas multi-plataforma.', cat: 'Mobile', tags: ['flutter', 'mobile', 'dart'] },
  'expo.dev':             { name: 'Expo', desc: 'Framework y plataforma para apps React Native simplificadas.', cat: 'Mobile', tags: ['expo', 'react-native', 'mobile'] },

  // ── Contenido/YouTube ──
  'youtube.com':          { name: 'YouTube', desc: 'Plataforma de videos. Tutoriales, cursos y contenido tech.', cat: 'Contenido/YouTube', tags: ['youtube', 'tutorial', 'video'] },
  'twitch.tv':            { name: 'Twitch', desc: 'Plataforma de streaming en vivo. Coding y desarrollo en directo.', cat: 'Contenido/YouTube', tags: ['twitch', 'streaming', 'live'] },
  'midu.dev':             { name: 'Midudev', desc: 'Canal de desarrollo web con tutoriales, live coding y entrevistas.', cat: 'Contenido/YouTube', tags: ['midudev', 'javascript', 'react', 'tutorial'] },
  'fireship.io':          { name: 'Fireship', desc: 'Tutoriales rápidos y precisos sobre desarrollo web moderno.', cat: 'Contenido/YouTube', tags: ['fireship', 'javascript', 'tutorial'] },
  't3.gg':                { name: 'Theo — t3.gg', desc: 'Contenido sobre TypeScript, t3 stack y desarrollo web moderno.', cat: 'Contenido/YouTube', tags: ['theo', 'typescript', 't3', 'web'] },

  // ── Blog/Artículos ──
  'news.ycombinator.com': { name: 'Hacker News', desc: 'Comunidad tech con noticias, discusiones y tendencias.', cat: 'Blog/Artículos', tags: ['hacker-news', 'news', 'community'] },
  'dev.to':               { name: 'DEV Community', desc: 'Comunidad de desarrolladores con artículos y debates.', cat: 'Blog/Artículos', tags: ['devto', 'blog', 'community'] },
  'medium.com':           { name: 'Medium', desc: 'Plataforma de blogs con artículos técnicos y generales.', cat: 'Blog/Artículos', tags: ['medium', 'blog', 'articles'] },
  'css-tricks.com':       { name: 'CSS-Tricks', desc: 'Blog sobre CSS, frontend y desarrollo web.', cat: 'Blog/Artículos', tags: ['css', 'frontend', 'blog'] },

  // ── Herramienta CLI ──
  'neovim.io':            { name: 'Neovim', desc: 'Editor de texto moderno basado en Vim. Extensible con Lua.', cat: 'Herramienta CLI', tags: ['neovim', 'editor', 'vim', 'cli'] },
  'ohmyz.sh':             { name: 'Oh My Zsh', desc: 'Framework para gestionar tu configuración de Zsh.', cat: 'Herramienta CLI', tags: ['oh-my-zsh', 'terminal', 'zsh', 'cli'] },
  'curl.se':              { name: 'curl', desc: 'CLI para transferir datos con URLs. HTTP, FTP y más.', cat: 'Herramienta CLI', tags: ['curl', 'http', 'cli', 'networking'] },
  'git-scm.com':          { name: 'Git', desc: 'Sistema de control de versiones distribuido.', cat: 'Herramienta CLI', tags: ['git', 'vcs', 'cli'] },

  // ── Productividad ──
  'notion.so':            { name: 'Notion', desc: 'Espacio de trabajo todo-en-uno: notas, proyectos, wikis.', cat: 'Productividad', tags: ['notion', 'notes', 'productivity'] },
  'obsidian.md':          { name: 'Obsidian', desc: 'Gestor de conocimiento basado en archivos Markdown locales.', cat: 'Productividad', tags: ['obsidian', 'notes', 'knowledge'] },
  'todoist.com':          { name: 'Todoist', desc: 'Gestor de tareas multiplataforma con organización por proyectos.', cat: 'Productividad', tags: ['todoist', 'tasks', 'productivity'] },
  'linear.app':           { name: 'Linear', desc: 'Gestión de proyectos e issues para equipos de desarrollo.', cat: 'Productividad', tags: ['linear', 'project-management', 'issues'] },

  // ── API/Service ──
  'stripe.com':           { name: 'Stripe', desc: 'Plataforma de pagos online para internet.', cat: 'API/Service', tags: ['stripe', 'payments', 'api'] },
  'algolia.com':          { name: 'Algolia', desc: 'Motor de búsqueda como servicio. Rápido y relevante.', cat: 'API/Service', tags: ['algolia', 'search', 'api'] },
  'sentry.io':            { name: 'Sentry', desc: 'Monitoreo de errores y rendimiento para aplicaciones.', cat: 'API/Service', tags: ['sentry', 'error-tracking', 'monitoring'] },
  'postman.com':          { name: 'Postman', desc: 'Plataforma para desarrollo y testing de APIs.', cat: 'API/Service', tags: ['postman', 'api', 'testing'] },
};

function findHint(urlStr) {
  try {
    const url = new URL(urlStr.trim());
    let host = url.hostname.replace(/^www\./, '').toLowerCase();
    let match = DOMAIN_HINTS[host];
    if (!match) {
      const p = host.split('.');
      if (p.length >= 2) match = DOMAIN_HINTS[`${p[p.length-2]}.${p[p.length-1]}`];
    }
    return match || null;
  } catch { return null; }
}

function makeNameFromUrl(urlStr) {
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

function autoDetectFromUrl(urlStr) {
  const hint = findHint(urlStr);
  const name = hint ? hint.name : makeNameFromUrl(urlStr);
  const cat = hint ? hint.cat : '';
  const tags = hint ? [...hint.tags] : [];
  const desc = hint ? hint.desc : '';
  return { name, category: cat, tags, desc, url: urlStr, detected: !!hint };
}
