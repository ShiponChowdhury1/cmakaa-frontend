import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './features/auth/authSlice';
import dashboardReducer from './features/adminDashboard/adminDashboardSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
