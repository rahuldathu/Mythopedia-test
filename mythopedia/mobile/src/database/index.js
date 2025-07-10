import * as SQLite from 'expo-sqlite';
import { initializeDatabase } from './schema';

// Open (or create) the database
const db = SQLite.openDatabase('mythopedia.db');

initializeDatabase();

export default db; 