import Card from '@/components/ui/Card';
import { BookOpen, Clock, Eye, TrendingUp } from 'lucide-react';

const topFeatures = [
  {
    icon: <BookOpen size={22} />,
    title: 'Secure Ledger',
    description: 'Every contribution is recorded with timestamps and confirmation — a clear record everyone can trust.',
  },
  {
    icon: <Clock size={22} />,
    title: 'Reminders to Ranki...',
    description: 'Automated payment reminders so no contributor misses their turn to keep the cycle running smoothly.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Trust Score',
    description: 'Build reputation with a transparent scoring system that rewards consistency and on-time payments.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Self Audit Trail',
    description: 'Comprehensive audit history to maintain transparency, resolve disputes, and satisfy compliance needs.',
  },
];

const bottomFeatures = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Easy Setup',
    description: 'Get your pardna group running in minutes',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7v10M12 7v10M16 7v10" />
      </svg>
    ),
    title: 'Clear Records',
    description: 'Transparent contribution tracking for all',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 14h4" />
      </svg>
    ),
    title: 'Group Payment',
    description: 'Coordinate payouts fairly and efficiently',
  },
];

export default function FeaturesSection() {
  const topFeatureCardStyle = {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 1.03px 2.06px -1.03px #0000001A, 0px 1.03px 3.09px 0px #0000001A',
  };

  return (
    <section className="py-24 bg-[#FFEEE4]" id="features">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--color-dark)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Everything a banker needs
          </h2>
          <p className="text-[var(--color-gray-500)] leading-relaxed">
            Built specifically for pardna organisers — the tools you need to run your savings circle with ease, confidence, and trust.
          </p>
        </div>

        {/* Top Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 stagger-children">
          {topFeatures.map((feature) => (
            <Card key={feature.title} variant="elevated" className="animate-fade-in-up opacity-0 group border-0 relative overflow-hidden" style={topFeatureCardStyle}>
              <div className="absolute left-0 top-0 bottom-0 w-[2.44px] rounded-l-[var(--radius-lg)] bg-[linear-gradient(90deg,#E57432_0%,#FF9C65_100%)]" />
              <div className="w-12 h-12 rounded-xl bg-[linear-gradient(90deg,#E57432_0%,#FF9C65_100%)] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-[var(--color-dark)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-gray-500)] leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Bottom Highlight Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {bottomFeatures.map((feature) => (
            <div key={feature.title} className="text-center animate-fade-in-up opacity-0 bg-white rounded-xl p-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-[var(--color-dark)] mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-gray-500)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
