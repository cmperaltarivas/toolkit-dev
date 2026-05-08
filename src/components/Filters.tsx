import { CATEGORIES, IMPORTANCIAS } from '../lib/hints';

interface Props {
  search: string; onSearchChange: (v: string) => void;
  catFilter: string; onCatChange: (v: string) => void;
  impFilter: string; onImpChange: (v: string) => void;
  tagFilter: string; onTagChange: (v: string) => void;
  favFilter: boolean; onFavChange: (v: boolean) => void;
  sortField: string; sortOrder: string; onSortChange: (f: string, o: string) => void;
  onClear: () => void;
}

export default function Filters({
  search, onSearchChange, catFilter, onCatChange, impFilter, onImpChange,
  tagFilter, onTagChange, favFilter, onFavChange, sortField, sortOrder, onSortChange, onClear,
}: Props) {
  const hasFilters = !!(search || catFilter || impFilter || tagFilter || favFilter);

  return (
    <div className="filters-panel">
      <div className="filters-row">
        <div className="fg search-group">
          <svg className="ficon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" className="fi" id="searchInput" placeholder="Buscar..." value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <select className="fs" value={catFilter} onChange={e => onCatChange(e.target.value)}>
          <option value="">Categoría</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="fs" value={impFilter} onChange={e => onImpChange(e.target.value)}>
          <option value="">Importancia</option>
          {IMPORTANCIAS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
        <input type="text" className="fi ftag" placeholder="#tag" value={tagFilter} onChange={e => onTagChange(e.target.value)} />
        <select className="fs" value={`${sortField}.${sortOrder}`} onChange={e => { const [f, o] = e.target.value.split('.'); onSortChange(f, o); }}>
          <option value="created_at.desc">Recientes</option>
          <option value="created_at.asc">Antiguas</option>
          <option value="name.asc">A-Z</option>
          <option value="name.desc">Z-A</option>
          <option value="importance.desc">Importancia</option>
          <option value="visits.desc">Visitas</option>
        </select>
        <button className={`btn btn-xs btn-ghost ${favFilter ? 'btn-danger' : ''}`} onClick={() => onFavChange(!favFilter)}>⭐</button>
        {hasFilters && <button className="btn btn-xs btn-ghost" onClick={onClear}>✕</button>}
      </div>
    </div>
  );
}
