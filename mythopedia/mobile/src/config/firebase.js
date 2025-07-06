import Constants from 'expo-constants';

// Firebase configuration
export const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase Analytics
export const initializeFirebaseAnalytics = async () => {
  try {
    // Firebase Analytics is automatically initialized by expo-firebase-analytics
    // when the app starts, but you can configure it here if needed
    console.log('Firebase Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize Firebase Analytics:', error);
  }
}; 