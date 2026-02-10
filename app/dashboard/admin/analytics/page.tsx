import TradeAnalytics from '@/components/admin/trade-analytics';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Trade Analytics</h1>
        <p className="text-slate-400 mt-2">Analyze trading performance and patterns</p>
      </div>

      <TradeAnalytics />
    </div>
  );
}
