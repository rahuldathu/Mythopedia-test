import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import { Course, Lesson, UserProgress } from './models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'mythopedia',
  jsi: false, // Expo does not support JSI
});

const database = new Database({
  adapter,
  modelClasses: [Course, Lesson, UserProgress],
  actionsEnabled: true,
});

export default database; 