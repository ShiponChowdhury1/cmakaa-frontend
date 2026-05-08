import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/* ── Types ── */

export type DateRangePreset = '7d' | '30d' | '90d' | '1y' | 'custom';

interface DashboardState {
  dateRange: {
    preset: DateRangePreset;
    from: string | null; // ISO string
    to: string | null;
  };
  selectedFilter: string;
}

/* ── Initial State ── */
const initialState: DashboardState = {
  dateRange: {
    preset: '30d',
    from: null,
    to: null,
  },
  selectedFilter: 'all',
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
});

export const {
  setDateRangePreset,
  setCustomDateRange,
  setSelectedFilter,
  resetDashboardFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
