import Constants from 'expo-constants';

// Backend API base URL
export const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:3000'; 