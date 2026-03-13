import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show navbar on dashboard routes, they have their own sidebar
  if (location.pathname.startsWith('/dashboard')) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#9F7AEA] flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Icon icon="heroicons:sparkles" className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              AI Project Gallery
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-white bg-primary hover:bg-primary-hover transition-colors font-medium px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                <Icon icon="heroicons:squares-2x2" className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-white bg-primary hover:bg-primary-hover transition-colors font-medium px-3 py-2.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                <span className="hidden sm:inline">Log in</span>
                <Icon icon="ic:baseline-login" className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
