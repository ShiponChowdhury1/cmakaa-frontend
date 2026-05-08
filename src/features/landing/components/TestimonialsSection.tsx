import Card from '@/components/ui/Card';

const testimonials = [
  {
    quote: "It finally put method to the madness of running my pardna. Everything is clear and tracked like a professional.",
    name: 'Sharon Metoyer',
    role: 'Pardna Banker, London',
    initials: 'SM',
    gradient: 'from-[#E57432] to-[#FF9C65]',
  },
  {
    quote: "No more arguments about contributions! The payment data is crystal clear. The transparency alone worth it.",
    name: 'Michael Burley',
    role: 'Community Builder, Atlanta',
    initials: 'MB',
    gradient: 'from-[#3B82F6] to-[#60A5FA]',
  },
  {
    quote: "Running my group was stressful before. Now it's so easy and every participant trusts in the system. Highly recommend!",
    name: 'Andrea Clarke',
    role: 'Group Organizer, Toronto',
    initials: 'AC',
    gradient: 'from-[#8B5CF6] to-[#A78BFA]',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#FFEEE4]" id="testimonials">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--color-dark)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Trusted by pardna bankers across the UK, US &amp; Caribbean
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              hover
              className="animate-fade-in-up opacity-0 relative overflow-hidden shadow-md"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1.44px] bg-[linear-gradient(90deg,#E57432_0%,#FF9C65_100%)]" />

              {/* Quote mark */}
              <div className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent mb-4 leading-none">
                "
              </div>

              <p className="text-sm text-[var(--color-gray-500)] leading-relaxed mb-6 italic">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-dark)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-gray-400)]">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

