import db from './index';

// Create tables if they do not exist
export function initializeDatabase() {
  db.transaction(tx => {
    // Courses table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        description TEXT,
        updated_at TEXT
      );`
    );
    // Lessons table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY NOT NULL,
        course_id TEXT,
        title TEXT,
        content TEXT,
        updated_at TEXT,
        FOREIGN KEY(course_id) REFERENCES courses(id)
      );`
    );
    // Progress table with 'synced' column
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY NOT NULL,
        lesson_id TEXT,
        user_id TEXT,
        status TEXT,
        updated_at TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY(lesson_id) REFERENCES lessons(id)
      );`
    );
    // Migration: add 'synced' column if it doesn't exist
    tx.executeSql(
      `PRAGMA table_info(progress);`,
      [],
      (_, { rows }) => {
        const hasSynced = rows._array.some(col => col.name === 'synced');
        if (!hasSynced) {
          tx.executeSql('ALTER TABLE progress ADD COLUMN synced INTEGER DEFAULT 0;');
        }
      }
    );
  });
} 