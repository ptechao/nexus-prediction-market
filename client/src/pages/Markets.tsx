import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Users } from 'lucide-react';

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
  status: string;
  image: string;
}

export default function Markets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Load mock data
    const loadMarkets = async () => {
      try {
        const response = await fetch('/mockData.json');
        const data = await response.json();
        setMarkets(data.markets);
      } catch (error) {
        console.error('Failed to load markets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, []);

  const filteredMarkets = filter === 'all' 
    ? markets 
    : markets.filter(m => m.eventType === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatPool = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'NBA': 'bg-blue-100 text-blue-800',
      'Bitcoin': 'bg-orange-100 text-orange-800',
      'Music': 'bg-purple-100 text-purple-800',
      'Stock Market': 'bg-green-100 text-green-800',
      'Ethereum': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Prediction Markets
          </h1>
          <p className="text-lg text-slate-600">
            Bet on real-world events with transparent odds and instant settlement
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="whitespace-nowrap"
          >
            All Markets
          </Button>
          <Button
            variant={filter === 'sports' ? 'default' : 'outline'}
            onClick={() => setFilter('sports')}
            className="whitespace-nowrap"
          >
            Sports
          </Button>
          <Button
            variant={filter === 'crypto' ? 'default' : 'outline'}
            onClick={() => setFilter('crypto')}
            className="whitespace-nowrap"
          >
            Crypto
          </Button>
          <Button
            variant={filter === 'entertainment' ? 'default' : 'outline'}
            onClick={() => setFilter('entertainment')}
            className="whitespace-nowrap"
          >
            Entertainment
          </Button>
          <Button
            variant={filter === 'finance' ? 'default' : 'outline'}
            onClick={() => setFilter('finance')}
            className="whitespace-nowrap"
          >
            Finance
          </Button>
        </div>

        {/* Markets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <Card
                key={market.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                {/* Market Image */}
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={market.image}
                    alt={market.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={getCategoryColor(market.category)}>
                      {market.category}
                    </Badge>
                  </div>
                </div>

                {/* Market Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                    {market.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {market.description}
                  </p>

                  {/* Odds Display */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-slate-600 mb-1">Yes Odds</div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xl font-bold text-green-600">
                          {market.yesOdds}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-xs text-slate-600 mb-1">No Odds</div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-xl font-bold text-red-600">
                          {market.noOdds}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Pool</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatPool(market.totalPool)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Ends</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatDate(market.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                  >
                    Place Bet
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              No markets found for this filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
