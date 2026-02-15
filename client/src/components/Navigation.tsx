import { Link, useLocation } from 'wouter';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp, Users, Home } from 'lucide-react';

export function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            NEXUS
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`flex items-center gap-2 font-medium transition-colors ${
              isActive('/') 
                ? 'text-blue-600' 
                : 'text-slate-600 hover:text-slate-900'
            }`}>
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/markets" className={`flex items-center gap-2 font-medium transition-colors ${
              isActive('/markets') 
                ? 'text-blue-600' 
                : 'text-slate-600 hover:text-slate-900'
            }`}>
              <TrendingUp className="w-4 h-4" />
              Markets
            </Link>
            <Link href="/leaderboard" className={`flex items-center gap-2 font-medium transition-colors ${
              isActive('/leaderboard') 
                ? 'text-blue-600' 
                : 'text-slate-600 hover:text-slate-900'
            }`}>
              <Users className="w-4 h-4" />
              Leaderboard
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
