import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Printer, ChevronLeft, ChevronRight, Search, X, Calendar, ShieldCheck, Activity, Award } from 'lucide-react';
import { createPortal } from 'react-dom';
import StatsCard from '../../components/StatsCard';
import { useGetAdminBankersQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminBanker } from '@/store/features/adminDashboard/adminDashboardApi.types';
import { isDateWithinDays } from '@/utils/dateFilter';

// ─── Data ────────────────────────────────────────────────────────────────────

type Rating = 'Strong' | 'Fair' | 'Weak';
type Status = 'active' | 'suspended';

interface TrustSign {
  label: string;
  desc: string;
  rating: Rating;
}

interface Banker {
  id: string;
  name: string;
  username: string;
  pardnas: number;
  activePardnas: number;
  completedPardnas: number;
  trustScore: number;
  rating: Rating;
  status: Status;
  memberSince: string;
  overall: string;
  signs: TrustSign[];
}

const makeSign = (label: string, desc: string, rating: Rating): TrustSign => ({ label, desc, rating });

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ─── Trust Summary Card (Print Modal) ─────────────────────────────────────────

function TrustScoreRing({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  const scoreRingColor = (s: number) =>
    s >= 88 ? '#16A34A' : s >= 75 ? '#E57432' : '#EF4444';
  
  const color = scoreRingColor(score);

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width="104" height="104" viewBox="0 0 96 96" className="transform -rotate-90">
        {/* Background ring */}
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="6" />
        {/* Progress ring */}
        <circle
          cx="48" cy="48" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Score text absolute center */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tracking-tight" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider -mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}

function TrustCard({ banker, onClose }: { banker: Banker; onClose: () => void }) {
  const ratingBadgeStyle = (r: Rating) => {
    switch (r) {
      case 'Strong': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Fair':   return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Weak':   return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const ratingDot = (r: Rating) => {
    switch (r) {
      case 'Strong': return '#16A34A';
      case 'Fair':   return '#E57432';
      case 'Weak':   return '#EF4444';
    }
  };

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=850,height=900');
    if (!win) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

    const scoreRingColor = (s: number) =>
      s >= 88 ? '#16A34A' : s >= 75 ? '#E57432' : '#EF4444';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Trust Assessment Report - ${banker.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', sans-serif;
              color: #0f172a;
              background-color: #ffffff;
              padding: 40px;
              line-height: 1.5;
            }
            .report-card {
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              overflow: hidden;
              max-width: 760px;
              margin: 0 auto;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            }
            .header {
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color: #ffffff;
              padding: 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
            }
            .header-info h1 {
              font-family: 'Outfit', sans-serif;
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 6px;
              letter-spacing: -0.5px;
            }
            .header-info p {
              color: #94a3b8;
              font-size: 15px;
              font-weight: 500;
            }
            .logo-badge {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 20px;
            }
            .logo-icon {
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background-color: #f97316;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 16px;
            }
            .logo-text {
              font-family: 'Outfit', sans-serif;
              font-weight: 700;
              font-size: 15px;
              letter-spacing: 0.5px;
            }
            .score-circle {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 8px solid ${scoreRingColor(banker.trustScore)};
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              font-weight: 800;
              font-size: 32px;
              color: #ffffff;
              background-color: rgba(255, 255, 255, 0.04);
            }
            .score-circle span {
              font-size: 11px;
              color: #94a3b8;
              font-weight: 600;
              text-transform: uppercase;
              margin-top: -2px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              background-color: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
            }
            .stat-item {
              padding: 24px 16px;
              text-align: center;
              border-right: 1px solid #e2e8f0;
            }
            .stat-item:last-child {
              border-right: none;
            }
            .stat-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1.2px;
              color: #64748b;
              margin-bottom: 6px;
              font-weight: 600;
            }
            .stat-val {
              font-size: 20px;
              font-weight: 750;
              color: #0f172a;
            }
            .content {
              padding: 40px;
            }
            .content h2 {
              font-family: 'Outfit', sans-serif;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #f97316;
              margin-bottom: 24px;
              font-weight: 700;
            }
            .signs-list {
              display: flex;
              flex-direction: column;
            }
            .sign-row {
              display: flex;
              align-items: center;
              padding: 16px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .sign-row:last-child {
              border-bottom: none;
            }
            .sign-num {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: #0f172a;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: 700;
              font-size: 13px;
              margin-right: 18px;
              flex-shrink: 0;
            }
            .sign-info {
              flex-grow: 1;
            }
            .sign-title {
              font-weight: 700;
              font-size: 15px;
              margin-bottom: 3px;
              color: #0f172a;
            }
            .sign-desc {
              font-size: 12px;
              color: #64748b;
            }
            .sign-rating {
              font-weight: 700;
              font-size: 13px;
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 4px 12px;
              border-radius: 9999px;
            }
            .rating-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              display: inline-block;
            }
            .footer {
              text-align: center;
              padding: 24px;
              font-size: 12px;
              color: #94a3b8;
              font-weight: 500;
              border-top: 1px solid #e2e8f0;
              background-color: #f8fafc;
            }
            @media print {
              body { padding: 0; }
              .report-card { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="report-card">
            <div class="header">
              <div class="header-info">
                <div class="logo-badge">
                  <div class="logo-icon">P</div>
                  <span class="logo-text">PardnaBook</span>
                </div>
                <h1>${banker.name}</h1>
                <p>${banker.username} &middot; Trust Assessment Profile</p>
              </div>
              <div class="score-circle">
                ${banker.trustScore}
                <span>Score</span>
              </div>
            </div>
            
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Active Pardnas</div>
                <div class="stat-val">${banker.activePardnas}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Completed</div>
                <div class="stat-val">${banker.completedPardnas}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Member Since</div>
                <div class="stat-val">${banker.memberSince}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Overall Rating</div>
                <div class="stat-val" style="color: ${scoreRingColor(banker.trustScore)}">${banker.overall}</div>
              </div>
            </div>
            
            <div class="content">
              <h2>The 7 Signs of Trust</h2>
              <div class="signs-list">
                ${banker.signs.map((sign, i) => {
                  const color = ratingDot(sign.rating);
                  return `
                    <div class="sign-row">
                      <div class="sign-num">${i + 1}</div>
                      <div class="sign-info">
                        <div class="sign-title">${sign.label}</div>
                        <div class="sign-desc">${sign.desc}</div>
                      </div>
                      <div class="sign-rating" style="color: ${color}; background-color: ${color}10">
                        <span class="rating-dot" style="background-color: ${color}"></span>
                        ${sign.rating}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            
            <div class="footer">
              Generated by PardnaBook Admin &middot; ${formattedDate} &middot; Official Trust Record
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            }
          </script>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(htmlContent);
    win.document.close();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card Header (Premium Dark Panel) */}
        <div className="bg-slate-900 px-6 py-6 text-white flex items-center justify-between relative overflow-hidden">
          {/* Subtle grid pattern in header background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]"></div>

          <div className="relative z-10 flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs">
                P
              </div>
              <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
                PardnaBook Profile
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight truncate leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              {banker.name}
            </h2>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400 font-medium">
                {banker.username}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                banker.status === 'active' 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-red-400 bg-red-500/10 border-red-500/20'
              }`}>
                {banker.status}
              </span>
            </div>
          </div>

          {/* Trust Score Ring */}
          <div className="relative z-10 shrink-0">
            <TrustScoreRing score={banker.trustScore} />
          </div>
        </div>

        {/* Stats Grid (Dashboard Cards style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-100">
          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Active</p>
              <p className="text-sm font-extrabold text-slate-900 leading-none">{banker.activePardnas}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Completed</p>
              <p className="text-sm font-extrabold text-slate-900 leading-none">{banker.completedPardnas}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Joined</p>
              <p className="text-xs font-bold text-slate-900 leading-none">{banker.memberSince}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <Award size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Overall</p>
              <span className={`text-[10px] font-extrabold rounded-full px-1.5 py-0.5 leading-none inline-block border ${ratingBadgeStyle(banker.rating)}`}>
                {banker.overall}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Core Content (7 Signs of Trust) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <h3 className="text-xs font-bold text-orange-500 tracking-widest uppercase mb-1">
            The 7 Signs of Trust
          </h3>

          <div className="space-y-2.5">
            {banker.signs.map((sign, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate leading-tight mb-0.5">{sign.label}</p>
                      <p className="text-xs text-slate-400 truncate leading-none">{sign.desc}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1.5 ${ratingBadgeStyle(sign.rating)}`}>
                    <span 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ backgroundColor: ratingDot(sign.rating) }}
                    />
                    {sign.rating}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all outline-none shadow-sm"
          >
            <Printer size={15} />
            Print Report
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all outline-none shadow-sm"
          >
            <X size={15} />
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BankersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [printTarget, setPrintTarget] = useState<Banker | null>(null);
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 10;

  // Fetch data from API
  const { data: response, isLoading, error } = useGetAdminBankersQuery({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  // Map API data to Banker type
  const mapToBanker = (apiBanker: AdminBanker): Banker => {
    const isSuspended = suspendedIds.has(apiBanker.id);
    // Generate consistent trust score based on banker ID length (for demo)
    const trustScore = Math.max(65, Math.min(96, 80 + (apiBanker.id.charCodeAt(0) % 20)));
    const rating: Rating = trustScore >= 88 ? 'Strong' : trustScore >= 75 ? 'Fair' : 'Weak';
    const overall = trustScore >= 88 ? 'Excellent' : trustScore >= 75 ? 'Average' : 'At Risk';

    return {
      id: apiBanker.id,
      name: `${apiBanker.firstName || ''} ${apiBanker.lastName || ''}`.trim(),
      username: `@${apiBanker.email.split('@')[0]}`,
      pardnas: apiBanker._count.pardnas,
      activePardnas: Math.max(0, apiBanker._count.pardnas - 1),
      completedPardnas: Math.max(0, apiBanker._count.pardnas - 2),
      trustScore,
      rating,
      status: isSuspended ? 'suspended' : 'active',
      memberSince: new Date(apiBanker.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      overall,
      signs: [
        makeSign('Payment Consistency', '90% on-time across cycles', rating),
        makeSign('Timeliness', 'Regular payment schedule maintained', rating),
        makeSign('Post-Payout Behaviour', 'Consistent engagement', rating),
        makeSign('Commitment Duration', `Active since ${new Date(apiBanker.createdAt).getFullYear()}`, rating),
        makeSign('Completion Rate', `${apiBanker._count.pardnas} pardnas`, rating),
        makeSign('Group Stability', `KYC Status: ${apiBanker.kycStatus}`, rating),
        makeSign('Behaviour Trend', 'In good standing', rating),
      ],
    };
  };

  const { daysFilter } = useOutletContext<{ daysFilter: string }>();

  const rawBankers = response?.data ?? [];
  const filteredRawBankers = rawBankers.filter(b => isDateWithinDays(b.createdAt, daysFilter, rawBankers.map(x => x.createdAt)));
  const bankers = filteredRawBankers.map(mapToBanker);
  const totalPages = response?.meta.pagination.totalPages ?? 1;
  const statsData = response?.meta.status ?? { active: 0, suspended: 0, total: 0 };

  const toggleSuspend = (id: string) => {
    setSuspendedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const stats = [
    {
      label: 'Total Bankers',
      value: String(statsData.total),
      iconBg: 'bg-orange-50',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F97316"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M8 7v10M12 7v10M16 7v10" />
        </svg>
      ),
    },
    {
      label: 'Active',
      value: String(statsData.active),
      iconBg: 'bg-emerald-50',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      ),
    },
    {
      label: 'Suspended',
      value: String(statsData.suspended),
      iconBg: 'bg-red-50',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M4.93 4.93l14.14 14.14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Bankers
          </h1>
          <p className="text-sm text-[var(--color-gray-400)] mt-0.5">
            {isLoading ? 'Loading...' : `${statsData.total} total bankers registered`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {stats.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]" />
        <input
          type="text"
          placeholder="Search bankers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Loading bankers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center">
          <p className="text-red-500">Failed to load bankers</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Pardnas</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Member Since</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bankers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No bankers found
                    </td>
                  </tr>
                ) : (
                  bankers.map((banker) => (
                    <tr
                      key={banker.id}
                      className="hover:bg-gray-50 transition-all text-sm text-gray-700"
                    >
                      <td className="px-6 py-4 font-medium">{banker.name}</td>
                      <td className="px-6 py-4 text-gray-500">{banker.username}</td>
                      <td className="px-6 py-4 font-semibold text-orange-600">
                        {banker.pardnas}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleSuspend(banker.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            banker.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {banker.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{banker.memberSince}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setPrintTarget(banker)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-xs font-semibold"
                          title="View Trust Summary"
                        >
                          <Printer size={12} />
                          Trust Card
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {bankers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                Page {page} of {totalPages}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white cursor-pointer"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white cursor-pointer"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Trust Card Modal */}
      {printTarget && <TrustCard banker={printTarget} onClose={() => setPrintTarget(null)} />}
    </div>
  );
}
