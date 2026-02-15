import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Flame,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface Market {
  id: number;
  title: string;
  description: string;
  eventType: string;
  category: string;
  endDate: string;
  yesOdds: number;
  noOdds: number;
  totalPool: number;
  volume24h: number;
  participants: number;
  status: string;
  isTrending: boolean;
}

// ─── Hardcoded Mock Markets ────────────────────────────────────────────
const MOCK_MARKETS: Market[] = [
  {
    id: 1,
    title: 'Lakers vs Warriors: Will Lakers win the 2026 NBA Finals?',
    description:
      'Predict whether the Los Angeles Lakers will defeat the Golden State Warriors and win the 2026 NBA Championship Finals.',
    eventType: 'sports',
    category: 'NBA',
    endDate: '2026-06-20T00:00:00Z',
    yesOdds: 62,
    noOdds: 38,
    totalPool: 2450000,
    volume24h: 185000,
    participants: 3842,
    status: 'active',
    isTrending: true,
  },
  {
    id: 2,
    title: 'Will Bitcoin exceed $150,000 by end of 2026?',
    description:
      'Predict whether Bitcoin (BTC) will reach a price above $150,000 USD on any major exchange before December 31, 2026.',
    eventType: 'crypto',
    category: 'Bitcoin',
    endDate: '2026-12-31T00:00:00Z',
    yesOdds: 45,
    noOdds: 55,
    totalPool: 5800000,
    volume24h: 420000,
    participants: 12560,
    status: 'active',
    isTrending: true,
  },
  {
    id: 3,
    title: 'US Presidential Approval Rating above 50% in March 2026?',
    description:
      'Will the sitting US President maintain an approval rating above 50% in major polling averages during March 2026?',
    eventType: 'politics',
    category: 'Politics',
    endDate: '2026-03-31T00:00:00Z',
    yesOdds: 34,
    noOdds: 66,
    totalPool: 1200000,
    volume24h: 95000,
    participants: 5210,
    status: 'active',
    isTrending: false,
  },
  {
    id: 4,
    title: 'Will Ethereum ETF inflows exceed $10B in Q1 2026?',
    description:
      'Predict whether cumulative net inflows into all spot Ethereum ETFs will surpass $10 billion by end of Q1 2026.',
    eventType: 'crypto',
    category: 'Ethereum',
    endDate: '2026-03-31T00:00:00Z',
    yesOdds: 58,
    noOdds: 42,
    totalPool: 3100000,
    volume24h: 275000,
    participants: 7830,
    status: 'active',
    isTrending: true,
  },
  {
    id: 5,
    title: 'Will the S&P 500 close above 6,500 by June 2026?',
    description:
      'Predict whether the S&P 500 index will close above 6,500 points on any trading day before June 30, 2026.',
    eventType: 'finance',
    category: 'Stock Market',
    endDate: '2026-06-30T00:00:00Z',
    yesOdds: 71,
    noOdds: 29,
    totalPool: 1850000,
    volume24h: 132000,
    participants: 4150,
    status: 'active',
    isTrending: false,
  },
  {
    id: 6,
    title: 'Will Japan hold a snap election before September 2026?',
    description:
      'Predict whether the Japanese Prime Minister will dissolve the House of Representatives and call a snap general election before September 2026.',
    eventType: 'politics',
    category: 'Politics',
    endDate: '2026-09-01T00:00:00Z',
    yesOdds: 28,
    noOdds: 72,
    totalPool: 680000,
    volume24h: 42000,
    participants: 1920,
    status: 'active',
    isTrending: false,
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
    NBA: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Bitcoin: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Ethereum: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Politics: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Stock Market': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
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
    <div
      className={`group relative overflow-hidden rounded-xl bg-slate-800/80 border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        market.isTrending
          ? 'border-orange-500/30 hover:border-orange-400/50 hover:shadow-orange-500/10'
          : 'border-slate-700/50 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
      }`}
    >
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

// ─── Markets Page (Dark Theme) ─────────────────────────────────────────
export default function Markets() {
  const [filter, setFilter] = useState<string>('all');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  const filteredMarkets = MOCK_MARKETS.filter((m) => {
    const matchesEventType = filter === 'all' || m.eventType === filter;
    const matchesTrending = !showTrendingOnly || m.isTrending;
    return matchesEventType && matchesTrending;
  });

  const eventTypes = [
    { key: 'all', label: 'All Markets' },
    { key: 'sports', label: 'Sports' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'politics', label: 'Politics' },
    { key: 'finance', label: 'Finance' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Prediction Markets
          </h1>
          <p className="text-lg text-slate-400">
            Bet on real-world events with transparent odds and instant settlement
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {eventTypes.map((type) => (
              <Button
                key={type.key}
                variant={filter === type.key ? 'default' : 'outline'}
                onClick={() => setFilter(type.key)}
                className={`whitespace-nowrap transition-all duration-200 ${
                  filter === type.key
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 border-0'
                    : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border-slate-700/50'
                }`}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Trending Toggle */}
          <div className="flex items-center gap-3 px-1 flex-wrap">
            <Button
              onClick={() => setShowTrendingOnly(!showTrendingOnly)}
              className={`transition-all duration-300 flex items-center gap-2 border-0 ${
                showTrendingOnly
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/20 scale-105'
                  : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border-slate-700/50'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="font-semibold">Trending Markets</span>
              {showTrendingOnly && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-white/20 text-white rounded-full text-xs font-bold">
                  ✓
                </span>
              )}
            </Button>
            {showTrendingOnly && (
              <span className="text-sm text-slate-500">
                Showing {filteredMarkets.length} trending market
                {filteredMarkets.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Markets Grid — unconditional render */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-16">
            <Flame className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-400 mb-2">
              {showTrendingOnly
                ? 'No trending markets found for this filter'
                : 'No markets found for this filter'}
            </p>
            <p className="text-sm text-slate-500">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
