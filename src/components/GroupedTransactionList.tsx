import { Transaction } from "@/lib/types";
import { formatCurrency, formatDay, formatDate } from "@/lib/utils";
import {
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Activity,
  Briefcase,
  DollarSign,
  Zap,
  HelpCircle,
  GraduationCap,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState } from "react";

interface GroupedTransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
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
  Education: GraduationCap,
};

export function GroupedTransactionList({
  transactions,
  onDelete,
  onEdit,
}: GroupedTransactionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No transactions found.</p>
      </div>
    );
  }

  // Group by date
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const dateKey = transaction.date.split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(transaction);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  );

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="space-y-6 pb-20">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <div className="sticky top-0 bg-background py-2 z-10 flex justify-between items-end px-1">
            <h3 className="font-bold text-foreground">{formatDay(date)}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDate(date)}
            </span>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {grouped[date].map((transaction, index) => {
              const Icon = CategoryIcons[transaction.category] || HelpCircle;
              const isExpense = transaction.type === "expense";
              const isLast = index === grouped[date].length - 1;
              const isExpanded = expandedId === transaction.id;

              return (
                <div
                  key={transaction.id}
                  className={`cursor-pointer transition-colors ${!isLast ? "border-b border-border" : ""} ${isExpanded ? "bg-muted/50" : "hover:bg-muted/20"}`}
                  onClick={() =>
                    setExpandedId(isExpanded ? null : transaction.id)
                  }
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2.5 rounded-full ${isExpense ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600 dark:text-green-400"}`}
                      >
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {transaction.category}
                        </p>
                        {transaction.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`text-center font-semibold text-sm ${isExpense ? "text-destructive" : "text-green-600 dark:text-green-400"}`}
                    >
                      {isExpense ? "- " : "+ "}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  {isExpanded && (onDelete || onEdit) && (
                    <div className="flex justify-end items-center gap-4 px-4 pb-4 pt-0">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(transaction);
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(transaction.id);
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:text-destructive/80 bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
