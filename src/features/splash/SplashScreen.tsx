import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'splash-logo 1.2s ease-out forwards',
        }}
      >
        {/* Logo Icon */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(229, 116, 50, 0.5))',
          }}
        >
          <path
            d="M26 4C13.85 4 4 13.85 4 26s9.85 22 22 22"
            stroke="url(#splash-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: 70,
              strokeDashoffset: 70,
              animation: 'splashStroke 1s 0.3s ease forwards',
            }}
          />
          <defs>
            <linearGradient id="splash-grad" x1="4" y1="26" x2="26" y2="48">
              <stop offset="0%" stopColor="#E57432" />
              <stop offset="100%" stopColor="#FF9C65" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo Text */}
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#FF9C65',
            opacity: 0,
            animation: 'splash-text 0.8s 0.6s ease forwards',
            letterSpacing: '-0.02em',
          }}
        >
          PardnaBook
        </span>
      </div>

      <style>{`
        @keyframes splashStroke {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
