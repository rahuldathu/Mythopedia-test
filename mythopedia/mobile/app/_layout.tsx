import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../src/store';
import useOfflineSync from '../src/hooks/useOfflineSync';
import db from '../src/database/index';
import type { SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '../src/database/schema';

export default function RootLayout() {
  useOfflineSync();

  // Explicitly type db as SQLiteDatabase | null
  const typedDb = db as SQLiteDatabase | null;

  useEffect(() => {
    // Only initialize DB if SQLite is available and Hermes is not enabled
    if (
      Platform.OS !== 'web' &&
      typedDb &&
      typeof HermesInternal === 'undefined'
    ) {
      initializeDatabase(typedDb);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <NotificationProvider>
          {/* Slot is a valid React component, no style prop on Fragment */}
          <Slot />
        </NotificationProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
