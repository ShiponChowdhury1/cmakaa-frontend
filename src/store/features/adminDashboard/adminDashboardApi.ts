import { baseApi } from '../../api/baseApi';
import type {
	AdminPardnasQueryParams,
	AdminPardnasResponse,
	AdminStatsResponse,
	AdminBankersResponse,
	AdminBankersQueryParams,
} from './adminDashboardApi.types';

export const adminDashboardApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAdminPlatformStats: builder.query<AdminStatsResponse, void>({
			query: () => ({
				url: '/admin/stats',
			}),
			providesTags: ['Dashboard'],
		}),
		getAdminPardnas: builder.query<AdminPardnasResponse, AdminPardnasQueryParams | void>({
			query: (params) => ({
				url: '/admin/pardnas',
				params: params ?? undefined,
			}),
			providesTags: ['Pardna'],
		}),
		getAdminBankers: builder.query<AdminBankersResponse, AdminBankersQueryParams | void>({
			query: (params) => ({
				url: '/admin/bankers',
				params: params ?? undefined,
			}),
			providesTags: ['Users'],
		}),
	}),
});

export const { useGetAdminPlatformStatsQuery, useGetAdminPardnasQuery, useGetAdminBankersQuery } = adminDashboardApi;
