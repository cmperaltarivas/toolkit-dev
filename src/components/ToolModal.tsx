import { useState, useEffect, useRef } from 'react';
import type { Tool } from '../types';
import { CATEGORIES, IMPORTANCIAS } from '../lib/hints';
import { store } from '../lib/store';

interface Props {
  tool: Tool | null;
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function ToolModal({ tool, initialData, onSave, onClose }: Props) {
  const isEdit = !!tool;
  const [url, setUrl] = useState(initialData?.url || tool?.url || '');
  const [name, setName] = useState(initialData?.name || tool?.name || '');
  const [desc, setDesc] = useState(initialData?.desc || tool?.desc || '');
  const [category, setCategory] = useState(initialData?.category || tool?.category || '');
  const [importance, setImportance] = useState(initialData?.importance || tool?.importance || 'util');
  const [tags, setTags] = useState<string[]>(initialData?.tags || (tool ? JSON.parse(tool.tags || '[]') : []));
  const [favicon, setFavicon] = useState(tool?.favicon || '');
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [showFull, setShowFull] = useState(isEdit);
  const [tagInput, setTagInput] = useState('');
  const urlRef = useRef<HTMLInputElement>(null);

  const addTag = (text: string) => {
    const t = text.toLowerCase().trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
  };

  useEffect(() => { urlRef.current?.focus(); }, []);

  const detectFromUrl = async (val: string) => {
    if (!val.trim() || isEdit) return;
    setDetecting(true);
    try {
      const result = await store.detect(val.trim());
      if (result.detected) {
        const u = val.trim();
        setName(result.name || '');
        setDesc(result.description || '');
        setCategory(result.category || '');
        setFavicon(result.favicon || '');
        if (result.tags?.length) setTags(result.tags.slice(0, 5));
        setDetected(true);
      }
    } catch {} finally {
      setDetecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const data = {
      name: name.trim() || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '').split('.')[0],
      url: url.trim(),
      desc: desc.trim(),
      category: category || 'Otro',
      importance,
      tags,
      favicon: favicon.trim(),
    };
    onSave(data);
  };

  const inputStyle = { fontSize: '0.72rem', height: '32px', padding: '0 0.6rem', fontFamily: "var(--font-mono)", background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2>{isEdit ? 'Editar herramienta' : 'Nueva herramienta'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="toolUrl" style={{ fontSize: '0.65rem' }}>URL</label>
            <input type="url" className="form-input" id="toolUrl" required placeholder="https://react.dev"
              value={url} onChange={e => { setUrl(e.target.value); setDetected(false); }}
              onBlur={() => { if (url.trim() && !detected && !isEdit) detectFromUrl(url); }}
              onPaste={() => setTimeout(() => { const input = document.getElementById('toolUrl') as HTMLInputElement; if (input && input.value.trim() && !isEdit) detectFromUrl(input.value); }, 200)}
              ref={urlRef} autoFocus
              style={{ ...inputStyle, fontSize: '0.85rem', height: '38px' }} />
          </div>

          {detecting && <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>Detectando información...</p>}

          {detected && !showFull && (
            <div style={{ marginBottom: '1rem', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                {favicon && <img src={favicon} alt="" style={{ width: '18px', height: '18px', borderRadius: '4px' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                <strong style={{ fontFamily: "var(--font-display)", fontSize: '0.9rem' }}>{name || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')}</strong>
                <span className="tag tag-cat">{category || 'Otro'}</span>
              </div>
              {desc && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem', lineHeight: 1.4 }}>{desc}</p>}
              {tags.length > 0 && <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap' }}>{tags.map(t => <span key={t} className="tag tag-tag">{t}</span>)}</div>}
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setShowFull(true)} style={{ marginTop: '0.4rem', fontSize: '0.65rem' }}>
                ✏️ Editar más
              </button>
            </div>
          )}

          {(showFull || isEdit) && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="toolName">Nombre</label>
                <input type="text" className="form-input" id="toolName" required placeholder="Ej: React"
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="toolDesc">Descripción</label>
                <textarea className="form-textarea" id="toolDesc" placeholder="¿Para qué sirve?"
                  value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="toolCat">Categoría</label>
                  <select className="form-select" id="toolCat" value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="toolImp">Importancia</label>
                  <select className="form-select" id="toolImp" value={importance} onChange={e => setImportance(e.target.value)}>
                    {IMPORTANCIAS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tags</label>
                <div className="form-tags" onClick={() => document.getElementById('tagInput')?.focus()}>
                  {tags.map(t => (
                    <span key={t} className="tag tag-tag">{t} <span className="tag-remove" onClick={() => setTags(prev => prev.filter(x => x !== t))}>&times;</span></span>
                  ))}
                  <input type="text" className="tag-input" id="tagInput" placeholder="Enter para agregar"
                    value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); setTagInput(''); } if (e.key === 'Backspace' && !tagInput) setTags(prev => prev.slice(0, -1)); }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="toolFavicon">Icono (opcional)</label>
                <input type="url" className="form-input" id="toolFavicon" placeholder="https://ejemplo.com/favicon.ico"
                  value={favicon} onChange={e => setFavicon(e.target.value)} />
              </div>
            </>
          )}

          <div className="form-actions" style={{ justifyContent: detected && !showFull ? 'space-between' : 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {detected && !showFull ? '✅ Guardar' : (isEdit ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
