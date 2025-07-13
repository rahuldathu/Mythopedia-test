import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from './schema';

let db;

if (Platform.OS !== 'web') {
  // Open (or create) the database only on native platforms
  db = SQLite.openDatabase('mythopedia.db');

  initializeDatabase(db);
} else {
  console.warn('SQLite is not supported on Web.');
  db = null;
}

export default db;
