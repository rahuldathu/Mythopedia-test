import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  xp: 0,
  streak: 0,
  achievements: [],
  lessonProgress: {}, // { [lessonId]: { status, score, ... } }
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setXP(state, action) {
      state.xp = action.payload;
    },
    setStreak(state, action) {
      state.streak = action.payload;
    },
    setAchievements(state, action) {
      state.achievements = action.payload;
    },
    setLessonProgress(state, action) {
      state.lessonProgress = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setXP, setStreak, setAchievements, setLessonProgress, setLoading, setError } = progressSlice.actions;
export default progressSlice.reducer; 