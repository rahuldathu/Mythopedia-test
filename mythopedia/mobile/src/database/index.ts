import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from './schema';
import type { SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase | null;

if (Platform.OS !== 'web') {
  db = SQLite.openDatabaseSync('mythopedia.db');
  initializeDatabase(db);
} else {
  console.warn('SQLite is not supported on Web.');
  db = null;
}

export default db;
