import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { setSyncStatus } from './src/store/offlineSlice';
import { syncUserProgressToBackend, syncCoursesAndLessonsFromBackend } from './src/services/syncService';
import { useEffect } from 'react';
import { NotificationProvider, useNotification } from './src/context/NotificationContext';
import InAppNotification from './src/components/InAppNotification';
import * as Sentry from '@sentry/react-native';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { View, Text, Button } from 'react-native';
import { initializeFirebaseAnalytics } from './src/config/firebase';

Sentry.init({
  dsn: 'https://45364e59b89d7951b5761cca1c9ec7a4@o4509620013367296.ingest.de.sentry.io/4509620033486928', // TODO: Replace with your actual DSN from Sentry project settings
  enabled: !__DEV__,
  debug: false,
});

const linking = {
  prefixes: ['mythopedia://', 'https://mythopedia.app'],
  config: {
    screens: {
      Course: 'course/:id',
      Lesson: 'lesson/:lessonId',
      // Add other screens as needed
    },
  },
};

function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 18, color: 'red', marginBottom: 12 }}>Something went wrong.</Text>
          <Text style={{ marginBottom: 16 }}>{error.toString()}</Text>
          <Button title="Try Again" onPress={resetError} />
        </View>
      )}
      showDialog
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const { notification } = useNotification();

  // Initialize Firebase Analytics
  React.useEffect(() => {
    initializeFirebaseAnalytics();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && user) {
        dispatch(setSyncStatus('syncing'));
        try {
          await syncUserProgressToBackend(user.id);
          await syncCoursesAndLessonsFromBackend();
          dispatch(setSyncStatus('idle'));
        } catch (e) {
          dispatch(setSyncStatus('error'));
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  React.useEffect(() => {
    if (user) {
      Sentry.setUser({ id: user.id, email: user.email, username: user.username });
    } else {
      Sentry.setUser(null);
    }
    Sentry.setRelease(Constants.manifest.version);
  }, [user]);

  return (
    <>
      <InAppNotification
        message={notification?.message}
        type={notification?.type}
        visible={!!notification}
      />
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default Sentry.wrap(function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </Provider>
  );
});