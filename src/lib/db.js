import initSqlJs from 'sql.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function findRoot() {
  if (fs.existsSync(path.join(process.cwd(), 'package.json'))) return process.cwd();
  if (fs.existsSync(path.join(__dirname, 'package.json'))) return __dirname;
  if (fs.existsSync(path.join(__dirname, '..', 'package.json'))) return path.join(__dirname, '..');
  return path.join(__dirname, '..', '..', '..');
}
const DB_PATH = path.join(findRoot(), 'toolkit.db');

let db = null;
let inTransaction = false;

function saveDb() {
  if (db) {
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  }
}

const init = initSqlJs().then(SQL => {
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }
  db.run('PRAGMA journal_mode = WAL');
  db.run(`CREATE TABLE IF NOT EXISTS herramientas (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL,
    desc TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'Otro',
    importance TEXT NOT NULL DEFAULT 'util', tags TEXT NOT NULL DEFAULT '[]',
    favorite INTEGER NOT NULL DEFAULT 0, visits INTEGER NOT NULL DEFAULT 0,
    favicon TEXT NOT NULL DEFAULT '',
    last_visited_at TEXT,
    created_at TEXT, updated_at TEXT
  )`);
  try { db.run("ALTER TABLE herramientas ADD COLUMN favicon TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.run("ALTER TABLE herramientas ADD COLUMN last_visited_at TEXT"); } catch {}
  try { db.run("ALTER TABLE herramientas ADD COLUMN user_id TEXT"); } catch {}
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    avatar TEXT, google_id TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  try { db.run("ALTER TABLE users ADD COLUMN avatar TEXT"); } catch {}
  db.run("DELETE FROM herramientas WHERE user_id IS NULL");
  saveDb();
});

await init;

export function qrun(sql, ...params) {
  db.run(sql, params);
  if (!inTransaction) saveDb();
}

export function qget(sql, ...params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.getAsObject();
  stmt.free();
  return row;
}

export function qall(sql, ...params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export function qtransaction(fn) {
  inTransaction = true;
  db.run('BEGIN');
  try {
    fn();
    db.run('COMMIT');
    inTransaction = false;
    saveDb();
  } catch (e) {
    inTransaction = false;
    throw e;
  }
}
