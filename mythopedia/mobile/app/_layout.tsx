import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../src/store';
import useOfflineSync from '../src/hooks/useOfflineSync';

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ReduxProvider>
  );
}

function RootLayoutNav() {
  useOfflineSync();

  return (
    <NotificationProvider>
      <Slot />
    </NotificationProvider>
  );
}
