import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../index';
import { adminDashboardApi } from './adminDashboardApi';
import type { AdminPlatformStats } from './adminDashboardApi.types';

/* ── Types ── */

export type DateRangePreset = '7d' | '30d' | '90d' | '1y' | 'custom';

interface DashboardState {
  dateRange: {
    preset: DateRangePreset;
    from: string | null; // ISO string
    to: string | null;
  };
  selectedFilter: string;
  platformStats: AdminPlatformStats | null;
  isStatsLoading: boolean;
  statsError: string | null;
}

/* ── Initial State ── */
const initialState: DashboardState = {
  dateRange: {
    preset: '30d',
    from: null,
    to: null,
  },
  selectedFilter: 'all',
  platformStats: null,
  isStatsLoading: false,
  statsError: null,
};

/* ── Slice ── */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRangePreset(state, action: PayloadAction<DateRangePreset>) {
      state.dateRange.preset = action.payload;
      state.dateRange.from = null;
      state.dateRange.to = null;
    },

    setCustomDateRange(
      state,
      action: PayloadAction<{ from: string; to: string }>,
    ) {
      state.dateRange.preset = 'custom';
      state.dateRange.from = action.payload.from;
      state.dateRange.to = action.payload.to;
    },

    setSelectedFilter(state, action: PayloadAction<string>) {
      state.selectedFilter = action.payload;
    },

    resetDashboardFilters() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adminDashboardApi.endpoints.getAdminPlatformStats.matchPending,
        (state) => {
          state.isStatsLoading = true;
          state.statsError = null;
        },
      )
      .addMatcher(
        adminDashboardApi.endpoints.getAdminPlatformStats.matchFulfilled,
        (state, action) => {
          state.isStatsLoading = false;
          state.platformStats = action.payload.data;
        },
      )
      .addMatcher(
        adminDashboardApi.endpoints.getAdminPlatformStats.matchRejected,
        (state, action) => {
          state.isStatsLoading = false;
          state.statsError = action.error.message ?? 'Failed to fetch admin stats';
        },
      );
  },
});

export const {
  setDateRangePreset,
  setCustomDateRange,
  setSelectedFilter,
  resetDashboardFilters,
} = dashboardSlice.actions;

export const selectDashboardState = (state: RootState) => state.dashboard;
export const selectPlatformStats = (state: RootState) => state.dashboard.platformStats;
export const selectDashboardStatsLoading = (state: RootState) => state.dashboard.isStatsLoading;
export const selectDashboardStatsError = (state: RootState) => state.dashboard.statsError;

export default dashboardSlice.reducer;
