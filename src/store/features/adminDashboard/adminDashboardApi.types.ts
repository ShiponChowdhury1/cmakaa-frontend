export interface AdminPlatformStats {
	totalBankers: number;
	totalParticipants: number;
	totalPardnas: number;
	activePardnas: number;
	pendingKyc: number;
	totalConfirmedPayouts: number;
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
