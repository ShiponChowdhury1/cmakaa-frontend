import type { NewPardnaFormData } from '../types';
import {
  Clock, Calendar, Users, PartyPopper, Wallet, TrendingUp,
  PoundSterling, ArrowRight, ListOrdered
} from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onGoHome: () => void;
}

export default function StepDone({ data, onGoHome }: Props) {
  const numParticipants = data.participants.filter((p) => p.name.trim()).length || 1;
  const contribution = Number(data.contributionAmount) || 0;
  const totalPot = contribution * numParticipants;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Celebration icon + heading */}
      <div className="flex flex-col items-center text-center pt-8 pb-4">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 relative"
          style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)', boxShadow: '0 12px 40px rgba(229,116,50,0.3)' }}
        >
          <span className="text-4xl">🎉</span>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-white/20 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Pardna Created! 🚀
        </h2>
        <p className="text-sm text-[#64748B] mt-2 max-w-sm leading-relaxed">
          <strong className="text-[var(--color-dark)]">{data.name || 'Your pardna'}</strong> is ready to go. Invite your group whenever you're ready.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-[var(--color-dark)]">{data.name || 'Untitled Pardna'}</h3>
          {data.description && <p className="text-xs text-[#64748B] mt-1 italic">"{data.description}"</p>}
        </div>

        {/* Total pot */}
        <div className="mx-5 mb-4 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Total Pot / Round</p>
                <p className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  £{totalPot.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-white/80">
                <TrendingUp size={12} />
                <span className="text-[10px] font-bold">BREAKDOWN</span>
              </div>
              <p className="text-xs text-white/90 mt-1 font-medium">£{contribution.toLocaleString()} × {numParticipants}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
          {[
            { icon: <PoundSterling size={16} />, label: 'CONTRIBUTION', value: `£${contribution.toLocaleString()}` },
            { icon: <Calendar size={16} />, label: 'FREQUENCY', value: data.frequency || '—' },
            { icon: <Users size={16} />, label: 'PARTICIPANTS', value: `${numParticipants}` },
            {
              icon: <Calendar size={16} />,
              label: 'STARTS ON',
              value: data.startDate
                ? new Date(data.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—',
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none', borderRight: i % 2 === 0 ? '1px solid #F1F5F9' : 'none' }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#E57432] shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-[#94A3B8]">{stat.label}</p>
                <p className="text-sm font-bold text-[var(--color-dark)] capitalize mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draw order */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ListOrdered size={14} className="text-[#E57432]" />
          <p className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase">Payout Order</p>
        </div>
        <div className="space-y-0">
          {data.participants.filter((p) => p.name.trim()).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: '#E57432' }}
              >
                {i + 1}
              </span>
              <p className="text-sm font-semibold text-[var(--color-dark)]">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back to dashboard */}
      <button
        onClick={onGoHome}
        className="w-full py-4 rounded-2xl text-sm font-bold cursor-pointer transition-all border-none hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)', color: 'white' }}
      >
        Go to Dashboard
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
