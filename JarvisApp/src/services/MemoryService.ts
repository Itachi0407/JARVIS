import { open } from 'react-native-quick-sqlite';

const db = open({ name: 'jarvis_memory.db' });

export class MemoryService {
  static async init() {
    db.execute(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    db.execute(`
      CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  }

  static async logMessage(role: 'user' | 'jarvis', content: string) {
    db.execute('INSERT INTO conversations (role, content) VALUES (?, ?);', [role, content]);
  }

  static async getRecentContext(limit: number = 10) {
    const result = db.execute('SELECT role, content FROM conversations ORDER BY timestamp DESC LIMIT ?;', [limit]);
    return result.rows?._array.reverse() || [];
  }

  static async setPreference(key: string, value: string) {
    db.execute('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);', [key, value]);
  }

  static async getPreference(key: string) {
    const result = db.execute('SELECT value FROM preferences WHERE key = ?;', [key]);
    return result.rows?.item(0)?.value || null;
  }
}
