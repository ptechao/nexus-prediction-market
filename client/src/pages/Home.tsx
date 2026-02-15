import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Hardcoded Mock Markets (displayed directly on homepage) ───────────
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
    title: 'Will Bitcoin exceed $200,000 by end of 2026?',
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
    Politics: 'bg-rose-100 text-rose-800 border-rose-200',
    NBA: 'bg-blue-100 text-blue-800 border-blue-200',
    Bitcoin: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// ─── MarketCard Component ──────────────────────────────────────────────
function MarketCard({ market }: { market: Market }) {
  const handleBet = (side: 'yes' | 'no') => {
    toast.success(
      `Bet ${side.toUpperCase()} on "${market.title}" — connect wallet to confirm.`
    );
  };

  return (
    <Card
      className={`overflow-hidden group transition-all duration-300 bg-white hover:shadow-2xl hover:scale-[1.02] border-2 shadow-md ${
        market.isTrending
          ? 'border-orange-200 hover:border-orange-400 shadow-orange-100'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
        <Badge
          className={`text-xs font-medium border ${getCategoryColor(market.category)}`}
        >
          {market.category}
        </Badge>
        <div className="flex items-center gap-2">
          {market.isTrending && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
              <Flame className="w-3 h-3" />
              Trending
            </span>
          )}
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(market.endDate)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
          {market.title}
        </h3>
        <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
          {market.description}
        </p>

        {/* Odds Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-emerald-600">
              Yes {market.yesOdds}%
            </span>
            <span className="text-sm font-semibold text-red-500">
              No {market.noOdds}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-l-full transition-all duration-500"
              style={{ width: `${market.yesOdds}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-400 to-red-500 rounded-r-full transition-all duration-500"
              style={{ width: `${market.noOdds}%` }}
            />
          </div>
        </div>

        {/* Bet Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Button
            onClick={() => handleBet('yes')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 text-base transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200"
          >
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Bet Yes
          </Button>
          <Button
            onClick={() => handleBet('no')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-5 text-base transition-all duration-200 hover:shadow-lg hover:shadow-red-200"
          >
            <TrendingDown className="w-4 h-4 mr-1.5" />
            Bet No
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">Pool</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {formatPool(market.totalPool)}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">24h Vol</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {formatPool(market.volume24h)}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Users className="w-3 h-3" />
              <span className="text-xs">Traders</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {market.participants.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── MarketList Component ──────────────────────────────────────────────
function MarketList({ markets }: { markets: Market[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Compact Hero */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Predict the Future,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Trade with Confidence
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Join NEXUS — the decentralized prediction market platform. Bet on
            real-world events and copy the strategies of top traders.
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 sm:gap-12 mb-8">
            <div>
              <div className="text-2xl font-bold text-blue-600">$12.5M</div>
              <p className="text-sm text-slate-500">Total Volume</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">5,234</div>
              <p className="text-sm text-slate-500">Active Markets</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">18.2K</div>
              <p className="text-sm text-slate-500">Traders</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hot Markets Section (renders immediately) ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-slate-900">
                Hot Markets
              </h2>
            </div>
            <Link href="/markets" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View All Markets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* MarketList with hardcoded data */}
          <MarketList markets={MOCK_MARKETS} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Predicting?
          </h2>
          <p className="text-lg text-blue-100 mb-6">
            Join thousands of traders on NEXUS and start earning returns today.
          </p>
          <Link href="/markets" className="inline-block">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 text-lg">
              Explore All Markets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
