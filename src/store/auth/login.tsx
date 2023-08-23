import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: Boolean(localStorage.getItem('token')),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
    setUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUserData } = authSlice.actions;

export const fetchUserData = () => async (dispatch: any) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_API_URL}/login/`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    dispatch(setUserData(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default authSlice.reducer;
