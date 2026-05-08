import { useState } from 'react';
import { Printer, ChevronLeft, ChevronRight } from 'lucide-react';

type Rating = 'Strong' | 'Fair' | 'Developing' | 'Weak';
type Status = 'active' | 'suspended';

interface Participant {
  id: string;
  name: string;
  username: string;
  pardnas: number;
  trustScore: number;
  rating: Rating;
  status: Status;
}

const ratingOf = (s: number): Rating =>
  s >= 88 ? 'Strong' : s >= 65 ? 'Fair' : s >= 55 ? 'Developing' : 'Weak';

const RAW: Omit<Participant, 'rating'>[] = [
  { id: 'P01', name: 'Tobi Ali',          username: '@tobi_a1',    pardnas: 1, trustScore: 69,  status: 'active' },
  { id: 'P02', name: 'Lola Johnson',       username: '@lola_j2',    pardnas: 2, trustScore: 94,  status: 'active' },
  { id: 'P03', name: 'Niyi Koffi',         username: '@niyi_k3',    pardnas: 4, trustScore: 95,  status: 'active' },
  { id: 'P04', name: 'Lydia Davies',       username: '@lydia_d4',   pardnas: 4, trustScore: 94,  status: 'active' },
  { id: 'P05', name: 'Anthony Martin',     username: '@anthony_m5', pardnas: 3, trustScore: 70,  status: 'active' },
  { id: 'P06', name: 'Akin Clark',         username: '@akin_c6',    pardnas: 3, trustScore: 73,  status: 'active' },
  { id: 'P07', name: 'Stephen Thompson',   username: '@stephen_t7', pardnas: 3, trustScore: 52,  status: 'active' },
  { id: 'P08', name: 'Karen Walker',       username: '@karen_w8',   pardnas: 3, trustScore: 66,  status: 'active' },
  { id: 'P09', name: 'David Mensah',       username: '@david_m9',   pardnas: 5, trustScore: 81,  status: 'active' },
  { id: 'P10', name: 'Rachel Eze',         username: '@rachel_e10', pardnas: 3, trustScore: 91,  status: 'active' },
  { id: 'P11', name: 'Marcus Boateng',     username: '@marcus_b11', pardnas: 2, trustScore: 78,  status: 'active' },
  { id: 'P12', name: 'Sade Adeyemi',       username: '@sade_a12',   pardnas: 4, trustScore: 88,  status: 'active' },
  { id: 'P13', name: 'Funmi Taiwo',        username: '@funmi_t13',  pardnas: 2, trustScore: 60,  status: 'active' },
  { id: 'P14', name: 'Julian Bright',      username: '@julian_b14', pardnas: 1, trustScore: 48,  status: 'suspended' },
  { id: 'P15', name: 'Maya Williams',      username: '@maya_w15',   pardnas: 3, trustScore: 84,  status: 'active' },
];

const PARTICIPANTS: Participant[] = RAW.map(p => ({ ...p, rating: ratingOf(p.trustScore) }));

const ratingStyle: Record<Rating, string> = {
  Strong:     'text-emerald-600 bg-emerald-50 border-emerald-200',
  Fair:       'text-amber-600   bg-amber-50   border-amber-200',
  Developing: 'text-blue-500   bg-blue-50    border-blue-200',
  Weak:       'text-red-500    bg-red-50     border-red-200',
};

const PAGE_SIZE = 10;

export default function ParticipantsTab({ search }: { search: string }) {
  const [data, setData]   = useState(PARTICIPANTS);
  const [page, setPage]   = useState(1);

  const filtered    = data.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSuspend = (id: string) =>
    setData(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' } : p
    ));

  return (
    <div className="space-y-0">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name','Username','Pardnas','Trust','Rating','Status',''].map(h => (
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
                  <td className="px-5 py-3.5 text-sm text-[var(--color-primary)]">{p.username}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-dark)] font-medium">{p.pardnas}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-bold ${
                      p.trustScore >= 88 ? 'text-emerald-600' :
                      p.trustScore >= 65 ? 'text-amber-500' :
                      p.trustScore >= 55 ? 'text-blue-500' : 'text-red-500'
                    }`}>{p.trustScore}</span>
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
                    <div className="flex items-center gap-2">
                      <button
                        title="Print Trust Summary"
                        onClick={() => window.print()}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[var(--color-dark)] hover:bg-gray-100 transition-all cursor-pointer border-none bg-transparent"
                      >
                        <Printer size={15} />
                      </button>
                      <button
                        title={p.status === 'active' ? 'Suspend' : 'Activate'}
                        onClick={() => toggleSuspend(p.id)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer border-none bg-transparent ${
                          p.status === 'active'
                            ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {p.status === 'active' ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>
                          </svg>
                        )}
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
              {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}
            </span>{' '}of{' '}
            <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span> participants
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
    </div>
  );
}
