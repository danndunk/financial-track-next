import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, Eye, EyeOff, Wallet } from "lucide-react";
import { useState } from "react";

interface SummaryCardProps {
  balance: number;
  income: number;
  expense: number;
}

export function SummaryCard({ balance, income, expense }: SummaryCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="space-y-4">
      <Card className="bg-primary text-primary-foreground border-none shadow-xl relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

        <CardHeader className="pb-2 relative z-10 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-primary-foreground/90 flex items-center gap-2">
            <Wallet size={16} />
            Total Balance
          </CardTitle>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="text-primary-foreground/90 hover:text-primary-foreground transition-colors p-1 rounded-full hover:bg-white/10"
          >
            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold tracking-tight">
            {showBalance ? formatCurrency(balance) : 'Rp ••••••••'}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
             <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-xs text-primary-foreground/80 mb-1">
                    <ArrowDownIcon size={12} /> Income
                </div>
                <div className="font-semibold text-sm">{formatCurrency(income)}</div>
             </div>
             <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-xs text-primary-foreground/80 mb-1">
                    <ArrowUpIcon size={12} /> Expense
                </div>
                <div className="font-semibold text-sm">{formatCurrency(expense)}</div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
