import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Flame,
  DollarSign,
  BarChart3,
  Users,
  Calendar,
  Zap,
  Shield,
  Copy,
  Droplets,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── MOCK_MARKETS: Hardcoded data, no API dependency ───────────────────
interface Market {
  id: number;
  title: string;
  description: string;
  category: string;
  endDate: string;
  yesOdds: number;
  noOdds: number;
  totalPool: number;
  volume24h: number;
  participants: number;
  isTrending: boolean;
}

const MOCK_MARKETS: Market[] = [
  {
    id: 1,
    title: 'Trump vs Biden: Who wins the 2028 Presidential Election?',
    description:
      'Predict whether Donald Trump or Joe Biden will win the 2028 US Presidential Election. Market resolves based on certified election results.',
    category: 'Politics',
    endDate: '2028-11-05T00:00:00Z',
    yesOdds: 56,
    noOdds: 44,
    totalPool: 8200000,
    volume24h: 650000,
    participants: 24300,
    isTrending: true,
  },
  {
    id: 2,
    title: 'Lakers vs Warriors: Will Lakers win the 2026 NBA Finals?',
    description:
      'Predict whether the Los Angeles Lakers will defeat the Golden State Warriors and win the 2026 NBA Championship Finals.',
    category: 'NBA',
    endDate: '2026-06-20T00:00:00Z',
    yesOdds: 62,
    noOdds: 38,
    totalPool: 2450000,
    volume24h: 185000,
    participants: 3842,
    isTrending: true,
  },
  {
    id: 3,
    title: 'Will BTC exceed $200,000 by end of 2026?',
    description:
      'Predict whether Bitcoin (BTC) will reach a price above $200,000 USD on any major exchange before December 31, 2026.',
    category: 'Bitcoin',
    endDate: '2026-12-31T00:00:00Z',
    yesOdds: 38,
    noOdds: 62,
    totalPool: 5800000,
    volume24h: 420000,
    participants: 12560,
    isTrending: true,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatPool = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Politics: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    NBA: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Bitcoin: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };
  return colors[category] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
};

// ─── MarketCard (Dark Theme) ───────────────────────────────────────────
function MarketCard({ market }: { market: Market }) {
  const handleBet = (side: 'yes' | 'no') => {
    toast.success(
      `Bet ${side.toUpperCase()} on "${market.title}" — connect wallet to confirm.`
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.02]">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="relative px-5 py-3 flex items-center justify-between border-b border-slate-700/50 bg-slate-800/50">
        <Badge className={`text-xs font-medium border ${getCategoryColor(market.category)}`}>
          {market.category}
        </Badge>
        <div className="flex items-center gap-2">
          {market.isTrending && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm shadow-orange-500/30">
              <Flame className="w-3 h-3" />
              Hot
            </span>
          )}
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(market.endDate)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5">
        <h3 className="font-semibold text-lg text-white mb-2 leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {market.title}
        </h3>
        <p className="text-sm text-slate-400 mb-5 line-clamp-2 leading-relaxed">
          {market.description}
        </p>

        {/* Odds Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-emerald-400">
              Yes {market.yesOdds}%
            </span>
            <span className="text-sm font-semibold text-red-400">
              No {market.noOdds}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-700 overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-500"
              style={{ width: `${market.yesOdds}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-500 to-red-400 rounded-r-full transition-all duration-500"
              style={{ width: `${market.noOdds}%` }}
            />
          </div>
        </div>

        {/* Bet Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Button
            onClick={() => handleBet('yes')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 text-base transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 border-0"
          >
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Bet Yes
          </Button>
          <Button
            onClick={() => handleBet('no')}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-5 text-base transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 border-0"
          >
            <TrendingDown className="w-4 h-4 mr-1.5" />
            Bet No
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">Pool</span>
            </div>
            <span className="text-sm font-bold text-slate-200">
              {formatPool(market.totalPool)}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">24h Vol</span>
            </div>
            <span className="text-sm font-bold text-slate-200">
              {formatPool(market.volume24h)}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
              <Users className="w-3 h-3" />
              <span className="text-xs">Traders</span>
            </div>
            <span className="text-sm font-bold text-slate-200">
              {market.participants.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page (Dark Crypto Theme) ─────────────────────────────────────
export default function Home() {
  // NO loading checks, NO API dependency — renders immediately
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            <span className="text-white">Predict the Future,</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trade with Confidence
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Join NEXUS — the decentralized prediction market platform. Bet on
            real-world events and copy the strategies of top traders.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-14 mb-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">$12.5M</div>
              <p className="text-sm text-slate-500">Total Volume</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">5,234</div>
              <p className="text-sm text-slate-500">Active Markets</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">18.2K</div>
              <p className="text-sm text-slate-500">Traders</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hot Markets — unconditional render ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">Hot Markets</h2>
            </div>
            <Link
              href="/markets"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View All Markets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Directly map MOCK_MARKETS — no conditionals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_MARKETS.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Why Choose NEXUS?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Instant Settlement',
                desc: 'Bets resolved instantly on-chain with transparent oracle verification.',
                color: 'text-yellow-400',
              },
              {
                icon: Shield,
                title: 'Secure & Audited',
                desc: 'Smart contracts audited by leading security firms for maximum safety.',
                color: 'text-emerald-400',
              },
              {
                icon: Copy,
                title: 'Copy Trading',
                desc: 'Follow top traders and replicate their winning strategies automatically.',
                color: 'text-cyan-400',
              },
              {
                icon: Droplets,
                title: 'High Liquidity',
                desc: 'Deep order books and tight spreads for optimal trading conditions.',
                color: 'text-blue-400',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto text-center py-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Predicting?
          </h2>
          <p className="text-lg text-slate-300 mb-6">
            Join thousands of traders on NEXUS and start earning returns today.
          </p>
          <Link href="/markets" className="inline-block">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-6 px-8 text-lg border-0 shadow-lg shadow-cyan-500/20">
              Explore All Markets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
