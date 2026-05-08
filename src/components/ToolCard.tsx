import { useState } from 'react';
import type { Tool } from '../types';
import { IMPORTANCIAS } from '../lib/hints';

function esc(s: any) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function hostFromUrl(url: string) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } }
function safeParseTags(tags: any): string[] { try { return Array.isArray(tags) ? tags : JSON.parse(tags || '[]'); } catch { return []; } }
function formatDate(dateStr: string) { try { return new Date(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return dateStr; } }
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
  tool: Tool;
  index: number;
  onVisit: (id: string, url: string) => void;
  onToggleFav: (id: string) => void;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
}

export default function ToolCard({ tool, index, onVisit, onToggleFav, onEdit, onDelete }: Props) {
  const imp = IMPORTANCIAS.find(i => i.id === tool.importance) || IMPORTANCIAS[3];
  const tags = safeParseTags(tool.tags);
  const host = hostFromUrl(tool.url);
  const [faviconSrc, setFaviconSrc] = useState(
    tool.favicon && tool.favicon.trim()
      ? tool.favicon
      : `https://icons.duckduckgo.com/ip3/${host}.ico`
  );
  const [faviconFailed, setFaviconFailed] = useState(false);

  return (
    <div className="card" style={{ animationDelay: `${(index % 12) * 0.06}s` }}>
      <div className="card-head">
        <span className={`card-favicon-wrap ${faviconFailed ? 'fallback' : ''}`}>
          {!faviconFailed && (
            <img className="card-favicon" src={faviconSrc} alt="" loading="lazy"
              onError={() => {
                if (faviconSrc.includes('duckduckgo')) {
                  setFaviconSrc(`https://www.google.com/s2/favicons?domain=${host}&sz=32`);
                } else {
                  setFaviconFailed(true);
                }
              }}
            />
          )}
          <span className="favicon-letter" style={{ background: 'var(--primary-dim)', color: 'var(--primary)' }}>
            {host.charAt(0).toUpperCase()}
          </span>
        </span>
        <div className="card-head-body">
          <div className="card-head-row">
            <a href={tool.url} target="_blank" rel="noopener" className="card-title"
              onClick={(e) => { e.preventDefault(); onVisit(tool.id, tool.url); }}>
              {tool.name}
            </a>
            <button className={`btn-fav ${tool.favorite ? 'on' : ''}`}
              onClick={() => onToggleFav(tool.id)}
              title={tool.favorite ? 'Quitar favorito' : 'Marcar favorito'}>
              {tool.favorite ? '★' : '☆'}
            </button>
          </div>
          <div className="card-host">{host}</div>
          <div className="card-badges">
            <span className="tag tag-cat">{tool.category}</span>
            <span className={`tag ${imp.cls}`}>{imp.label}</span>
          </div>
        </div>
      </div>
      <div className="card-desc">{tool.desc}</div>
      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map(tg => <span key={tg} className="tag tag-tag">{tg}</span>)}
        </div>
      )}
      <div className="card-foot">
        <div className="card-meta">
          <span>🕐 {formatDate(tool.created_at)}</span>
          <span>⏳ {timeAgo(tool.created_at)}</span>
          {tool.visits > 0 && <span>👁 {tool.visits}</span>}
        </div>
        <div className="card-actions">
          <button className="btn-icon-sm" onClick={() => navigator.clipboard.writeText(tool.url).then(() => {})} title="Copiar URL">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button className="btn-icon-sm" onClick={() => onEdit(tool)} title="Editar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button className="btn-icon-sm btn-icon-danger" onClick={() => onDelete(tool.id)} title="Eliminar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
