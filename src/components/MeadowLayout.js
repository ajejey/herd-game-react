import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const Cloud = ({ className = '', delay = 0 }) => (
  <svg
    viewBox="0 0 100 50"
    className={className}
    style={{ animation: `meadow-cloud-drift 22s ease-in-out ${delay}s infinite` }}
    aria-hidden="true"
  >
    <ellipse cx="25" cy="32" rx="18" ry="14" fill="#FFFFFF" />
    <ellipse cx="50" cy="26" rx="22" ry="18" fill="#FFFFFF" />
    <ellipse cx="75" cy="32" rx="18" ry="14" fill="#FFFFFF" />
  </svg>
);

export const GrassStrip = ({ className = '' }) => (
  <svg viewBox="0 0 400 24" className={className} preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 24 L0 16 Q5 6 10 16 Q15 4 20 16 Q25 8 30 16 Q35 2 40 16 Q45 8 50 16 Q55 6 60 16 Q65 4 70 16 Q75 8 80 16 Q85 2 90 16 Q95 8 100 16 Q105 6 110 16 Q115 4 120 16 Q125 8 130 16 Q135 2 140 16 Q145 8 150 16 Q155 6 160 16 Q165 4 170 16 Q175 8 180 16 Q185 2 190 16 Q195 8 200 16 Q205 6 210 16 Q215 4 220 16 Q225 8 230 16 Q235 2 240 16 Q245 8 250 16 Q255 6 260 16 Q265 4 270 16 Q275 8 280 16 Q285 2 290 16 Q295 8 300 16 Q305 6 310 16 Q315 4 320 16 Q325 8 330 16 Q335 2 340 16 Q345 8 350 16 Q355 6 360 16 Q365 4 370 16 Q375 8 380 16 Q385 2 390 16 Q395 8 400 16 L400 24 Z" fill="#3D8B5A" />
  </svg>
);

/**
 * MeadowLayout — shared page shell for Blog/FAQ/About (and any future page).
 * Provides cream background, drifting clouds, cow-spot pattern, Navigation, and footer.
 *
 * Pass children to render inside the centered content container.
 */
const MeadowLayout = ({ children, maxWidth = 'max-w-4xl' }) => {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        ...quicksand,
        background:
          'radial-gradient(circle at 12% 18%, #BEE3F8 0%, transparent 35%),' +
          'radial-gradient(circle at 88% 12%, #FFD56B 0%, transparent 30%),' +
          '#FFF8E7'
      }}
    >
      <style>{`
        @keyframes meadow-cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        .meadow-spots-bg {
          background-image:
            radial-gradient(ellipse 18px 12px at 20px 30px, rgba(45,24,16,0.05) 50%, transparent 51%),
            radial-gradient(ellipse 24px 16px at 90px 80px, rgba(45,24,16,0.05) 50%, transparent 51%),
            radial-gradient(ellipse 14px 10px at 150px 40px, rgba(45,24,16,0.05) 50%, transparent 51%);
          background-size: 180px 120px;
        }
      `}</style>

      <div className="meadow-spots-bg absolute inset-0 pointer-events-none" />
      <Cloud className="absolute top-20 left-[6%] w-28 opacity-90 pointer-events-none" delay={0} />
      <Cloud className="absolute top-32 right-[8%] w-36 opacity-90 pointer-events-none" delay={3} />
      <Cloud className="absolute top-72 left-[40%] w-20 opacity-80 pointer-events-none hidden md:block" delay={6} />

      <Navigation />

      <div className={`relative container mx-auto px-4 pt-24 pb-12 ${maxWidth}`}>
        {children}

        <footer className="text-center mt-10 text-[#6B4226] text-sm">
          <p style={fredoka} className="font-semibold">Made with 🐄 in the meadow.</p>
          <p className="opacity-80">&copy; {new Date().getFullYear()} Herd Game. A social party game for everyone.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link to="/privacy-policy" className="hover:text-[#3D8B5A] transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-[#3D8B5A] transition-colors">Terms of Service</Link>
            <Link to="/about-contact" className="hover:text-[#3D8B5A] transition-colors">About / Contact</Link>
            <Link to="/faq" className="hover:text-[#3D8B5A] transition-colors">FAQ</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const fredokaStyle = fredoka;
export default MeadowLayout;
