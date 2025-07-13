import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../src/store';
import useOfflineSync from '../src/hooks/useOfflineSync';
import { initDB } from '../src/storageService'; // adjust path if needed

export default function RootLayout() {
  useOfflineSync();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initDB();
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <Slot />
        </NotificationProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
