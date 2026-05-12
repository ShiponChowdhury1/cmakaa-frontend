import { useState } from 'react';
import { Printer, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import TrustSummaryModal from './TrustSummaryModal';
import { useGetAdminParticipantsQuery } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminParticipant } from '@/store/features/adminDashboard/adminDashboardApi.types';

type Rating = 'Strong' | 'Fair' | 'Developing' | 'Weak';
type Status = 'active' | 'suspended';

interface Participant {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  pardnas: number;
  trustScore: number;
  rating: Rating;
  status: Status;
  joinedAt: string;
}

const ratingOf = (s: number): Rating =>
  s >= 88 ? 'Strong' : s >= 65 ? 'Fair' : s >= 55 ? 'Developing' : 'Weak';

const ratingStyle: Record<Rating, string> = {
  Strong:     'text-emerald-600 bg-emerald-50 border-emerald-200',
  Fair:       'text-amber-600   bg-amber-50   border-amber-200',
  Developing: 'text-blue-500   bg-blue-50    border-blue-200',
  Weak:       'text-red-500    bg-red-50     border-red-200',
};

const PAGE_SIZE = 10;

export default function ParticipantsTab({ search }: { search: string }) {
  const [page, setPage] = useState(1);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Fetch data from API
  const { data: response, isLoading, isError } = useGetAdminParticipantsQuery({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  // Map API data to Participant type
  const mapToParticipant = (apiParticipant: AdminParticipant): Participant => {
    const trustScore = apiParticipant.trustScore.compositeScore;
    // Map trust score to 0-100 range if needed, currently compositeScore is 0-10
    const scaledTrustScore = trustScore * 10;
    
    return {
      id: apiParticipant.id,
      name: apiParticipant.fullName,
      username: `@${apiParticipant.email.split('@')[0]}`,
      email: apiParticipant.email,
      phoneNumber: apiParticipant.phoneNumber,
      pardnas: 1, // API doesn't provide count, default to 1
      trustScore: scaledTrustScore,
      rating: ratingOf(scaledTrustScore),
      status: (apiParticipant.status.toLowerCase() as Status),
      joinedAt: apiParticipant.joinedAt,
    };
  };

  const participants = response?.data.map(mapToParticipant) ?? [];
  const pagination = response?.meta.pagination;
  const totalItems = pagination?.total ?? participants.length;
  const totalPages = pagination?.totalPages ?? 1;

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(0, PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      // In a real app, call API to delete
      console.log('Delete participant:', id);
    }
  };

  return (
    <div className="space-y-0">
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          Loading participants...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load participants data.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Name','Email','Phone','Pardnas','Trust','Rating','Status',''].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-semibold ${p.status === 'suspended' ? 'text-gray-400 line-through' : 'text-[var(--color-dark)]'}`}>{p.name}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[var(--color-primary)]">{p.email}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{p.phoneNumber}</td>
                      <td className="px-5 py-3.5 text-sm text-[var(--color-dark)] font-medium">{p.pardnas}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-bold ${
                          p.trustScore >= 88 ? 'text-emerald-600' :
                          p.trustScore >= 65 ? 'text-amber-500' :
                          p.trustScore >= 55 ? 'text-blue-500' : 'text-red-500'
                        }`}>{Math.round(p.trustScore)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ratingStyle[p.rating]}`}>{p.rating}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          p.status === 'active'
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                            : 'text-red-500 bg-red-50 border-red-200'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/* Print / View Trust Summary */}
                          <button
                            title="View Trust Summary"
                            onClick={() => setSelectedParticipant(p)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                          >
                            <Printer size={15} />
                          </button>
                          {/* Delete */}
                          <button
                            title="Delete Participant"
                            onClick={() => handleDelete(p.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer border-none bg-transparent"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-[var(--color-gray-400)]">
                Showing{' '}
                <span className="font-semibold text-[var(--color-dark)]">
                  {totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)}
                </span>{' '}of{' '}
                <span className="font-semibold text-[var(--color-dark)]">{totalItems}</span> participants
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={14}/> Previous
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${n===page?'bg-[var(--color-primary)] text-white':'text-[var(--color-gray-500)] hover:bg-gray-100'}`}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed">
                  Next <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Trust Summary Modal */}
      {selectedParticipant && (
        <TrustSummaryModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </div>
  );
}
