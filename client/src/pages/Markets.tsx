import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Users, Flame, DollarSign, BarChart3 } from 'lucide-react';
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
    description: 'Predict whether the Los Angeles Lakers will defeat the Golden State Warriors and win the 2026 NBA Championship Finals.',
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
    description: 'Predict whether Bitcoin (BTC) will reach a price above $150,000 USD on any major exchange before December 31, 2026.',
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
    description: 'Will the sitting US President maintain an approval rating above 50% in major polling averages during March 2026?',
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
    description: 'Predict whether cumulative net inflows into all spot Ethereum ETFs will surpass $10 billion by end of Q1 2026.',
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
    description: 'Predict whether the S&P 500 index will close above 6,500 points on any trading day before June 30, 2026.',
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
    description: 'Predict whether the Japanese Prime Minister will dissolve the House of Representatives and call a snap general election before September 2026.',
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

// ─── Helper Functions ──────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatPool = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    NBA: 'bg-blue-100 text-blue-800 border-blue-200',
    Bitcoin: 'bg-orange-100 text-orange-800 border-orange-200',
    Ethereum: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Politics: 'bg-rose-100 text-rose-800 border-rose-200',
    'Stock Market': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// ─── MarketCard Component ──────────────────────────────────────────────
function MarketCard({ market }: { market: Market }) {
  const handleBet = (side: 'yes' | 'no') => {
    toast.success(`Bet ${side.toUpperCase()} on "${market.title}" — connect wallet to confirm.`);
  };

  return (
    <Card
      className={`overflow-hidden group transition-all duration-300 bg-white ${
        market.isTrending
          ? 'hover:shadow-2xl hover:scale-[1.02] border-2 border-orange-200 hover:border-orange-400 shadow-orange-100 shadow-md'
          : 'hover:shadow-xl hover:scale-[1.01] border border-slate-200'
      }`}
    >
      {/* Header Bar */}
      <div className={`px-5 py-3 flex items-center justify-between ${
        market.isTrending
          ? 'bg-gradient-to-r from-orange-50 to-red-50'
          : 'bg-slate-50'
      }`}>
        <Badge className={`text-xs font-medium border ${getCategoryColor(market.category)}`}>
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
        {/* Title */}
        <h3 className="font-semibold text-lg text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
          {market.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
          {market.description}
        </p>

        {/* Odds Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-emerald-600">Yes {market.yesOdds}%</span>
            <span className="text-sm font-semibold text-red-500">No {market.noOdds}%</span>
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

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">Pool</span>
            </div>
            <span className="text-sm font-bold text-slate-700">{formatPool(market.totalPool)}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">24h Vol</span>
            </div>
            <span className="text-sm font-bold text-slate-700">{formatPool(market.volume24h)}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Users className="w-3 h-3" />
              <span className="text-xs">Traders</span>
            </div>
            <span className="text-sm font-bold text-slate-700">{market.participants.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Markets Page ──────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Prediction Markets
          </h1>
          <p className="text-lg text-slate-600">
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
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-white hover:bg-slate-50'
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
              className={`transition-all duration-300 flex items-center gap-2 ${
                showTrendingOnly
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="font-semibold">Trending Markets</span>
              {showTrendingOnly && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-white text-orange-500 rounded-full text-xs font-bold">
                  ✓
                </span>
              )}
            </Button>
            {showTrendingOnly && (
              <span className="text-sm text-slate-500">
                Showing {filteredMarkets.length} trending market{filteredMarkets.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-16">
            <Flame className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-500 mb-2">
              {showTrendingOnly
                ? 'No trending markets found for this filter'
                : 'No markets found for this filter'}
            </p>
            <p className="text-sm text-slate-400">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
