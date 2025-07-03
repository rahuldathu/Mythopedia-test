import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
};

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLessons(state, action) {
      state.lessons = action.payload;
    },
    setCurrentLesson(state, action) {
      state.currentLesson = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setLessons, setCurrentLesson, setLoading, setError } = lessonsSlice.actions;
export default lessonsSlice.reducer; 