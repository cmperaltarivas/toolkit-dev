const IMPORTANCIAS = [
  { id: 'critico', label: '⭐ Crítico', cls: 'tag-imp-critico' },
  { id: 'esencial', label: '🔥 Esencial', cls: 'tag-imp-esencial' },
  { id: 'util', label: '💡 Útil', cls: 'tag-imp-util' },
  { id: 'opcional', label: '🔹 Opcional', cls: 'tag-imp-opcional' },
];

const CATEGORIES_PREDEF = [
  'Frontend', 'Backend', 'DevOps', 'Base de Datos', 'Mobile', 'Testing',
  'Design/UI', 'Data Science', 'Productividad', 'Contenido/YouTube',
  'Blog/Artículos', 'Herramienta CLI', 'API/Service', 'Educación', 'Otro'
];

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function jsStr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, '\\n').replace(/\r/g, '');
}

function hostFromUrl(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function renderGrid(tools, total, hasMore) {
  const grid = document.getElementById('grid');
  const info = document.getElementById('filterInfo');
  info.textContent = `${tools.length} de ${total} herramient${total === 1 ? 'a' : 'as'}`;

  if (tools.length === 0) {
    grid.innerHTML = `
      <div class="grid-empty">
        <svg class="icon-big" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <strong>No hay herramientas</strong>
        <p>${document.getElementById('searchInput').value ? 'Ninguna coincide con los filtros' : 'Agregá tu primera herramienta con el botón + Nueva'}</p>
      </div>`;
    return;
  }

  grid.innerHTML = tools.map((t, i) => {
    const imp = IMPORTANCIAS.find(i => i.id === t.importance) || IMPORTANCIAS[3];
    const tags = safeParseTags(t.tags);
    const host = hostFromUrl(t.url);
    const hasCustomFavicon = t.favicon && t.favicon.trim();
    return `
      <div class="card" data-id="${esc(t.id)}" style="animation-delay:${(i%12)*0.06}s">
        <div class="card-head">
          <span class="card-favicon-wrap">
            ${hasCustomFavicon
              ? `<img class="card-favicon" src="${esc(t.favicon)}" alt="" loading="lazy" onerror="this.parentElement.classList.add('fallback');this.style.display='none'">`
              : `<img class="card-favicon" src="https://icons.duckduckgo.com/ip3/${esc(host)}.ico" alt="" loading="lazy" onerror="faviconFallback(this,'${esc(host)}')">`
            }
            <span class="favicon-letter" style="background:var(--primary-dim);color:var(--primary);display:none">${esc(host.charAt(0).toUpperCase())}</span>
          </span>
          <div class="card-head-body">
            <div class="card-head-row">
              <a href="${esc(t.url)}" target="_blank" rel="noopener" class="card-title" onclick="return visitTool('${jsStr(t.id)}','${esc(t.url)}')">${esc(t.name)}</a>
              <button class="btn-fav ${t.favorite ? 'on' : ''}" onclick="toggleFav('${jsStr(t.id)}')" title="${t.favorite ? 'Quitar favorito' : 'Marcar favorito'}">${t.favorite ? '★' : '☆'}</button>
            </div>
            <div class="card-host">${esc(host)}</div>
            <div class="card-badges">
              <span class="tag tag-cat">${esc(t.category)}</span>
              <span class="tag ${imp.cls}">${imp.label}</span>
            </div>
          </div>
        </div>
        <div class="card-desc">${esc(t.desc)}</div>
        ${tags.length ? `<div class="card-tags">${tags.map(tg => `<span class="tag tag-tag">${esc(tg)}</span>`).join('')}</div>` : ''}
        <div class="card-foot">
          <div class="card-meta"><span>🕐 ${formatDate(t.created_at)}</span><span>⏳ ${timeAgo(t.created_at)}</span>${t.visits > 0 ? `<span>👁 ${t.visits}</span>` : ''}</div>
          <div class="card-actions">
            <button class="btn-icon-sm" onclick="copyUrl('${jsStr(t.url)}')" title="Copiar URL">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn-icon-sm" onclick="editTool('${t.id}')" title="Editar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button class="btn-icon-sm btn-icon-danger" onclick="showConfirmDelete('${t.id}')" title="Eliminar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  if (hasMore) {
    grid.innerHTML += `
      <div class="load-more-wrap">
        <button class="btn btn-ghost btn-load-more" onclick="loadMore()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          Cargar más (${total - tools.length} restantes)
        </button>
      </div>`;
  }
}

function renderSkeletons(count = 6) {
  const grid = document.getElementById('grid');
  const info = document.getElementById('filterInfo');
  info.textContent = 'Cargando...';
  grid.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton-head">
        <div class="skeleton-icon"></div>
        <div class="skeleton-head-body">
          <div class="skeleton-line skeleton-line-sm"></div>
          <div class="skeleton-line skeleton-line-xs"></div>
          <div class="skeleton-badges">
            <div class="skeleton-badge"></div>
            <div class="skeleton-badge" style="width:40px"></div>
          </div>
        </div>
      </div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line skeleton-line-sm"></div>
    </div>
  `).join('');
}

function faviconFallback(img, host) {
  if (img.dataset.fb === 'google') {
    img.parentElement.classList.add('fallback');
    img.parentElement.querySelector('.favicon-letter').style.display = 'flex';
    img.style.display = 'none';
    return;
  }
  img.dataset.fb = 'google';
  img.src = `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
}

function safeParseTags(tags) {
  try { return Array.isArray(tags) ? tags : JSON.parse(tags || '[]'); } catch { return []; }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mes`;
}

function renderDashboard(stats) {
  const pctFav = stats.total > 0 ? Math.round((stats.favoritas / stats.total) * 100) : 0;
  document.getElementById('dashStats').innerHTML = `
    <div class="dash-card"><h3>Total</h3><div class="dash-number">${stats.total}</div><div class="dash-sub">herramientas registradas</div></div>
    <div class="dash-card"><h3>⭐ Favoritas</h3><div class="dash-number">${stats.favoritas}</div><div class="dash-sub">${pctFav}% del total</div></div>
    <div class="dash-card"><h3>📂 Categorías</h3><div class="dash-number">${stats.porCategoria.length}</div><div class="dash-sub">distintas categorías</div></div>
    <div class="dash-card"><h3>👁 Visitas</h3><div class="dash-number">${stats.totalVisits}</div><div class="dash-sub">en total acumuladas</div></div>`;

  const maxCat = Math.max(...stats.porCategoria.map(c => c.count), 1);
  document.getElementById('dashCat').innerHTML = stats.porCategoria.map(c =>
    `<li class="cat-row" data-cat="${esc(c.category)}" onclick="toggleCatExpand('${jsStr(c.category)}')">
      <span class="lbl cat-lbl">${esc(c.category)}</span>
      <div class="bar"><div class="bar-fill" style="width:${(c.count/maxCat)*100}%"></div></div>
      <span class="num">${c.count}</span>
    </li>`
  ).join('') || '<li style="color:var(--text-dim)">Sin datos</li>';
  document.getElementById('catExpanded').classList.remove('open');

  const impLabels = { critico: '⭐ Crítico', esencial: '🔥 Esencial', util: '💡 Útil', opcional: '🔹 Opcional' };
  const impKeys = { critico: 'critico', esencial: 'esencial', util: 'util', opcional: 'opcional' };
  const maxImp = Math.max(...stats.porImportancia.map(c => c.count), 1);
  document.getElementById('dashImp').innerHTML = stats.porImportancia.map(c =>
    `<li class="imp-row" data-imp="${esc(c.importance)}" onclick="toggleImpExpand('${jsStr(c.importance)}')">
      <span class="lbl imp-lbl">${impLabels[c.importance] || c.importance}</span>
      <div class="bar"><div class="bar-fill" style="width:${(c.count/maxImp)*100}%"></div></div>
      <span class="num">${c.count}</span>
    </li>`
  ).join('') || '<li style="color:var(--text-dim)">Sin datos</li>';

  const maxVis = Math.max(...stats.masVisitadas.map(t => t.visits), 1);
  document.getElementById('dashTop').innerHTML = stats.masVisitadas.map(t => `<li><a href="${esc(t.url)}" target="_blank" rel="noopener" class="lbl">${esc(t.name)}</a><div class="bar"><div class="bar-fill" style="width:${(t.visits/maxVis)*100}%"></div></div><span class="num">${t.visits}</span></li>`).join('') || '<li style="color:var(--text-dim)">Sin visitas aún</li>';

  document.getElementById('dashNunca').innerHTML = (stats.nuncaVisitadas && stats.nuncaVisitadas.length)
    ? stats.nuncaVisitadas.map(t => `<li><a href="${esc(t.url)}" target="_blank" rel="noopener" class="lbl" onclick="return visitTool('${jsStr(t.id)}','${esc(t.url)}')">${esc(t.name)}</a><span class="num" style="color:var(--text-dim)">${esc(t.category)}</span></li>`).join('')
    : '<li style="color:var(--text-dim);font-size:0.78rem">Todas tienen al menos 1 visita 🎉</li>';

  const impLabels2 = { critico: '⭐ Crítico', esencial: '🔥 Esencial' };
  document.getElementById('dashPrio').innerHTML = (stats.prioSinVisitar && stats.prioSinVisitar.length)
    ? stats.prioSinVisitar.map(t => {
        const ago = t.last_visited_at ? timeAgo(t.last_visited_at) : 'nunca';
        return `<li><a href="${esc(t.url)}" target="_blank" rel="noopener" class="lbl" onclick="return visitTool('${jsStr(t.id)}','${esc(t.url)}')">${esc(t.name)}</a><span class="num">${impLabels2[t.importance] || t.importance}</span><span class="num" style="font-size:0.6rem;color:var(--text-dim);font-weight:400">${ago}</span></li>`;
      }).join('')
    : '<li style="color:var(--text-dim);font-size:0.78rem">Todas las importantes fueron visitadas ✅</li>';

  const cloud = document.getElementById('tagCloud');
  const expandedEl = document.getElementById('tagCloudExpanded');
  if (stats.topTags && stats.topTags.length) {
    const maxTag = Math.max(...stats.topTags.map(t => t.count), 1);
    cloud.innerHTML = stats.topTags.map(t => {
      const size = 0.7 + (t.count / maxTag) * 0.8;
      return `<span class="cloud-tag" style="font-size:${size}rem" data-tag="${esc(t.tag)}" onclick="toggleTagExpand('${jsStr(t.tag)}')">#${esc(t.tag)}</span>`;
    }).join('');
  } else {
    cloud.innerHTML = '<span style="color:var(--text-dim);font-size:0.78rem">Sin tags aún</span>';
  }
  expandedEl.innerHTML = '';
}
