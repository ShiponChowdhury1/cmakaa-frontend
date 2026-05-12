export interface AdminPlatformStats {
	totalBankers: number;
	totalParticipants: number;
	totalPardnas: number;
	activePardnas: number;
	pendingKyc: number;
	totalConfirmedPayouts: number;
  graphs?: AdminPlatformGraphs;
}

export interface AdminUserGrowthItem {
	month: string;
	users: number;
	bankers: number;
	participants: number;
}

export interface AdminMonthlyCollectionItem {
	month: string;
	amount: number;
}

export interface AdminMonthlyCollections {
	data: AdminMonthlyCollectionItem[];
	total: string;
	peak: string;
}

export type AdminPardnaStatusDistribution = Record<
	string,
	{ count: number; percentage: number } | number
> & { total?: number };

export interface AdminPlatformGraphs {
	userGrowthTrend?: AdminUserGrowthItem[];
	monthlyCollections?: AdminMonthlyCollections;
	pardnaStatusDistribution?: AdminPardnaStatusDistribution;
}

export interface AdminStatsResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: AdminPlatformStats;
}

export interface AdminPardnaBanker {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface AdminPardnaCount {
	participants: number;
}

export interface AdminPardna {
	id: string;
	name: string;
	status: string;
	contribution: string;
	frequency: string;
	currentRound: number;
	totalRounds: number;
	createdAt: string;
	banker: AdminPardnaBanker;
	_count: AdminPardnaCount;
}

export interface AdminPardnasPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminPardnasStatus {
	active: number;
	totalContribution: number;
	total: number;
}

export interface AdminPardnasResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminPardnasPagination;
		status: AdminPardnasStatus;
	};
	data: AdminPardna[];
}

export interface AdminPardnasQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AdminBanker {
	id: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
	phoneNumber: string;
	kycStatus: string;
	createdAt: string;
	_count: {
		pardnas: number;
	};
}

export interface AdminBankersStatus {
	active: number;
	suspended: number;
	total: number;
}

export interface AdminBankersPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminBankersResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminBankersPagination;
		status: AdminBankersStatus;
	};
	data: AdminBanker[];
}

export interface AdminBankersQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AdminParticipantTrustScore {
	compositeScore: number;
	label: string;
}

export interface AdminParticipantPardna {
	id: string;
	name: string;
}

export interface AdminParticipant {
	id: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	status: string;
	joinedAt: string;
	pardna: AdminParticipantPardna;
	trustScore: AdminParticipantTrustScore;
}

export interface AdminParticipantsPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminParticipantsResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminParticipantsPagination;
	};
	data: AdminParticipant[];
}

export interface AdminParticipantsQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AdminPaymentRound {
	id: string;
	roundNumber: number;
}

export interface AdminPaymentParticipant {
	id: string;
	fullName: string;
	email: string;
}

export interface AdminPayment {
	id: string;
	amount: string;
	status: string;
	paidAt: string | null;
	createdAt: string;
	round: AdminPaymentRound;
	participant: AdminPaymentParticipant;
	recordedBy: unknown | null;
}

export interface AdminPaymentsStatus {
	PENDING: number;
	PAID: number;
	LATE: number;
	MISSED: number;
}

export interface AdminPaymentsPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminPaymentsResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminPaymentsPagination;
		status: AdminPaymentsStatus;
	};
	data: AdminPayment[];
}

export interface AdminPaymentsQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AdminPayoutRound {
	id: string;
	roundNumber: number;
}

export interface AdminPayoutParticipant {
	id: string;
	fullName: string;
	email: string;
}

export interface AdminPayoutConfirmedBy {
	id: string;
	firstName: string;
	lastName: string;
}

export interface AdminPayout {
	id: string;
	amount: string;
	status: string;
	confirmedAt: string | null;
	createdAt: string;
	round: AdminPayoutRound;
	participant: AdminPayoutParticipant;
	confirmedBy: AdminPayoutConfirmedBy | null;
}

export interface AdminPayoutsStatus {
	PENDING: number;
	CONFIRMED: number;
}

export interface AdminPayoutsPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminPayoutsResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminPayoutsPagination;
		status: AdminPayoutsStatus;
	};
	data: AdminPayout[];
}

export interface AdminPayoutsQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AdminKycUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
}

export interface AdminKycApplication {
	id: string;
	userId: string;
	documentType: string;
	documentFront: string;
	documentBack: string;
	selfieUrl: string;
	status: string;
	rejectionReason: string | null;
	submittedAt: string;
	reviewedAt: string | null;
	reviewedBy: string | null;
	notes: string | null;
	user: AdminKycUser;
}

export interface AdminKycStatus {
	NOT_SUBMITTED: number;
	PENDING: number;
	APPROVED: number;
	REJECTED: number;
	total: number;
}

export interface AdminKycPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminKycResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminKycPagination;
		status: AdminKycStatus;
	};
	data: AdminKycApplication[];
}

export interface AdminKycQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface AdminKycActionResponse {
	success: boolean;
	statusCode: number;
	message: string;
}

export interface AdminAuditLogActor {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface AdminAuditLog {
	id: string;
	actorId: string;
	action: string;
	entityType: string;
	entityId: string;
	metadata: Record<string, unknown>;
	createdAt: string;
	actor: AdminAuditLogActor;
}

export interface AdminAuditLogPagination {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}

export interface AdminAuditLogResponse {
	success: boolean;
	statusCode: number;
	message: string;
	meta: {
		pagination: AdminAuditLogPagination;
	};
	data: AdminAuditLog[];
}

export interface AdminAuditLogQueryParams {
	page?: number;
	limit?: number;
	search?: string;
}
