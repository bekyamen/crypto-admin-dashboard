import TradePanel from '@/components/trading/trade-panel';
import { Card } from '@/components/ui/card';

export default function TradingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Bitcoin Trading</h1>
        <p className="text-slate-400 mt-2">Predict Bitcoin price movements and earn profits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Panel */}
        <div className="lg:col-span-2">
          <TradePanel />
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="font-bold text-slate-100 mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div>
                <p className="font-medium text-slate-300">1. Select Direction</p>
                <p>Choose BUY if price goes UP, SELL if it goes DOWN</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">2. Set Amount & Time</p>
                <p>Choose your bet amount and time frame</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">3. Execute Trade</p>
                <p>Place your trade and wait for results</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">4. Get Result</p>
                <p>Win or lose based on price movement</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-slate-800 p-6">
            <h3 className="font-bold text-slate-100 mb-4">Returns by Duration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">30 seconds</span>
                <span className="text-green-400 font-semibold">+25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">60 seconds</span>
                <span className="text-green-400 font-semibold">+18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">90 seconds</span>
                <span className="text-green-400 font-semibold">+15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">180 seconds</span>
                <span className="text-green-400 font-semibold">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">300 seconds</span>
                <span className="text-green-400 font-semibold">+10%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
