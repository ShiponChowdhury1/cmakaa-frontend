import { baseApi } from '../../api/baseApi';
import type { AdminStatsResponse } from './adminDashboardApi.types';

export const adminDashboardApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAdminPlatformStats: builder.query<AdminStatsResponse, void>({
			query: () => ({
				url: '/admin/stats',
			}),
			providesTags: ['Dashboard'],
		}),
	}),
});

export const { useGetAdminPlatformStatsQuery } = adminDashboardApi;
