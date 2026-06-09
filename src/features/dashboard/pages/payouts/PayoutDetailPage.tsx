import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {
  useGetPayoutByIdQuery,
  useConfirmPayoutMutation,
} from '@/store/features/createPardna/createPardna.api';
import { format } from 'date-fns';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Landmark,
  User,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

export default function PayoutDetailPage() {
  const { payoutId = '' } = useParams<{ payoutId: string }>();
  const navigate = useNavigate();

  const { data: payout, isLoading, error, refetch } = useGetPayoutByIdQuery(payoutId, {
    skip: !payoutId,
  });

  const [confirmPayout, { isLoading: isConfirming }] = useConfirmPayoutMutation();
  const [notes, setNotes] = useState('');
  const [isConfirmingMode, setIsConfirmingMode] = useState(false);

  const handleConfirm = async () => {
    if (!payout) return;
    try {
      await confirmPayout({
        pardnaId: payout.participant.pardnaId,
        roundId: payout.roundId,
        participantId: payout.participantId,
        notes: notes || 'N/A',
      }).unwrap();
      toast.success('Payout confirmed successfully!');
      setIsConfirmingMode(false);
      setNotes('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to confirm payout');
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
        <p className="text-gray-500 font-medium">Loading payout details...</p>
      </div>
    );
  }

  if (error || !payout) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-semibold text-lg">Failed to load payout details</p>
        <p className="text-gray-500 text-sm max-w-sm">Please check your connection and try again.</p>
        <button
          onClick={() => navigate('/dashboard/payouts')}
          className="px-5 py-2.5 rounded-xl text-white font-medium bg-[#E57432] border-none cursor-pointer"
        >
          Back to Payout History
        </button>
      </div>
    );
  }

  const isCompleted = payout.status === 'CONFIRMED';
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'P';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 max-w-2xl mx-auto">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/payouts')}
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Payout Details
          </h1>
          <p className="text-xs text-gray-400">Detailed overview of the round payout transaction</p>
        </div>
      </div>

      {/* ── Payout Summary Card ──────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        {/* Status indicator bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5" 
          style={{ background: isCompleted ? '#10B981' : '#F59E0B' }}
        />

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mt-2 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
        </div>

        <p className="text-4xl font-extrabold text-[var(--color-dark)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          £{Number(payout.amount).toLocaleString()}
        </p>
        
        <div className="flex gap-2 items-center mt-2.5">
          <span 
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isCompleted 
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' 
                : 'bg-amber-50 border border-amber-100 text-amber-600'
            }`}
          >
            {payout.status}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            Round {payout.round.roundNumber}
          </span>
        </div>

        {isCompleted && payout.confirmedAt && (
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Completed on {format(new Date(payout.confirmedAt), 'dd MMM yyyy, hh:mm a')}
          </p>
        )}
      </div>

      {/* ── Confirm Payout Inline Panel ─────────────── */}
      {!isCompleted && (
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          {!isConfirmingMode ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  This payout is pending confirmation. Make sure <strong>{payout.participant.fullName}</strong> received their funds before completing.
                </p>
              </div>
              <button
                onClick={() => setIsConfirmingMode(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90 shrink-0"
                style={{ background: '#16A34A' }}
              >
                Confirm Payout Complete
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-normal">
                  You are recording this payout in the ledger as completed. This action cannot be undone. Please ensure the transaction is completed on your side.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add payout details or reference (optional)..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-gray-400 outline-none focus:border-[#E57432] transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setIsConfirmingMode(false);
                    setNotes('');
                  }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer border border-gray-200 bg-white text-[var(--color-dark)] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="px-5 py-2.5 rounded-xl text-white font-semibold text-xs cursor-pointer border-none transition-opacity hover:opacity-90 bg-[#16A34A] disabled:opacity-50"
                >
                  {isConfirming ? 'Confirming...' : 'Yes, Confirm Payout'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Recipient & Banker Details ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recipient info */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <User className="w-4 h-4 text-orange-400" />
            Recipient Details
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#344966] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              {getInitials(payout.participant.fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-[var(--color-dark)] leading-tight">
                {payout.participant.fullName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Payout Order: #{payout.participant.payoutOrder}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="font-semibold text-[var(--color-dark)]">{payout.participant.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phone</span>
              <span className="font-semibold text-[var(--color-dark)]">{payout.participant.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="font-bold text-emerald-600">{payout.participant.status}</span>
            </div>
          </div>
        </div>

        {/* Confirmation status / Banker Info */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verification
          </h2>

          {isCompleted ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 leading-tight">Confirmed By</p>
                  <p className="text-base font-bold text-[var(--color-dark)] mt-0.5">
                    {payout.confirmedBy ? `${payout.confirmedBy.firstName} ${payout.confirmedBy.lastName}` : 'System Banker'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="font-semibold text-[var(--color-dark)]">Bank Transfer / Ledger Record</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Notes / Reference</span>
                  <span className="font-medium text-gray-700 bg-gray-50 rounded-xl px-3 py-2 mt-1 block">
                    {payout.notes || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-6 text-gray-400">
              <Clock className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Unconfirmed Payout</p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">
                This payout record has not been validated by the banker yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Pardna & Round Details ─────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Landmark className="w-4 h-4 text-blue-400" />
          Pardna & Round Context
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-gray-400" />
              <div className="text-xs">
                <p className="text-gray-400 leading-tight">Pardna Group</p>
                <p className="font-bold text-[var(--color-dark)] mt-0.5">{payout.round.pardna.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-gray-400" />
              <div className="text-xs">
                <p className="text-gray-400 leading-tight">Round Status / Cycle</p>
                <p className="font-bold text-[var(--color-dark)] mt-0.5">
                  Round {payout.round.roundNumber} of {payout.round.pardna.totalRounds} (Active Round: {payout.round.pardna.currentRound})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div className="text-xs">
                <p className="text-gray-400 leading-tight">Contribution per Participant</p>
                <p className="font-bold text-[var(--color-dark)] mt-0.5">
                  £{Number(payout.round.pardna.contribution).toLocaleString()} · {payout.round.pardna.frequency}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="text-xs">
                <p className="text-gray-400 leading-tight">Collection Date</p>
                <p className="font-bold text-[var(--color-dark)] mt-0.5">
                  {format(new Date(payout.round.collectionDate), 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="text-xs">
                <p className="text-gray-400 leading-tight">Scheduled Payout Date</p>
                <p className="font-bold text-[var(--color-dark)] mt-0.5">
                  {format(new Date(payout.round.payoutDate), 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-gray-400" />
              <div className="text-xs">
                <p className="text-gray-400 leading-tight">Group Created</p>
                <p className="font-bold text-[var(--color-dark)] mt-0.5">
                  {format(new Date(payout.round.pardna.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
