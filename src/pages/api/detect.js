import { json } from '../../lib/validate';

const CATEGORIES = [
  'Frontend', 'Backend', 'DevOps', 'Base de Datos', 'Mobile', 'Testing',
  'Design/UI', 'Data Science', 'Productividad', 'Contenido/YouTube',
  'Blog/Artículos', 'Herramienta CLI', 'API/Service', 'Educación', 'Otro',
];

const DOMAIN_CATEGORIES = {
  'dev': 'Frontend', 'io': 'Frontend', 'app': 'Frontend',
  'com': null, 'org': null, 'net': null, 'co': null,
  'github.io': 'Frontend', 'gitlab.io': 'Frontend',
  'vercel.app': 'DevOps', 'netlify.app': 'DevOps',
  'fly.dev': 'DevOps', 'railway.app': 'DevOps',
  'youtube.com': 'Contenido/YouTube', 'youtu.be': 'Contenido/YouTube',
  'twitch.tv': 'Contenido/YouTube', 'medium.com': 'Blog/Artículos',
  'dev.to': 'Blog/Artículos', 'notion.so': 'Productividad',
  'github.com': 'DevOps', 'gitlab.com': 'DevOps',
  'bitbucket.org': 'DevOps', 'npmjs.com': 'Frontend',
  'crates.io': 'Backend', 'pypi.org': 'Backend',
  'docker.com': 'DevOps', 'hub.docker.com': 'DevOps',
};

const KEYWORD_CATEGORIES = [
  { keywords: ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'tailwind', 'css', 'html', 'frontend', 'ui', 'ux', 'web', 'spa', 'pwa', 'astro', 'gatsby', 'remix'], cat: 'Frontend' },
  { keywords: ['node', 'express', 'nestjs', 'deno', 'bun', 'python', 'django', 'flask', 'ruby', 'rails', 'go', 'rust', 'graphql', 'trpc', 'rest', 'api', 'backend', 'server'], cat: 'Backend' },
  { keywords: ['sql', 'database', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'prisma', 'drizzle', 'orm', 'supabase', 'firebase'], cat: 'Base de Datos' },
  { keywords: ['docker', 'kubernetes', 'k8s', 'devops', 'ci', 'cd', 'deploy', 'serverless', 'terraform', 'ansible', 'github', 'gitlab', 'cloud'], cat: 'DevOps' },
  { keywords: ['test', 'jest', 'vitest', 'playwright', 'cypress', 'e2e', 'unit', 'tdd'], cat: 'Testing' },
  { keywords: ['figma', 'design', 'ui', 'ux', 'sketch', 'framer', 'prototype', 'wireframe'], cat: 'Design/UI' },
  { keywords: ['react native', 'flutter', 'android', 'ios', 'mobile', 'swift', 'kotlin', 'expo', 'capacitor'], cat: 'Mobile' },
  { keywords: ['python', 'data', 'science', 'machine learning', 'ai', 'tensorflow', 'pytorch', 'jupyter', 'numpy', 'pandas'], cat: 'Data Science' },
  { keywords: ['cli', 'terminal', 'bash', 'zsh', 'vim', 'neovim', 'git', 'curl', 'wget'], cat: 'Herramienta CLI' },
  { keywords: ['youtube', 'tutorial', 'curso', 'clase', 'video', 'twitch', 'stream'], cat: 'Contenido/YouTube' },
  { keywords: ['blog', 'articulo', 'news', 'medium', 'dev.to'], cat: 'Blog/Artículos' },
  { keywords: ['notion', 'obsidian', 'todoist', 'linear', 'trello', 'slack', 'discord', 'productividad'], cat: 'Productividad' },
  { keywords: ['stripe', 'payment', 'algolia', 'search', 'sentry', 'monitoring', 'postman', 'email', 'auth'], cat: 'API/Service' },
  { keywords: ['learn', 'course', 'school', 'educacion', 'documentacion', 'doc', 'docs'], cat: 'Educación' },
];

function guessCategory(urlStr, title, desc) {
  try {
    const url = new URL(urlStr.trim());
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const fullText = `${title} ${desc} ${host} ${url.pathname}`.toLowerCase();

    // Check known domains
    if (DOMAIN_CATEGORIES[host]) return DOMAIN_CATEGORIES[host];
    const parts = host.split('.');
    for (let i = parts.length - 2; i >= 0; i--) {
      const domain = parts.slice(i).join('.');
      if (DOMAIN_CATEGORIES[domain]) return DOMAIN_CATEGORIES[domain];
    }

    // Check by keywords
    for (const rule of KEYWORD_CATEGORIES) {
      for (const kw of rule.keywords) {
        if (fullText.includes(kw)) return rule.cat;
      }
    }

    // TLD fallback
    const tld = parts[parts.length - 1];
    if (tld === 'io' || tld === 'dev' || tld === 'app') return 'Frontend';
  } catch {}
  return 'Otro';
}

export async function POST({ request }) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') return json({ error: 'URL requerida' }, 400);

    const urlStr = url.trim();
    new URL(urlStr);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(urlStr, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ToolKitBot/1.0)' },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    const html = await response.text();

    // Extract title
    let title = '';
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();

    // Extract H1 as fallback for name
    if (!title) {
      const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
      if (h1Match) title = h1Match[1].trim();
    }

    // Slug-based name fallback (from URL path)
    if (!title) {
      try {
        const u = new URL(urlStr);
        const slug = u.pathname.replace(/\/$/, '').split('/').pop() || u.hostname.replace(/^www\./, '').split('.')[0];
        title = slug.replace(/[_-]/g, ' ').replace(/\.\w+$/, '');
        title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } catch {}
    }

    // Extract meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    const desc = descMatch ? descMatch[1].trim() : '';

    // Extract meta keywords for tags
    const kwMatch = html.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["']/i);
    const metaKeywords = kwMatch ? kwMatch[1].split(',').map(k => k.trim().toLowerCase()).filter(Boolean) : [];

    // Extract favicon
    let favicon = '';
    const iconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]+href=["']([^"']*)["']/i);
    if (iconMatch) {
      favicon = iconMatch[1];
      if (favicon.startsWith('//')) favicon = `https:${favicon}`;
      else if (favicon.startsWith('/')) {
        const u = new URL(urlStr);
        favicon = `${u.protocol}//${u.hostname}${favicon}`;
      }
    }
    if (!favicon) {
      const u = new URL(urlStr);
      favicon = `${u.protocol}//${u.hostname}/favicon.ico`;
    }

    const category = guessCategory(urlStr, title, desc);

    // Extract tags from title + desc + meta keywords + H1 + URL
    const tagCandidates = new Set();
    // Add meta keywords directly
    metaKeywords.forEach(k => { if (k.length < 30) tagCandidates.add(k); });
    // Extract H1 text for additional context
    const h1Text = (html.match(/<h1[^>]*>([^<]*)<\/h1>/i) || [])[1] || '';
    const fullText = `${title} ${desc} ${h1Text}`.toLowerCase();
    for (const rule of KEYWORD_CATEGORIES) {
      for (const kw of rule.keywords) {
        if (fullText.includes(kw)) tagCandidates.add(kw);
      }
    }
    const tags = [...tagCandidates].slice(0, 5);

    return json({
      name: title || '',
      description: desc || '',
      favicon,
      category,
      tags,
      detected: true,
    });
  } catch (e) {
    if (e.code === 'ERR_INVALID_URL') return json({ error: 'URL inválida' }, 400);
    return json({ error: 'No se pudo detectar la página: ' + (e.message || 'error') }, 502);
  }
}
