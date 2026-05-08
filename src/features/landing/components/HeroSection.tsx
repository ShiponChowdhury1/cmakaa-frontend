import { Link } from 'react-router-dom';
import bannerImg from '@/assets/images/banner.png';
import { Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-[#FFEEE4]" id="hero">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-100/60 via-violet-50/40 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-50/40 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] mb-4 tracking-wide uppercase">
              <Shield size={16} />
              Built for community savings groups
            </p>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-dark)] leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your pardnabook,{' '}
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
                properly tracked
              </span>
            </h1>

            <p className="text-lg text-[var(--color-gray-500)] leading-relaxed max-w-lg mb-8">
              PardnaBook helps you manage community savings groups with trust and
              transparency. Track contributions, manage payouts, and build
              confidence with a system everyone can rely on.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all no-underline"
              >
               Start Your First Pardna
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-[var(--color-primary)] border-2 border-[var(--color-primary)]/30 rounded-lg hover:bg-[var(--color-primary-50)] transition-all no-underline"
              >
              I Already Have an Account
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#F59E0B', '#3B82F6', '#10B981'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {['S', 'M', 'A'][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-gray-400)]">
                Trusted by pardna bankers across the UK, US & Caribbean
              </p>
            </div>
          </div>

          {/* Right: Banner Image */}
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-violet-200/20 rounded-3xl blur-2xl" />
            <img
              src={bannerImg}
              alt="Diverse community members using PardnaBook"
              className="relative w-full max-w-lg mx-auto rounded-2xl animate-float"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(108, 43, 217, 0.15))' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
