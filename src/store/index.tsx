import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/login';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
export default store;
