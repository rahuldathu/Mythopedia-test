import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mythopedia.db');

// Initialize tables
export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS lessons (id TEXT PRIMARY KEY, course_id TEXT, type TEXT, content TEXT);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, course_id TEXT, lesson_id TEXT, status TEXT, xp_earned INTEGER, completed_at TEXT);'
    );
  });
}

export function saveLesson(lesson) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT OR REPLACE INTO lessons (id, course_id, type, content) VALUES (?, ?, ?, ?);',
      [lesson.id, lesson.course_id, lesson.type, JSON.stringify(lesson.content)]
    );
  });
}

export function getLesson(id, callback) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM lessons WHERE id = ?;',
      [id],
      (_, { rows }) => callback(rows._array[0] ? { ...rows._array[0], content: JSON.parse(rows._array[0].content) } : null)
    );
  });
}

export function getAllOfflineLessons(callback) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM lessons;',
      [],
      (_, { rows }) => callback(rows._array.map(row => ({ ...row, content: JSON.parse(row.content) })))
    );
  });
}

export function saveProgress(progress) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO progress (user_id, course_id, lesson_id, status, xp_earned, completed_at) VALUES (?, ?, ?, ?, ?, ?);',
      [progress.user_id, progress.course_id, progress.lesson_id, progress.status, progress.xp_earned, progress.completed_at]
    );
  });
}

export function getProgress(user_id, callback) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM progress WHERE user_id = ?;',
      [user_id],
      (_, { rows }) => callback(rows._array)
    );
  });
}

export function clearOfflineData() {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM lessons;');
    tx.executeSql('DELETE FROM progress;');
  });
} 