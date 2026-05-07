let tools = [];
let totalCount = 0;
let currentOffset = 0;
let renderTimeout = null;
let favFilterActive = false;
let deleteTargetId = null;
const PAGE_LIMIT = 50;

function scheduleRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(() => { currentOffset = 0; loadAndRender(); }, 200);
}

function buildParams() {
  const params = {};
  const search = document.getElementById('searchInput').value.trim();
  if (search) params.search = search;
  const cat = document.getElementById('catFilter').value;
  if (cat) params.category = cat;
  const imp = document.getElementById('impFilter').value;
  if (imp) params.importance = imp;
  const tag = document.getElementById('tagFilter').value.trim();
  if (tag) params.tag = tag;
  if (favFilterActive) params.favorite = 'true';
  const sortVal = document.getElementById('sortFilter').value;
  const idx = sortVal.lastIndexOf('.'); const sort = idx > 0 ? sortVal.slice(0, idx) : sortVal; const order = idx > 0 ? sortVal.slice(idx + 1) : 'desc';
  params.sort = sort;
  params.order = order;
  return params;
}

async function loadAndRender() {
  if (currentOffset === 0) renderSkeletons();
  try {
    const params = buildParams();
    const hasFilters = !!(params.search || params.category || params.importance || params.tag || params.favorite);
    params.limit = hasFilters ? PAGE_LIMIT : 9999;
    params.offset = currentOffset;
    const data = await store.list(params);
    if (currentOffset === 0) {
      tools = data.tools;
    } else {
      tools = tools.concat(data.tools);
    }
    totalCount = data.total;
    renderGrid(tools, totalCount, currentOffset + PAGE_LIMIT < totalCount);
    updateActiveFilters();
  } catch (e) {
    toast(e.message || 'Error al cargar herramientas', 'error');
  }
}

function loadMore() {
  currentOffset += PAGE_LIMIT;
  loadAndRender();
}

function updateActiveFilters() {
  const chipsEl = document.getElementById('filterChips');
  const chips = [];
  const search = document.getElementById('searchInput').value.trim();
  const cat = document.getElementById('catFilter').value;
  const imp = document.getElementById('impFilter').value;
  const tag = document.getElementById('tagFilter').value.trim();

  if (search) chips.push('<span class="af-chip">\uD83D\uDD0D "' + esc(search) + '" <span class="af-x" onclick="document.getElementById(\'searchInput\').value=\'\';scheduleRender()">\u00D7</span></span>');
  if (cat) chips.push('<span class="af-chip af-chip-cat">\uD83D\uDCC2 ' + esc(cat) + ' <span class="af-x" onclick="document.getElementById(\'catFilter\').value=\'\';scheduleRender()">\u00D7</span></span>');
  if (imp) {
    const labels = { critico: '\u2B50 Cr\u00EDtico', esencial: '\uD83D\uDD25 Esencial', util: '\uD83D\uDCA1 \u00DAlt', opcional: '\uD83D\uDD39 Opcional' };
    chips.push('<span class="af-chip af-chip-imp">' + labels[imp] + ' <span class="af-x" onclick="document.getElementById(\'impFilter\').value=\'\';scheduleRender()">\u00D7</span></span>');
  }
  if (tag) chips.push('<span class="af-chip af-chip-cat"># ' + esc(tag) + ' <span class="af-x" onclick="document.getElementById(\'tagFilter\').value=\'\';scheduleRender()">\u00D7</span></span>');
  if (favFilterActive) chips.push('<span class="af-chip af-chip-fav">\u2B50 Favoritas <span class="af-x" onclick="document.getElementById(\'favFilterBtn\').click()">\u00D7</span></span>');

  const sortLabels = {
    'created_at.desc': 'M\u00E1s recientes', 'created_at.asc': 'M\u00E1s antiguas',
    'name.asc': 'A-Z', 'name.desc': 'Z-A', 'importance.desc': 'Importancia', 'visits.desc': 'M\u00E1s visitadas'
  };
  chips.push('<span class="af-chip af-chip-sort">\u2195 ' + sortLabels[document.getElementById('sortFilter').value] + '</span>');

  chipsEl.innerHTML = chips.join(' ');
}

function handleFilterChange() {
  favFilterActive = false;
  document.getElementById('favFilterBtn').classList.remove('btn-danger');
  currentOffset = 0;
  updateActiveFilters();
  loadAndRender();
}

function handleSortChange() { currentOffset = 0; updateActiveFilters(); loadAndRender(); }

function toggleFavFilter() {
  favFilterActive = !favFilterActive;
  document.getElementById('favFilterBtn').classList.toggle('btn-danger', favFilterActive);
  currentOffset = 0;
  updateActiveFilters();
  loadAndRender();
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('catFilter').value = '';
  document.getElementById('impFilter').value = '';
  document.getElementById('tagFilter').value = '';
  document.getElementById('sortFilter').value = 'created_at.desc';
  favFilterActive = false;
  document.getElementById('favFilterBtn').classList.remove('btn-danger');
  currentOffset = 0;
  updateActiveFilters();
  loadAndRender();
}

function getFocusable(el) {
  return el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
}

function trapFocus(overlay) {
  const focusable = getFocusable(overlay);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  overlay.addEventListener('keydown', handler);
  return () => overlay.removeEventListener('keydown', handler);
}

let modalFocusCleanup = null;
let confirmFocusCleanup = null;
let modalOpen = false;

function openModal(tool) {
  if (!modalOpen) {
    modalOpen = true;
    window.addEventListener('beforeunload', warnBeforeUnload);
  }
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('editId').value = '';
  document.getElementById('toolForm').reset();
  document.getElementById('tagsContainer').querySelectorAll(':scope > .tag-tag').forEach(el => el.remove());

  if (tool) {
    document.getElementById('modalTitle').textContent = 'Editar herramienta';
    document.getElementById('submitBtn').textContent = 'Actualizar';
    document.getElementById('editId').value = tool.id;
    document.getElementById('toolName').value = tool.name;
    document.getElementById('toolUrl').value = tool.url;
    document.getElementById('toolDesc').value = tool.desc;
    document.getElementById('toolCat').value = tool.category;
    document.getElementById('toolImp').value = tool.importance;
    document.getElementById('toolFavicon').value = tool.favicon || '';
    previewFavicon(tool.favicon || '');
    safeParseTags(tool.tags).forEach(t => addTagChip(t));
  } else {
    document.getElementById('modalTitle').textContent = 'Nueva herramienta';
    document.getElementById('submitBtn').textContent = 'Guardar';
    document.getElementById('faviconPreview').innerHTML = '';
  }
  overlay.classList.add('open');
  document.getElementById('toolName').focus();
  if (modalFocusCleanup) modalFocusCleanup();
  modalFocusCleanup = trapFocus(overlay);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  if (modalFocusCleanup) { modalFocusCleanup(); modalFocusCleanup = null; }
  if (modalOpen) {
    modalOpen = false;
    window.removeEventListener('beforeunload', warnBeforeUnload);
  }
}

function warnBeforeUnload(e) {
  e.preventDefault();
  e.returnValue = '';
}

function openShortcutsHelp() {
  document.getElementById('shortcutsOverlay').classList.add('open');
  if (confirmFocusCleanup) confirmFocusCleanup();
  confirmFocusCleanup = trapFocus(document.getElementById('shortcutsOverlay'));
}

function closeShortcutsHelp() {
  document.getElementById('shortcutsOverlay').classList.remove('open');
  if (confirmFocusCleanup) { confirmFocusCleanup(); confirmFocusCleanup = null; }
}

async function saveTool(e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const name = document.getElementById('toolName').value.trim();
  const url = document.getElementById('toolUrl').value.trim();
  const desc = document.getElementById('toolDesc').value.trim();
  const category = document.getElementById('toolCat').value;
  const importance = document.getElementById('toolImp').value;
  const tags = getTags();
  const favicon = document.getElementById('toolFavicon').value.trim();
  if (!name || !url || !desc || !category || !importance) return;
  try {
    if (id) {
      await store.update(id, { name, url, desc, category, importance, tags, favicon });
      toast('Herramienta actualizada');
    } else {
      await store.create({ name, url, desc, category, importance, tags, favicon });
      toast('Herramienta guardada');
    }
    closeModal();
    currentOffset = 0;
    loadAndRender();
  } catch (e) {
    toast(e.message || 'Error al guardar', 'error');
  }
}

function editTool(id) {
  store.get(id).then(t => openModal(t)).catch(e => toast(e.message, 'error'));
}

function showConfirmDelete(id) {
  deleteTargetId = id;
  document.getElementById('confirmOverlay').classList.add('open');
  if (confirmFocusCleanup) confirmFocusCleanup();
  confirmFocusCleanup = trapFocus(document.getElementById('confirmOverlay'));
}

function closeConfirm() {
  deleteTargetId = null;
  document.getElementById('confirmOverlay').classList.remove('open');
  if (confirmFocusCleanup) { confirmFocusCleanup(); confirmFocusCleanup = null; }
}

let lastDeleted = null;

async function confirmDelete() {
  if (!deleteTargetId) return;
  try {
    const toolData = await store.get(deleteTargetId);
    await store.remove(deleteTargetId);
    lastDeleted = { id: deleteTargetId, data: toolData };
    closeConfirm();
    currentOffset = 0;
    loadAndRender();
    toastUndo('Herramienta eliminada', () => undoDelete());
  } catch (e) {
    closeConfirm();
    toast(e.message, 'error');
  }
}

async function undoDelete() {
  if (!lastDeleted) return;
  try {
    await store.create({ ...lastDeleted.data, id: lastDeleted.id });
    lastDeleted = null;
    currentOffset = 0;
    loadAndRender();
    toast('Eliminación deshecha');
  } catch {
    toast('Error al deshacer', 'error');
  }
}

let expandedTag = null;
let expandedCat = null;

async function toggleCatExpand(category) {
  const list = document.getElementById('dashCat');
  const rows = document.querySelectorAll('.cat-row');
  const existing = list.querySelector('.cat-expanded-row');

  if (existing) existing.remove();
  rows.forEach(r => r.classList.remove('active'));

  if (expandedCat === category) {
    expandedCat = null;
    return;
  }

  expandedCat = category;
  const row = list.querySelector(`.cat-row[data-cat="${esc(category)}"]`);
  if (!row) return;
  row.classList.add('active');

  const expandedRow = document.createElement('li');
  expandedRow.className = 'cat-expanded-row';
  expandedRow.innerHTML = '<span style="font-size:0.72rem;color:var(--text-dim)">Cargando...</span>';
  row.after(expandedRow);

  try {
    const data = await store.list({ category, limit: 100, offset: 0 });
    const tools = data.tools || [];
    if (!tools.length) {
      expandedRow.innerHTML = '<span style="font-size:0.72rem;color:var(--text-dim);padding:0.25rem 0">Sin herramientas</span>';
      return;
    }
    expandedRow.innerHTML = '<div class="cat-pills">' + tools.map(t => {
      const host = hostFromUrl(t.url);
      return `<a href="${esc(t.url)}" target="_blank" rel="noopener" class="tag-tool-pill" onclick="return visitTool('${jsStr(t.id)}','${esc(t.url)}')">
        <img class="favicon" src="https://icons.duckduckgo.com/ip3/${esc(host)}.ico" alt="" loading="lazy" onerror="faviconFallback(this,'${esc(host)}')">${esc(t.name)}</a>`;
    }).join('') + '</div>';
  } catch {
    expandedRow.innerHTML = '<span style="font-size:0.72rem;color:var(--text-dim);padding:0.25rem 0">Error al cargar</span>';
  }
}

async function toggleTagExpand(tag) {
  const expandedEl = document.getElementById('tagCloudExpanded');
  const tags = document.querySelectorAll('.cloud-tag');

  if (expandedTag === tag) {
    expandedTag = null;
    expandedEl.classList.remove('open');
    tags.forEach(t => t.classList.remove('active'));
    return;
  }

  expandedTag = tag;
  tags.forEach(t => t.classList.toggle('active', t.dataset.tag === tag));
  expandedEl.classList.add('open');
  expandedEl.innerHTML = '<span style="font-size:0.72rem;color:var(--text-dim)">Cargando...</span>';

  try {
    const data = await store.list({ tag, limit: 100, offset: 0 });
    const tools = data.tools || [];
    if (!tools.length) {
      expandedEl.innerHTML = '<span style="font-size:0.72rem;color:var(--text-dim)">Sin herramientas</span>';
      return;
    }
    expandedEl.innerHTML = tools.map(t => {
      const host = hostFromUrl(t.url);
      return `<a href="${esc(t.url)}" target="_blank" rel="noopener" class="tag-tool-pill" onclick="return visitTool('${jsStr(t.id)}','${esc(t.url)}')">
        <img class="favicon" src="https://icons.duckduckgo.com/ip3/${esc(host)}.ico" alt="" loading="lazy" onerror="faviconFallback(this,'${esc(host)}')">${esc(t.name)}</a>`;
    }).join('');
  } catch {
    expandedEl.innerHTML = '<span style="font-size:0.72rem;color:var(--text-dim)">Error al cargar</span>';
  }
}

function visitTool(id, url) {
  store.visit(id);
  const t = tools.find(x => x.id === id);
  if (t) { t.visits = (t.visits || 0) + 1; }
  setTimeout(() => loadAndRender(), 100);
  return true;
}

async function toggleFav(id) {
  try {
    const r = await store.toggleFav(id);
    toast(r.favorite ? '⭐ Marcada como favorita' : 'Favorito quitado');
    loadAndRender();
  } catch (e) { toast(e.message, 'error'); }
}

function previewUrl(val) {
  const preview = document.getElementById('urlPreview');
  try {
    const url = new URL(val.trim());
    const host = url.hostname.replace(/^www\./, '');
    preview.innerHTML = `<img class="url-favicon" src="https://icons.duckduckgo.com/ip3/${host}.ico" alt="" onerror="this.style.display='none'"> <span class="url-host">${esc(host)}</span>`;
  } catch {
    preview.innerHTML = '';
  }
}

function detectFavicon() {
  const urlInput = document.getElementById('toolUrl');
  const faviconInput = document.getElementById('toolFavicon');
  try {
    const url = new URL(urlInput.value.trim());
    let guess = `${url.protocol}//${url.hostname}/favicon.ico`;
    if (url.port) guess = `${url.protocol}//${url.hostname}:${url.port}/favicon.ico`;
    faviconInput.value = guess;
    previewFavicon(guess);
  } catch {
    toast('Primero ingresá una URL válida', 'error');
  }
}

function autoDetectFavicon() {
  const faviconInput = document.getElementById('toolFavicon');
  if (!faviconInput.value.trim()) detectFavicon();
}

function previewFavicon(val) {
  const preview = document.getElementById('faviconPreview');
  if (val && val.trim()) {
    preview.innerHTML = `<img class="url-favicon" src="${esc(val.trim())}" alt="" onerror="this.style.display='none'">`;
  } else {
    preview.innerHTML = '';
  }
}

function updateTagSuggestions(val) {
  const datalist = document.getElementById('tagSuggestions');
  const allTags = new Set();
  if (typeof tools !== 'undefined') {
    tools.forEach(t => {
      safeParseTags(t.tags).forEach(tag => allTags.add(tag));
    });
  }
  const filtered = [...allTags].filter(t => t.includes(val.toLowerCase()));
  datalist.innerHTML = filtered.map(t => `<option value="${esc(t)}">`).join('');
}

function handleTagKeyPress(e) {
  if (e.key === 'Enter') e.preventDefault();
}

function handleTagKey(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const input = document.getElementById('tagInput');
    if (!input) return;
    const val = input.value.trim().toLowerCase();
    if (val) {
      const ok = addTagChip(val);
      if (!ok) toast('Tag duplicado o inválido', 'error');
    }
    input.value = '';
  }
  if (e.key === 'Backspace' && !e.target.value) {
    const chips = document.querySelectorAll('#tagsContainer > .tag-tag');
    if (chips.length) chips[chips.length - 1].remove();
  }
}

function addTagChip(text) {
  const container = document.getElementById('tagsContainer');
  if (!container || !text) return false;
  const existing = container.querySelectorAll(':scope > .tag-tag');
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].getAttribute('data-tag') === text) return false;
  }
  const input = container.querySelector('#tagInput');
  input.insertAdjacentHTML('beforebegin', `<span class="tag tag-tag" data-tag="${esc(text)}">${esc(text)} <span class="tag-remove" onclick="this.parentElement.remove()">\u00D7</span></span>`);
  return true;
}

function getTags() {
  const tags = [];
  document.querySelectorAll('#tagsContainer > .tag-tag').forEach(el => {
    const t = el.getAttribute('data-tag');
    if (t) tags.push(t);
  });
  return tags;
}

function switchTab(tab) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === `section-${tab}`));
  if (tab === 'dashboard') loadDashboard();
}

async function loadDashboard() {
  try {
    renderDashboard(await store.getStats());
  } catch (e) { toast(e.message, 'error'); }
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const resultEl = document.getElementById('importResult');
  resultEl.innerHTML = '<p style="color:var(--text-muted)">Importando...</p>';
  store.importFile(file).then(r => {
    resultEl.innerHTML = `<div class="import-result" style="background:var(--primary-dim);border:1px solid rgba(232,160,32,0.3)">✅ ${r.message || `${r.imported} herramientas importadas`}</div>`;
    currentOffset = 0;
    loadAndRender();
    event.target.value = '';
  }).catch(e => {
    resultEl.innerHTML = `<div class="import-result" style="background:var(--danger-dim);border:1px solid rgba(255,71,87,0.3)">❌ Error: ${e.message}</div>`;
    event.target.value = '';
  });
}

function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    toast('URL copiada');
  }).catch(() => {
    toast('Error al copiar', 'error');
  });
}

async function exportJSON() {
  try {
    const params = buildParams();
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v); });
    qs.set('limit', '10000');
    qs.set('offset', '0');
    const res = await fetch(`/api/tools?${qs}`);
    const data = await res.json();
    const allTools = data.tools || [];
    if (!allTools.length) { toast('No hay herramientas para exportar', 'error'); return; }
    const blob = new Blob([JSON.stringify(allTools, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'toolkit-export.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`${allTools.length} herramientas exportadas`);
  } catch {
    toast('Error al exportar', 'error');
  }
}

function toast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    el.style.transition = '0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

function toastUndo(msg, onUndo) {
  const c = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast toast-success toast-undo';
  el.innerHTML = `<span>${esc(msg)}</span><button class="toast-btn" onclick="this.closest('.toast')._undo();this.closest('.toast').remove()">Deshacer</button>`;
  el._undo = onUndo;
  c.appendChild(el);
  const timer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    el.style.transition = '0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, 5000);
  el._timer = timer;
  const origRemove = el.remove.bind(el);
  el.remove = () => { clearTimeout(timer); origRemove(); };
}

function init() {
  const catSel = document.getElementById('toolCat');
  const catFil = document.getElementById('catFilter');
  CATEGORIES_PREDEF.forEach(c => {
    catSel.innerHTML += `<option value="${c}">${c}</option>`;
    catFil.innerHTML += `<option value="${c}">${c}</option>`;
  });
  IMPORTANCIAS.forEach(i => {
    document.getElementById('toolImp').innerHTML += `<option value="${i.id}">${i.label}</option>`;
    document.getElementById('impFilter').innerHTML += `<option value="${i.id}">${i.label}</option>`;
  });
  loadAndRender();
}

document.getElementById('modalOverlay').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.getElementById('confirmOverlay').addEventListener('click', function(e) { if (e.target === this) closeConfirm(); });
document.getElementById('shortcutsOverlay').addEventListener('click', function(e) { if (e.target === this) closeShortcutsHelp(); });

const importZone = document.getElementById('importZone');
importZone.addEventListener('dragover', e => { e.preventDefault(); importZone.classList.add('dragover'); });
importZone.addEventListener('dragleave', () => importZone.classList.remove('dragover'));
importZone.addEventListener('drop', e => {
  e.preventDefault();
  importZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) { document.getElementById('importFile').files = e.dataTransfer.files; handleImport({ target: { files: [file] } }); }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeConfirm(); closeShortcutsHelp(); }
  if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const tag = e.target.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') { e.preventDefault(); openShortcutsHelp(); }
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); openModal(); }
  if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); document.getElementById('searchInput').focus(); }
});

init();
