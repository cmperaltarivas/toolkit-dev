import type { DetectedTool } from '../types';

interface Props {
  data: DetectedTool;
  onAccept: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export default function DetectModal({ data, onAccept, onEdit, onClose }: Props) {
  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal detect-modal">
        <div className="modal-header">
          <h2>🔍 Herramienta detectada</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="detect-body">
          <div className="detect-row"><span className="detect-lbl">Nombre</span><span className="detect-val">{data.name}</span></div>
          <div className="detect-row"><span className="detect-lbl">URL</span><span className="detect-val detect-url">{data.url}</span></div>
          <div className="detect-row"><span className="detect-lbl">Categoría</span><span className="detect-val">{data.category || '—'}</span></div>
          <div className="detect-row"><span className="detect-lbl">Tags</span><span className="detect-val">{data.tags.map(t => <span key={t} className="tag tag-tag" style={{ marginRight: '0.2rem' }}>{t}</span>)}</span></div>
          {data.desc && <div className="detect-row"><span className="detect-lbl">Descripción</span><span className="detect-val detect-desc">{data.desc}</span></div>}
        </div>
        <div className="detect-actions">
          <button className="btn btn-primary" onClick={onAccept}>Guardar</button>
          <button className="btn btn-ghost" onClick={onEdit}>Editar</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
