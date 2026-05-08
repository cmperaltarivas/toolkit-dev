import { useState, useEffect, useCallback, useRef } from 'react';
import type { Tool, TabId, ApiListResponse, Stats } from '../types';
import { store } from '../lib/store';
import { CATEGORIES, IMPORTANCIAS } from '../lib/hints';
import ToolCard from './ToolCard';
import Filters from './Filters';
import Dashboard from './Dashboard';
import ToolModal from './ToolModal';
import DetectModal from './DetectModal';
import ShortcutsModal from './ShortcutsModal';
import Toast from './Toast';

export default function App() {

  const [tools, setTools] = useState<Tool[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>('tools');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (typeof window !== 'undefined' ? localStorage.getItem('toolkit_theme') as 'dark' | 'light' : null) || 'dark');
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [detectData, setDetectData] = useState<any>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [impFilter, setImpFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [favFilter, setFavFilter] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [importResult, setImportResult] = useState<string | null>(null);
  const PAGE_LIMIT = 50;
  const toastTimer = useRef<any>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2500);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setModalOpen(false); setDeleteTarget(null); setShortcutsOpen(false); setDetectData(null); }
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault(); setShortcutsOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); setEditTool(null); setModalOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); document.getElementById('searchInput')?.focus(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const buildParams = useCallback(() => {
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (catFilter) params.category = catFilter;
    if (impFilter) params.importance = impFilter;
    if (tagFilter) params.tag = tagFilter;
    if (favFilter) params.favorite = 'true';
    params.sort = sortField;
    params.order = sortOrder;
    return params;
  }, [search, catFilter, impFilter, tagFilter, favFilter, sortField, sortOrder]);

  const loadTools = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams();
      const hasFilters = !!(params.search || params.category || params.importance || params.tag || params.favorite);
      params.limit = hasFilters ? PAGE_LIMIT : 9999;
      params.offset = 0;
      const data: ApiListResponse = await store.list(params);
      setTools(data.tools);
      setTotalCount(data.total);
    } catch (e: any) {
      showToast(e.message || 'Error al cargar', 'error');
    } finally {
      setLoading(false);
    }
  }, [buildParams, showToast]);

  useEffect(() => { loadTools(); }, [loadTools]);

  const handleVisit = (id: string, url: string) => {
    store.visit(id);
    setTools(prev => prev.map(t => t.id === id ? { ...t, visits: (t.visits || 0) + 1 } : t));
    window.open(url, '_blank', 'noopener');
  };

  const handleSave = async (data: any) => {
    try {
      if (editTool) await store.update(editTool.id, data);
      else await store.create(data);
      showToast(editTool ? 'Herramienta actualizada' : 'Herramienta guardada');
      setModalOpen(false);
      setEditTool(null);
      loadTools();
    } catch (e: any) { showToast(e.message || 'Error al guardar', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await store.remove(deleteTarget);
      setDeleteTarget(null);
      loadTools();
      showToast('Herramienta eliminada');
    } catch (e: any) { showToast(e.message || 'Error', 'error'); }
  };

  const handleExport = async () => {
    try {
      const params = buildParams();
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, String(v)); });
      qs.set('limit', '10000');
      const res = await fetch(`/api/tools?${qs}`);
      const data = await res.json();
      const allTools = data.tools || [];
      if (!allTools.length) { showToast('No hay herramientas para exportar', 'error'); return; }
      const blob = new Blob([JSON.stringify(allTools, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'toolkit-export.json';
      a.click();
      URL.revokeObjectURL(a.href);
      showToast(`${allTools.length} herramientas exportadas`);
    } catch { showToast('Error al exportar', 'error'); }
  };

  const handleDetectUrl = async (url: string) => {
    try {
      const result = await store.detect(url);
      if (result.detected && (result.name || result.description || result.category)) {
        setDetectData(result);
      }
    } catch {
      // Silent fail - user fills manually
    }
  };

  const handleImportFile = async (file: File) => {
    setImportResult('Importando...');
    try {
      const r = await store.importFile(file);
      setImportResult(`<div class="import-result" style="background:var(--primary-dim);border:1px solid rgba(232,160,32,0.3)">✅ ${r.message}</div>`);
      loadTools();
    } catch (e: any) {
      setImportResult(`<div class="import-result" style="background:var(--danger-dim);border:1px solid rgba(255,71,87,0.3)">❌ Error: ${e.message}</div>`);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="header-sub">toolkit v3</span>
          <h1>Organizador de<br />Herramientas Dev</h1>
        </div>
        <div className="header-right">
          <button onClick={() => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); localStorage.setItem('toolkit_theme', next); }} className="theme-toggle" title="Cambiar tema">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button onClick={handleExport} className="btn btn-sm btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exportar
          </button>
          <button onClick={() => { setEditTool(null); setModalOpen(true); }} className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Nueva
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {(['tools', 'dashboard', 'import'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'dashboard') loadTools(); }} className={`nav-tab ${tab === t ? 'active' : ''}`}>
            {t === 'tools' ? '📦 Herramientas' : t === 'dashboard' ? '📊 Dashboard' : '📥 Importar'}
          </button>
        ))}
      </nav>

      {tab === 'tools' && (
        <div className="section active">
          <Filters
            search={search} onSearchChange={v => { setSearch(v); setTimeout(loadTools, 200); }}
            catFilter={catFilter} onCatChange={v => { setCatFilter(v); setFavFilter(false); loadTools(); }}
            impFilter={impFilter} onImpChange={v => { setImpFilter(v); loadTools(); }}
            tagFilter={tagFilter} onTagChange={v => { setTagFilter(v); setTimeout(loadTools, 100); }}
            favFilter={favFilter} onFavChange={v => { setFavFilter(v); loadTools(); }}
            sortField={sortField} sortOrder={sortOrder}
            onSortChange={(f, o) => { setSortField(f); setSortOrder(o); }}
            onClear={() => { setSearch(''); setCatFilter(''); setImpFilter(''); setTagFilter(''); setFavFilter(false); setSortField('created_at'); setSortOrder('desc'); setTimeout(loadTools, 50); }}
          />
          <div className="grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-head"><div className="skeleton-icon" /><div className="skeleton-head-body"><div className="skeleton-line skeleton-line-sm" /><div className="skeleton-line skeleton-line-xs" /></div></div>
                  <div className="skeleton-line" /><div className="skeleton-line skeleton-line-sm" />
                </div>
              ))
            ) : tools.length === 0 ? (
              <div className="grid-empty">
                <svg className="icon-big" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <strong>No hay herramientas</strong>
                <p>{search || catFilter || impFilter || tagFilter || favFilter ? 'Ninguna coincide con los filtros' : 'Agregá tu primera herramienta'}</p>
              </div>
            ) : tools.map((t, i) => (
              <ToolCard key={t.id} tool={t} index={i} onVisit={handleVisit} onToggleFav={(id) => { store.toggleFav(id); loadTools(); }} onEdit={(tool) => { setEditTool(tool); setModalOpen(true); }} onDelete={(id) => setDeleteTarget(id)} />
            ))}
          </div>
        </div>
      )}

      {tab === 'dashboard' && <Dashboard showToast={showToast} onVisit={handleVisit} />}

      {tab === 'import' && (
        <div className="section active">
          <div className="import-zone" onClick={() => document.getElementById('importFile')?.click()}
            onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('dragover'); }}
            onDragLeave={e => { (e.currentTarget as HTMLElement).classList.remove('dragover'); }}
            onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.remove('dragover'); const f = e.dataTransfer.files[0]; if (f) handleImportFile(f); }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            <p><strong>Subí tu archivo bookmarks.html</strong><br />Exportado de Chrome, Firefox, Edge</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>O un archivo JSON de backup</p>
            <input type="file" id="importFile" accept=".html,.json" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImportFile(f); }} />
          </div>
          {importResult && <div dangerouslySetInnerHTML={{ __html: importResult }} />}
        </div>
      )}

      {modalOpen && <ToolModal tool={editTool} initialData={null} onSave={handleSave} onClose={() => { setModalOpen(false); setEditTool(null); }} />}
      {deleteTarget && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal confirm-modal">
            <div className="modal-header"><h2>Eliminar herramienta</h2><button className="modal-close" onClick={() => setDeleteTarget(null)}>&times;</button></div>
            <div className="confirm-body">
              <div className="confirm-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div>
              <p className="confirm-text">¿Estás seguro de eliminar esta herramienta?</p>
              <p className="confirm-sub">No se puede deshacer</p>
            </div>
            <div className="confirm-actions"><button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancelar</button><button className="btn btn-danger" onClick={handleDelete}>Eliminar</button></div>
          </div>
        </div>
      )}
      {detectData && <DetectModal data={{ ...detectData, url: detectData.url || '', desc: detectData.description || '' }} onAccept={() => { store.create({ name: detectData.name || 'Sin título', url: detectData.url || '', desc: detectData.description || '', category: detectData.category || 'Otro', importance: 'util', tags: detectData.tags || [], favicon: detectData.favicon || '' }); setDetectData(null); loadTools(); showToast(`"${detectData.name || 'Herramienta'}" agregada`); }} onEdit={() => { setEditTool(null); setModalOpen(true); setDetectData(null); }} onClose={() => setDetectData(null)} />}
      {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} />}
    </div>
  );
}
