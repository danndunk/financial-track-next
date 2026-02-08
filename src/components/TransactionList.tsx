import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, ShoppingBag, Coffee, Car, Home, Activity, Briefcase, DollarSign, Zap, HelpCircle } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const CategoryIcons: Record<string, any> = {
  Food: Coffee,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Activity,
  Bills: Zap,
  Health: Activity,
  Salary: Briefcase,
  Investment: DollarSign,
  Other: HelpCircle,
  Housing: Home,
};

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayTransactions.map((transaction) => {
        const Icon = CategoryIcons[transaction.category] || HelpCircle;
        const isExpense = transaction.type === 'expense';

        return (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${isExpense ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600 dark:text-green-400'}`}>
                <Icon size={14} />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{transaction.description || transaction.category}</p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className={`font-semibold text-sm ${isExpense ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
              {isExpense ? '- ' : '+ '}{formatCurrency(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
