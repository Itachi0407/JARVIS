let openDb: any = null;
try {
  openDb = require('react-native-quick-sqlite').open;
} catch (e) {
  console.warn('react-native-quick-sqlite not available, memory disabled');
}

let db: any = null;

function getDb() {
  if (!db && openDb) {
    try {
      db = openDb({ name: 'jarvis_memory.db' });
    } catch (e) {
      console.warn('Failed to open database:', e);
    }
  }
  return db;
}

export class MemoryService {
  static async init() {
    const database = getDb();
    if (!database) return;
    try {
      database.execute(`
        CREATE TABLE IF NOT EXISTS conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          role TEXT,
          content TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      database.execute(`
        CREATE TABLE IF NOT EXISTS preferences (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);
    } catch (e) {
      console.warn('Failed to initialize database tables:', e);
    }
  }

  static async logMessage(role: 'user' | 'jarvis', content: string) {
    const database = getDb();
    if (!database) return;
    database.execute('INSERT INTO conversations (role, content) VALUES (?, ?);', [role, content]);
  }

  static async getRecentContext(limit: number = 10) {
    const database = getDb();
    if (!database) return [];
    try {
      const result = database.execute('SELECT role, content FROM conversations ORDER BY timestamp DESC LIMIT ?;', [limit]);
      return result.rows?._array?.reverse() || [];
    } catch (e) {
      return [];
    }
  }

  static async setPreference(key: string, value: string) {
    const database = getDb();
    if (!database) return;
    database.execute('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);', [key, value]);
  }

  static async getPreference(key: string) {
    const database = getDb();
    if (!database) return null;
    try {
      const result = database.execute('SELECT value FROM preferences WHERE key = ?;', [key]);
      return result.rows?.item(0)?.value || null;
    } catch (e) {
      return null;
    }
  }
}
