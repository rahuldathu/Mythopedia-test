import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  downloadedCourses: [], // array of course IDs
  downloadedLessons: {}, // { [courseId]: [lessonIds] }
  syncStatus: 'idle', // 'idle' | 'syncing' | 'error'
  error: null,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setDownloadedCourses(state, action) {
      state.downloadedCourses = action.payload;
    },
    setDownloadedLessons(state, action) {
      state.downloadedLessons = action.payload;
    },
    setSyncStatus(state, action) {
      state.syncStatus = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setDownloadedCourses, setDownloadedLessons, setSyncStatus, setError } = offlineSlice.actions;
export default offlineSlice.reducer; 