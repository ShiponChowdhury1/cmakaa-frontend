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
