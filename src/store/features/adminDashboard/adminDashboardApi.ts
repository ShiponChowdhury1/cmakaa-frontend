import { baseApi } from '../../api/baseApi';
import type {
	AdminPardnasQueryParams,
	AdminPardnasResponse,
	AdminStatsResponse,
	AdminBankersResponse,
	AdminBankersQueryParams,
	AdminParticipantsResponse,
	AdminParticipantsQueryParams,
	AdminPaymentsResponse,
	AdminPaymentsQueryParams,
	AdminPayoutsResponse,
	AdminPayoutsQueryParams,
	AdminKycResponse,
	AdminKycQueryParams,
	AdminKycActionResponse,
	AdminAuditLogResponse,
	AdminAuditLogQueryParams,
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
		getAdminParticipants: builder.query<AdminParticipantsResponse, AdminParticipantsQueryParams | void>({
			query: (params) => ({
				url: '/admin/participants',
				params: params ?? undefined,
			}),
			providesTags: ['Participants'],
		}),
		getAdminPayments: builder.query<AdminPaymentsResponse, AdminPaymentsQueryParams | void>({
			query: (params) => ({
				url: '/admin/payments',
				params: params ?? undefined,
			}),
			providesTags: ['Payments'],
		}),
		getAdminPayouts: builder.query<AdminPayoutsResponse, AdminPayoutsQueryParams | void>({
			query: (params) => ({
				url: '/admin/payouts',
				params: params ?? undefined,
			}),
			providesTags: ['Payouts'],
		}),
		getAdminKyc: builder.query<AdminKycResponse, AdminKycQueryParams | void>({
			query: (params) => ({
				url: '/admin/kyc',
				params: params ?? undefined,
			}),
			providesTags: ['Kyc'],
		}),
		approveAdminKyc: builder.mutation<AdminKycActionResponse, string>({
			query: (kycId) => ({
				url: `/admin/kyc/${kycId}/approve`,
				method: 'POST',
			}),
			invalidatesTags: ['Kyc'],
		}),
		declineAdminKyc: builder.mutation<AdminKycActionResponse, { kycId: string; rejectionReason?: string }>({
			query: ({ kycId, rejectionReason }) => ({
				url: `/admin/kyc/${kycId}/decline`,
				method: 'POST',
				body: { rejectionReason },
			}),
			invalidatesTags: ['Kyc'],
		}),
		getAdminAuditLogs: builder.query<AdminAuditLogResponse, AdminAuditLogQueryParams | void>({
			query: (params) => ({
				url: '/admin/audit-logs',
				params: params ?? undefined,
			}),
			providesTags: ['AuditLog'],
		}),
	}),
});

export const {
	useGetAdminPlatformStatsQuery,
	useGetAdminPardnasQuery,
	useGetAdminBankersQuery,
	useGetAdminParticipantsQuery,
	useGetAdminPaymentsQuery,
	useGetAdminPayoutsQuery,
	useGetAdminKycQuery,
	useApproveAdminKycMutation,
	useDeclineAdminKycMutation,
	useGetAdminAuditLogsQuery,
} = adminDashboardApi;
