import StatCard from "@/components/cards/StatCard";

import {
  Wallet,
  TrendingUp,
  BadgeDollarSign,
  CircleDollarSign,
} from "lucide-react";

interface Props {
  stats: {
    storeValue: number;
    potentialSalesValue: number;
    potentialProfit: number;
    outstanding: number;
  };
}

export default function FinancialOverview({
  stats,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

      <StatCard
        title="Store Value"
        value={`₦${stats.storeValue.toLocaleString()}`}
        icon={<Wallet size={28} />}
        variant="default"
      />

      <StatCard
        title="Sales Value"
        value={`₦${stats.potentialSalesValue.toLocaleString()}`}
        icon={<TrendingUp size={28} />}
        variant="success"
      />

      <StatCard
        title="Potential Profit"
        value={`₦${stats.potentialProfit.toLocaleString()}`}
        icon={<BadgeDollarSign size={28} />}
        variant="warning"
      />

      <StatCard
        title="Outstanding"
        value={`₦${stats.outstanding.toLocaleString()}`}
        icon={<CircleDollarSign size={28} />}
        variant="danger"
      />

    </div>
  );
}