import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  xp: 0,
  streak: 0,
  achievements: [],
  lessonProgress: {}, // { [lessonId]: { status, score, ... } }
  loading: false,
  error: null,
  completedCourses: [], // Persist completed courses for XP bonus
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
    setCompletedCourses(state, action) {
      state.completedCourses = action.payload;
    },
  },
});

export const { setXP, setStreak, setAchievements, setLessonProgress, setLoading, setError, setCompletedCourses } = progressSlice.actions;
export default progressSlice.reducer; 