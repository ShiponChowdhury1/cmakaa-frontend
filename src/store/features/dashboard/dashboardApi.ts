import { baseApi } from '../../api/baseApi';

/* ── Types ── */

interface PlatformStats {
  totalBankers: number;
  totalParticipants: number;
  totalPardnas: number;
  totalRevenue: number;
  activePardnas: number;
  pendingKyc: number;
}

interface PlatformStatsResponse {
  success: boolean;
  data: PlatformStats;
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface DashboardOverviewResponse {
  success: boolean;
  data: {
    stats: PlatformStats;
    chartData: ChartDataPoint[];
  };
}

interface PardnaListItem {
  id: string;
  name: string;
  banker: string;
  participantCount: number;
  status: 'active' | 'completed' | 'overdue' | 'paused';
  totalCollected: number;
  currency: string;
  createdAt: string;
}

interface GetPardnasResponse {
  success: boolean;
  data: PardnaListItem[];
}

interface KycApplication {
  id: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: string[];
}

interface GetKycResponse {
  success: boolean;
  data: KycApplication[];
}

interface KycActionRequest {
  applicationId: string;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

interface DashboardQueryParams {
  dateRange?: string;
  from?: string;
  to?: string;
}

/* ── Dashboard API ── */

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /getPlatformStats
    getPlatformStats: builder.query<PlatformStatsResponse, void>({
      query: () => '/getPlatformStats',
      providesTags: ['Dashboard'],
    }),

    // GET /dashboard-overview (Banker side)
    getDashboardOverview: builder.query<DashboardOverviewResponse, DashboardQueryParams | void>({
      query: (params) => ({
        url: '/dashboard-overview',
        params: params ?? undefined,
      }),
      providesTags: ['Dashboard'],
    }),

    // GET /getPardnas (Admin)
    getPardnas: builder.query<GetPardnasResponse, void>({
      query: () => '/getPardnas',
      providesTags: ['Pardna'],
    }),

    // GET /getKycApplications (Admin)
    getKycApplications: builder.query<GetKycResponse, void>({
      query: () => '/getKycApplications',
      providesTags: ['Kyc'],
    }),

    // POST /approveKyc
    approveKyc: builder.mutation<MessageResponse, KycActionRequest>({
      query: (body) => ({
        url: '/approveKyc',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Kyc', 'Dashboard'],
    }),

    // POST /declineKyc
    declineKyc: builder.mutation<MessageResponse, KycActionRequest>({
      query: (body) => ({
        url: '/declineKyc',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Kyc'],
    }),
  }),
});

export const {
  useGetPlatformStatsQuery,
  useGetDashboardOverviewQuery,
  useGetPardnasQuery,
  useGetKycApplicationsQuery,
  useApproveKycMutation,
  useDeclineKycMutation,
} = dashboardApi;
