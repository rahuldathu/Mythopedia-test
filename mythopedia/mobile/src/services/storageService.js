import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_PROGRESS_KEY = 'offline_progress';

export const getProgress = async (userId, callback) => {
  try {
    const progress = await AsyncStorage.getItem(`${OFFLINE_PROGRESS_KEY}_${userId}`);
    callback(progress ? JSON.parse(progress) : []);
  } catch (e) {
    console.error('Failed to get progress from storage', e);
    callback([]);
  }
};

export const saveProgress = async (userId, progress) => {
  try {
    await AsyncStorage.setItem(`${OFFLINE_PROGRESS_KEY}_${userId}`, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to storage', e);
  }
};

export const clearOfflineData = async (userId) => {
  try {
    await AsyncStorage.removeItem(`${OFFLINE_PROGRESS_KEY}_${userId}`);
  } catch (e) {
    console.error('Failed to clear offline data', e);
  }
};
