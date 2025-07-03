import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.profile = null;
    },
  },
});

export const { setUser, setProfile, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer; 