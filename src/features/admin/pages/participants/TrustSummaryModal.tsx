import { useRef } from 'react';
import { X, Printer } from 'lucide-react';

type Rating = 'Strong' | 'Fair' | 'Developing' | 'Weak';

interface Participant {
  id: string;
  name: string;
  username: string;
  pardnas: number;
  trustScore: number;
  rating: Rating;
  status: 'active' | 'suspended';
}

interface Props {
  participant: Participant;
  onClose: () => void;
}

/* ── helpers ── */
const scoreColor = (s: number) =>
  s >= 88 ? '#16A34A' : s >= 65 ? '#F59E0B' : s >= 55 ? '#3B82F6' : '#EF4444';

const scoreRingColor = (s: number) =>
  s >= 88 ? '#16A34A' : s >= 65 ? '#E57432' : s >= 55 ? '#3B82F6' : '#EF4444';

const ratingLabel = (s: number): Rating =>
  s >= 88 ? 'Strong' : s >= 65 ? 'Fair' : s >= 55 ? 'Developing' : 'Weak';

const ratingDot = (r: Rating) => {
  switch (r) {
    case 'Strong': return '#16A34A';
    case 'Fair':   return '#F59E0B';
    case 'Developing': return '#3B82F6';
    case 'Weak':   return '#EF4444';
  }
};

/* ── 7 Signs of Trust ── */
const TRUST_SIGNS: { label: string; description: string }[] = [
  { label: 'Payment Consistency', description: 'Payment punctuality' },
  { label: 'Timeliness',          description: 'Cycle completion record' },
  { label: 'Post-Payout Behaviour', description: 'Do they keep paying after receiving payout?' },
  { label: 'Commitment Duration',  description: 'Do they complete full pardna cycles?' },
  { label: 'Completion Rate',      description: 'How many pardnas started vs completed?' },
  { label: 'Group Stability',      description: 'Are they part of stable groups?' },
  { label: 'Behaviour Trend',      description: 'Are they improving over time?' },
];

function getSignRating(trustScore: number, index: number): Rating {
  // Derive individual sign ratings from the overall trust score with some variation
  const offsets = [-8, 0, 2, -2, 1, 3, -1];
  const adjusted = Math.max(0, Math.min(100, trustScore + offsets[index]));
  return ratingLabel(adjusted);
}

/* ── Trust Score Ring SVG ── */
function TrustScoreRing({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = scoreRingColor(score);

  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      {/* Background ring */}
      <circle cx="48" cy="48" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="5" />
      {/* Progress ring */}
      <circle
        cx="48" cy="48" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference - progress}`}
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* Score text */}
      <text x="48" y="45" textAnchor="middle" fontSize="28" fontWeight="800" fill={color}>
        {score}
      </text>
      <text x="48" y="62" textAnchor="middle" fontSize="8" fontWeight="500" fill="#94A3B8">
        / 100
      </text>
    </svg>
  );
}

/* ── Modal ── */
export default function TrustSummaryModal({ participant, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const overallRating = ratingLabel(participant.trustScore);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=500,height=800');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Trust Summary - ${participant.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', system-ui, sans-serif; padding: 24px; color: #1E293B; }
            .print-content { max-width: 460px; margin: 0 auto; }
          </style>
        </head>
        <body><div class="print-content">${printContent}</div></body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(5,10,20,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-fade-in"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable card content */}
        <div ref={printRef} style={{ overflowY: 'auto', flex: 1 }}>
          {/* Header */}
          <div style={{ background: '#1B2A41', padding: '24px 24px 20px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#E57432', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700',
              }}>P</div>
              <span style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>PardnaBook</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '2px' }}>
              {participant.name}
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>
              {participant.username} · Trust Summary Card
            </p>

            {/* Trust Score Ring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
              <TrustScoreRing score={participant.trustScore} />
              <div>
                <p style={{ fontSize: '16px', fontWeight: '700' }}>Trust Score</p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>Composite behavioural rating</p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '0', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
          }}>
            <div style={{ padding: '14px 24px', borderRight: '1px solid #E2E8F0' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                Active Pardnas
              </p>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>{participant.pardnas}</p>
            </div>
            <div style={{ padding: '14px 24px' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                Completed
              </p>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>0</p>
            </div>
            <div style={{ padding: '14px 24px', borderRight: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                Member Since
              </p>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Sept 2025</p>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                Overall
              </p>
              <p style={{ fontSize: '15px', fontWeight: '700', color: scoreColor(participant.trustScore) }}>
                {overallRating === 'Weak' ? 'At Risk' : overallRating}
              </p>
            </div>
          </div>

          {/* 7 Signs of Trust */}
          <div style={{ background: '#fff', padding: '20px 24px' }}>
            <h3 style={{
              fontSize: '13px', fontWeight: '800', color: '#E57432',
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              The 7 Signs of Trust
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {TRUST_SIGNS.map((sign, i) => {
                const signRating = getSignRating(participant.trustScore, i);
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 0',
                      borderBottom: i < TRUST_SIGNS.length - 1 ? '1px solid #F1F5F9' : 'none',
                    }}
                  >
                    {/* Number badge */}
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: '#1B2A41', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '700', flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>

                    {/* Label + description */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>{sign.label}</p>
                      <p style={{ fontSize: '11px', color: '#94A3B8' }}>{sign.description}</p>
                    </div>

                    {/* Rating dot + label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: ratingDot(signRating),
                      }} />
                      <span style={{
                        fontSize: '12px', fontWeight: '600',
                        color: ratingDot(signRating),
                      }}>
                        {signRating}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            background: '#F8FAFC', padding: '12px 24px',
            textAlign: 'center', borderTop: '1px solid #E2E8F0',
          }}>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>
              Issued by PardnaBook Admin · {formattedDate} · Behavioural trust assessment
            </p>
          </div>
        </div>

        {/* Action bar — fixed at bottom */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '12px', padding: '14px 24px',
          background: '#fff', borderTop: '1px solid #E2E8F0',
        }}>
          <button
            onClick={handlePrint}
            title="Print"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border border-gray-200 bg-white text-[var(--color-dark)] hover:bg-gray-50 transition-all"
          >
            <Printer size={15} />
            Print
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none text-[var(--color-dark)] hover:bg-gray-100 transition-all bg-transparent"
          >
            <X size={15} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
