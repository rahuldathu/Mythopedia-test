
export function initializeDatabase(db) {
  // const targetDb = database || db;
  if (!db) return;

  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        description TEXT,
        updated_at TEXT
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY NOT NULL,
        course_id TEXT,
        title TEXT,
        content TEXT,
        updated_at TEXT,
        FOREIGN KEY(course_id) REFERENCES courses(id)
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY NOT NULL,
        lesson_id TEXT,
        user_id TEXT,
        status TEXT,
        updated_at TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY(lesson_id) REFERENCES lessons(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT,
        username TEXT,
        avatar_url TEXT,
        updated_at TEXT
      );
    `);

    tx.executeSql(`PRAGMA table_info(progress);`, [], (_, { rows }) => {
      const hasSynced = rows._array.some(col => col.name === 'synced');
      if (!hasSynced) {
        tx.executeSql('ALTER TABLE progress ADD COLUMN synced INTEGER DEFAULT 0;');
      }
    });
  });
}
