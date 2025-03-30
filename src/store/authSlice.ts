import { User } from '@/types/User';
import { createSlice } from '@reduxjs/toolkit';

const initialState: User = {
  email: undefined,
  token: undefined,
  id: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
