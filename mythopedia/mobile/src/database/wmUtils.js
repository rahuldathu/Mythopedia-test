import db from './index';

// Save a course to SQLite
export function saveCourse(course) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO courses (id, title, description, updated_at) VALUES (?, ?, ?, ?)',
        [course.id, course.title, course.description, course.updated_at],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

// Save multiple lessons to SQLite
export function saveLessons(lessons) {
  return Promise.all(lessons.map(lesson =>
    new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO lessons (id, course_id, title, content, updated_at) VALUES (?, ?, ?, ?, ?)',
          [lesson.id, lesson.course_id, lesson.title, lesson.content, lesson.updated_at],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    })
  ));
}

// Get all offline courses
export function getOfflineCourses() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM courses',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
}

// Get all offline lessons for a course
export function getOfflineLessons(courseId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lessons WHERE course_id = ?',
        [courseId],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
}

// Save user progress
export function saveUserProgress(progress) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO progress (id, lesson_id, user_id, status, updated_at, synced) VALUES (?, ?, ?, ?, ?, 0)',
        [progress.id, progress.lesson_id, progress.user_id, progress.status, progress.updated_at],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

// Get unsynced user progress (synced = 0)
export function getUnsyncedUserProgress() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM progress WHERE synced = 0',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
}

// Mark user progress as synced (set synced = 1 for given IDs)
export function markUserProgressAsSynced(ids) {
  if (!ids.length) return Promise.resolve();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const placeholders = ids.map(() => '?').join(',');
      tx.executeSql(
        `UPDATE progress SET synced = 1 WHERE id IN (${placeholders})`,
        ids,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
} 