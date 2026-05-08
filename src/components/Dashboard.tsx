import { useState, useEffect, useCallback } from 'react';
import type { Stats } from '../types';
import { store } from '../lib/store';
import { IMPORTANCIAS } from '../lib/hints';

function esc(s: any) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function hostFromUrl(url: string) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } }
function timeAgo(dateStr: string) {
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

interface Props {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onVisit: (id: string, url: string) => void;
}

export default function Dashboard({ showToast, onVisit }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedImp, setExpandedImp] = useState<string | null>(null);
  const [tagTools, setTagTools] = useState<any[] | null>(null);
  const [catTools, setCatTools] = useState<any[] | null>(null);
  const [impTools, setImpTools] = useState<any[] | null>(null);

  const load = useCallback(async () => {
    try { setStats(await store.getStats()); } catch { showToast('Error al cargar estadísticas', 'error'); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleTagClick = async (tag: string) => {
    if (expandedTag === tag) { setExpandedTag(null); setTagTools(null); return; }
    setExpandedTag(tag);
    setTagTools(null);
    try {
      const data = await store.list({ tag, limit: 100, offset: 0 });
      setTagTools(data.tools || []);
    } catch { setTagTools([]); }
  };

  const handleCatClick = async (cat: string) => {
    if (expandedCat === cat) { setExpandedCat(null); return; }
    setExpandedCat(cat);
    setCatTools(null);
    try {
      const data = await store.list({ category: cat, limit: 100, offset: 0 });
      setCatTools(data.tools || []);
    } catch { setCatTools([]); }
  };

  const handleImpClick = async (imp: string) => {
    if (expandedImp === imp) { setExpandedImp(null); return; }
    setExpandedImp(imp);
    setImpTools(null);
    try {
      const data = await store.list({ importance: imp, limit: 100, offset: 0 });
      setImpTools(data.tools || []);
    } catch { setImpTools([]); }
  };

  if (!stats) return <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Cargando dashboard...</div>;

  const pctFav = stats.total > 0 ? Math.round((stats.favoritas / stats.total) * 100) : 0;
  const impLabels2: Record<string, string> = { critico: '⭐ Crítico', esencial: '🔥 Esencial' };
  const maxCat = Math.max(...stats.porCategoria.map(c => c.count), 1);
  const maxImp = Math.max(...stats.porImportancia.map(c => c.count), 1);
  const maxVis = Math.max(...stats.masVisitadas.map(t => t.visits), 1);
  const maxTag = Math.max(...(stats.topTags || []).map(t => t.count), 1);

  return (
    <div className="section active">
      <p className="dash-desc">Resumen general de tu colección: distribución por categoría, importancia, herramientas más visitadas y tags frecuentes.</p>

      <div className="dash-grid">
        <div className="dash-card"><h3>Total</h3><div className="dash-number">{stats.total}</div><div className="dash-sub">herramientas registradas</div></div>
        <div className="dash-card"><h3>⭐ Favoritas</h3><div className="dash-number">{stats.favoritas}</div><div className="dash-sub">{pctFav}% del total</div></div>
        <div className="dash-card"><h3>📂 Categorías</h3><div className="dash-number">{stats.porCategoria.length}</div><div className="dash-sub">distintas categorías</div></div>
        <div className="dash-card"><h3>👁 Visitas</h3><div className="dash-number">{stats.totalVisits}</div><div className="dash-sub">en total acumuladas</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
        <div className="dash-card">
          <h3>Por categoría</h3>
          <ul className="dash-list">
            {stats.porCategoria.map(c => (
              <li key={c.category}>
                <span className="cat-lbl" style={{ cursor: 'pointer' }} onClick={() => handleCatClick(c.category)}>
                  {esc(c.category)}
                </span>
                <div className="bar"><div className="bar-fill" style={{ width: `${(c.count / maxCat) * 100}%` }} /></div>
                <span className="num">{c.count}</span>
              </li>
            ))}
          </ul>
          {expandedCat && (
            <div className="tag-expanded open" style={{ marginTop: '0.5rem' }}>
              {(catTools || []).map((t: any) => {
                const host = hostFromUrl(t.url);
                return (
                  <a key={t.id} href={t.url} target="_blank" rel="noopener" className="tag-tool-pill"
                    onClick={(e) => { e.preventDefault(); onVisit(t.id, t.url); }}>
                    <img className="favicon" src={`https://icons.duckduckgo.com/ip3/${host}.ico`} alt="" loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    {t.name}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div className="dash-card">
          <h3>Por importancia</h3>
          <ul className="dash-list">
            {stats.porImportancia.map(c => {
              const imp = IMPORTANCIAS.find(i => i.id === c.importance);
              return (
                <li key={c.importance}>
                  <span className="imp-lbl" style={{ cursor: 'pointer' }} onClick={() => handleImpClick(c.importance)}>
                    {imp ? imp.label : c.importance}
                  </span>
                  <div className="bar"><div className="bar-fill" style={{ width: `${(c.count / maxImp) * 100}%` }} /></div>
                  <span className="num">{c.count}</span>
                </li>
              );
            })}
          </ul>
          {expandedImp && (
            <div className="tag-expanded open" style={{ marginTop: '0.5rem' }}>
              {(impTools || []).map((t: any) => {
                const host = hostFromUrl(t.url);
                return (
                  <a key={t.id} href={t.url} target="_blank" rel="noopener" className="tag-tool-pill"
                    onClick={(e) => { e.preventDefault(); onVisit(t.id, t.url); }}>
                    <img className="favicon" src={`https://icons.duckduckgo.com/ip3/${host}.ico`} alt="" loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    {t.name}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="dash-card" style={{ marginTop: '0.85rem' }}>
        <h3>Más visitadas</h3>
        <ul className="dash-list">
          {stats.masVisitadas.map(t => (
            <li key={t.id}>
              <a href={t.url} target="_blank" rel="noopener" className="lbl"
                onClick={(e) => { e.preventDefault(); onVisit(t.id, t.url); }}>{t.name}</a>
              <div className="bar"><div className="bar-fill" style={{ width: `${(t.visits / maxVis) * 100}%` }} /></div>
              <span className="num">{t.visits}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dash-card" style={{ marginTop: '0.85rem' }}>
        <h3>Tags más usados</h3>
        <div className="tag-cloud">
          {(stats.topTags || []).map(t => {
            const size = 0.7 + (t.count / maxTag) * 0.8;
            return (
              <span key={t.tag} className={`cloud-tag ${expandedTag === t.tag ? 'active' : ''}`}
                style={{ fontSize: `${size}rem` }}
                onClick={() => handleTagClick(t.tag)}>#{t.tag}</span>
            );
          })}
        </div>
        {expandedTag && tagTools && (
          <div className="tag-expanded open" style={{ marginTop: '0.75rem' }}>
            {tagTools.length === 0
              ? <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Sin herramientas</span>
              : tagTools.map((t: any) => {
                  const host = hostFromUrl(t.url);
                  return (
                    <a key={t.id} href={t.url} target="_blank" rel="noopener" className="tag-tool-pill"
                      onClick={(e) => { e.preventDefault(); onVisit(t.id, t.url); }}>
                      <img className="favicon" src={`https://icons.duckduckgo.com/ip3/${host}.ico`} alt="" loading="lazy"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      {t.name}
                    </a>
                  );
                })
            }
          </div>
        )}
      </div>

      <div className="dash-card" style={{ marginTop: '0.85rem' }}>
        <h3>🚫 Nunca visitadas</h3>
        <ul className="dash-list">
          {stats.nuncaVisitadas.length === 0
            ? <li style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Todas tienen al menos 1 visita 🎉</li>
            : stats.nuncaVisitadas.map(t => (
                <li key={t.id}>
                  <a href={t.url} target="_blank" rel="noopener" className="lbl"
                    onClick={(e) => { e.preventDefault(); onVisit(t.id, t.url); }}>{t.name}</a>
                  <span className="num" style={{ color: 'var(--text-dim)' }}>{t.category}</span>
                </li>
              ))
          }
        </ul>
      </div>

      <div className="dash-card" style={{ marginTop: '0.85rem' }}>
        <h3>⚠️ Críticas/Esenciales (7d sin visitar)</h3>
        <ul className="dash-list">
          {stats.prioSinVisitar.length === 0
            ? <li style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Todas las importantes fueron visitadas ✅</li>
            : stats.prioSinVisitar.map(t => (
                <li key={t.id}>
                  <a href={t.url} target="_blank" rel="noopener" className="lbl"
                    onClick={(e) => { e.preventDefault(); onVisit(t.id, t.url); }}>{t.name}</a>
                  <span className="num">{impLabels2[t.importance] || t.importance}</span>
                  <span className="num" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 400 }}>
                    {t.last_visited_at ? timeAgo(t.last_visited_at) : 'nunca'}
                  </span>
                </li>
              ))
          }
        </ul>
      </div>
    </div>
  );
}
