import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { setSyncStatus } from './src/store/offlineSlice';
import { syncUserProgressToBackend, syncCoursesAndLessonsFromBackend } from './src/services/syncService';
import { useEffect } from 'react';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

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

  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
} 