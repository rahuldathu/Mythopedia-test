import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import coursesReducer from './coursesSlice';
import lessonsReducer from './lessonsSlice';
import offlineReducer from './offlineSlice';
import progressReducer from './progressSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    courses: coursesReducer,
    lessons: lessonsReducer,
    offline: offlineReducer,
    progress: progressReducer,
  },
});

export default store; 