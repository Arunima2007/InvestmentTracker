/**
 * Navbar – top navigation bar with brand, user greeting, and logout.
 */

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/5"
         style={{ borderRadius: 0 }}>
      {/* Brand */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer bg-transparent border-none">
        <span className="text-2xl">💎</span>
        <span className="gradient-text text-xl font-bold tracking-tight">InvestWise</span>
      </button>

      {/* Right side */}
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-text-secondary text-sm hidden sm:inline">
            Hey, <span className="text-brand-300 font-medium">{user?.name || 'Investor'}</span>
          </span>
          <button
            onClick={handleLogout}
            className="cursor-pointer px-4 py-1.5 rounded-lg text-sm font-medium
                       bg-white/5 text-text-secondary border border-white/10
                       hover:bg-danger hover:text-white hover:border-danger
                       transition-smooth"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
