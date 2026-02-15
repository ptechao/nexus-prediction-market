import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';

interface Leader {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  roi: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  vaultSize: number;
  description: string;
  badges: string[];
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'roi' | 'winRate' | 'followers'>('roi');

  useEffect(() => {
    // Load mock data
    const loadLeaders = async () => {
      try {
        const response = await fetch('/mockData.json');
        const data = await response.json();
        setLeaders(data.leaders);
      } catch (error) {
        console.error('Failed to load leaders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaders();
  }, []);

  const sortedLeaders = [...leaders].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return b.roi - a.roi;
      case 'winRate':
        return b.winRate - a.winRate;
      case 'followers':
        return b.followers - a.followers;
      default:
        return 0;
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'verified': 'bg-blue-100 text-blue-800',
      'top_trader': 'bg-yellow-100 text-yellow-800',
      'elite': 'bg-purple-100 text-purple-800',
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeLabel = (badge: string) => {
    const labels: Record<string, string> = {
      'verified': '✓ Verified',
      'top_trader': '⭐ Top Trader',
      'elite': '👑 Elite',
    };
    return labels[badge] || badge;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-slate-900">
              Top Traders
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Follow the most successful traders and copy their strategies
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={sortBy === 'roi' ? 'default' : 'outline'}
            onClick={() => setSortBy('roi')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Best ROI
          </Button>
          <Button
            variant={sortBy === 'winRate' ? 'default' : 'outline'}
            onClick={() => setSortBy('winRate')}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Win Rate
          </Button>
          <Button
            variant={sortBy === 'followers' ? 'default' : 'outline'}
            onClick={() => setSortBy('followers')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Most Followed
          </Button>
        </div>

        {/* Leaders Table */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLeaders.map((leader, index) => (
              <Card
                key={leader.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Leader Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {leader.name}
                            </h3>
                            <span className="text-sm text-slate-500">
                              {leader.handle}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {leader.description}
                          </p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mb-3">
                        {leader.badges.map((badge) => (
                          <Badge
                            key={badge}
                            className={getBadgeColor(badge)}
                          >
                            {getBadgeLabel(badge)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">ROI</div>
                        <div className="text-2xl font-bold text-green-600">
                          +{leader.roi.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Win Rate</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {(leader.winRate * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Trades</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {leader.totalTrades}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Followers</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {formatNumber(leader.followers)}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                      >
                        Copy Trade
                      </Button>
                    </div>
                  </div>

                  {/* Vault Info */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      Vault Size: <span className="font-semibold text-slate-900">
                        ${(leader.vaultSize / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedLeaders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              No traders found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
