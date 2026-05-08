# ToolKit Dev 🧰

Organizador de herramientas para desarrolladores. Catalogá, clasificá y explorá tu colección personal de frameworks, servicios, canales de contenido, herramientas CLI y más.

Built with [Astro 5](https://astro.build) + [SQLite](https://sql.js.org) + vanilla JS.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Astro 5 (SSR), CSS custom, vanilla JS |
| Backend | API REST embebida en rutas Astro |
| DB | SQLite via `sql.js` |
| Adapter | `@astrojs/node` (standalone) |
| Testing | Vitest |

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
git clone https://github.com/cmperaltarivas/toolkit-dev.git
cd toolkit-dev
npm install
npm run seed    # Poblar DB con datos de ejemplo
npm run dev     # http://localhost:3000
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción a `dist/` |
| `npm run preview` | Servir build localmente |
| `npm run seed` | Poblar DB con 20 herramientas de ejemplo |
| `npm run test` | Ejecutar tests unitarios |
| `npm run test:watch` | Tests en modo watch |

## Docker

```bash
docker build -t toolkit-dev .
docker run -p 3000:3000 -v $(pwd)/toolkit.db:/app/toolkit.db toolkit-dev
```

## API REST

### Herramientas

```
GET    /api/tools          Listar (paginado, filtros)
GET    /api/tools/:id      Obtener una
POST   /api/tools          Crear
PUT    /api/tools/:id      Actualizar
DELETE /api/tools/:id      Eliminar
```

**Parámetros GET /api/tools:**
- `search` — búsqueda por nombre, descripción, URL
- `category` — filtrar por categoría
- `importance` — filtrar por importancia (`critico`, `esencial`, `util`, `opcional`)
- `tag` — filtrar por tag
- `favorite` — solo favoritos (`true`)
- `sort` — columna de orden (`name`, `created_at`, `importance`, `visits`)
- `order` — `asc` o `desc`
- `limit` — máx 200 (default 50)
- `offset` — desplazamiento

### Estadísticas

```
GET /api/stats       Resumen: totales, categorías, importancia, visitas, tags
GET /api/categories  Lista de categorías
GET /api/health      Health check (status, tools, uptime)
```

### Acciones

```
PATCH /api/fav/:id    Toggle favorito
PATCH /api/visit/:id  Incrementar visita
POST  /api/import     Importar bookmarks.html o JSON
GET   /api/export     Exportar todo como JSON
```

## Dashboard

- **Resumen**: total de herramientas, favoritas, categorías, visitas
- **Por categoría**: distribución con barras, click para expandir herramientas
- **Por importancia**: nivel crítico, esencial, útil, opcional
- **Tags**: nube de tags con tamaño proporcional, click para expandir
- **Nunca visitadas**: herramientas pendientes de revisar
- **Prioritarias sin visitar**: críticas/esenciales aún no visitadas

## Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `?` | Ayuda de atajos |
| `Ctrl + N` | Nueva herramienta |
| `Ctrl + F` | Buscar |
| `Esc` | Cerrar modal |

## Licencia

MIT
