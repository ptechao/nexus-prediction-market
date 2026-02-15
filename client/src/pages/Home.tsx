import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Zap, Shield, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
                  Predict the Future,
                  <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Trade with Confidence
                  </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg">
                  Join NEXUS, the decentralized prediction market platform where you can bet on real-world events and copy the strategies of top traders.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/markets" className="inline-block">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-8 text-lg flex items-center justify-center gap-2">
                    Explore Markets
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/leaderboard" className="inline-block">
                  <Button variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-900 font-semibold py-6 px-8 text-lg">
                    View Top Traders
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <div className="text-2xl font-bold text-blue-600">$12.5M</div>
                  <p className="text-sm text-slate-600">Total Volume</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">5,234</div>
                  <p className="text-sm text-slate-600">Active Markets</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">18.2K</div>
                  <p className="text-sm text-slate-600">Traders</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-10 blur-3xl" />
              <div className="relative h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600 font-semibold">Real-time Market Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose NEXUS?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of prediction markets with advanced features and seamless blockchain integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Instant Settlement
              </h3>
              <p className="text-slate-600">
                Bets are resolved instantly on-chain with transparent oracle verification.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Secure & Audited
              </h3>
              <p className="text-slate-600">
                Smart contracts audited by leading security firms for maximum safety.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Copy Trading
              </h3>
              <p className="text-slate-600">
                Automatically follow top traders and replicate their winning strategies.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                High Liquidity
              </h3>
              <p className="text-slate-600">
                Deep order books and tight spreads for optimal trading conditions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-2xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">
                Connect Wallet
              </h3>
              <p className="text-slate-600 text-center">
                Connect your Web3 wallet using RainbowKit. We support MetaMask, WalletConnect, and more.
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-1 bg-gradient-to-r from-blue-600 to-transparent" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-2xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">
                Deposit USDC
              </h3>
              <p className="text-slate-600 text-center">
                Deposit USDC into your vault to start betting or following top traders.
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-1 bg-gradient-to-r from-blue-600 to-transparent" />
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-2xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">
                Start Trading
              </h3>
              <p className="text-slate-600 text-center">
                Place bets on markets or copy trades from top performers automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Predicting?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of traders on NEXUS and start earning returns today.
          </p>
          <Link href="/markets" className="inline-block">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 text-lg">
              Explore Markets Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
