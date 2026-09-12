import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'luxecart.db');

let db = null;
let saveTimer = null;

/**
 * Initialize and return the database instance.
 * sql.js runs SQLite entirely in JavaScript — no native build tools needed.
 */
export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database file or create new
  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('✓ Database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('✓ New database created');
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  // Run schema
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.run(schema);
  console.log('✓ Schema applied');

  return db;
}

/**
 * Save the in-memory database to disk.
 * Debounced to avoid excessive writes.
 */
export function saveDb() {
  if (!db) return;
  
  // Debounce: save at most once per second
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('Failed to save database:', err.message);
    }
  }, 500);
}

/**
 * Force immediate save (for shutdown).
 */
export function saveDbSync() {
  if (!db) return;
  if (saveTimer) clearTimeout(saveTimer);
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
    console.log('✓ Database saved to disk');
  } catch (err) {
    console.error('Failed to save database:', err.message);
  }
}

/**
 * Close the database connection.
 */
export function closeDb() {
  if (db) {
    saveDbSync();
    db.close();
    db = null;
    console.log('✓ Database connection closed');
  }
}

/**
 * Helper: Run a query that modifies data (INSERT, UPDATE, DELETE).
 * Automatically saves to disk after mutations.
 */
export function runQuery(sql, params = []) {
  db.run(sql, params);
  saveDb();
  return { changes: db.getRowsModified(), lastId: getLastInsertId() };
}

/**
 * Helper: Get a single row.
 */
export function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/**
 * Helper: Get all matching rows.
 */
export function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Helper: Get the last inserted row ID.
 */
function getLastInsertId() {
  const result = db.exec('SELECT last_insert_rowid() as id');
  return result.length > 0 ? result[0].values[0][0] : null;
}
