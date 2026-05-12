const SHORTCUTS = [
  { keys: ['Ctrl', 'N'], desc: 'Nueva herramienta' },
  { keys: ['Ctrl', 'F'], desc: 'Buscar' },
  { keys: ['Esc'], desc: 'Cerrar modal / popup' },
  { keys: ['?'], desc: 'Mostrar esta ayuda' },
];

export default function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal shortcuts-modal" role="dialog" aria-modal="true" aria-label="Atajos de teclado">
        <div className="modal-header">
          <h2 id="shortcutsTitle">⌨ Atajos de teclado</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>
        <div className="shortcuts-list">
          {SHORTCUTS.map(s => (
            <div key={s.desc} className="shortcut-row">
              <span className="shortcut-key">
                {s.keys.map(k => <kbd key={k}>{k}</kbd>)}
              </span>
              <span className="shortcut-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
