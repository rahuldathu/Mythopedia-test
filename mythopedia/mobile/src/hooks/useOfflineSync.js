import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getProgress, clearOfflineData } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

export default function useOfflineSync() {
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // Try to sync offline progress
        getProgress(user.id, async (progress) => {
          if (progress && progress.length > 0) {
            try {
              await fetch('http://localhost:4000/api/offline-sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.id}` // Replace with real JWT
                },
                body: JSON.stringify({ progress }),
              });
              clearOfflineData();
            } catch (e) {
              // Ignore sync errors
            }
          }
        });
      }
    });
    return () => unsubscribe();
  }, [user]);
} 