"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { TransactionType, Category } from "@/lib/types";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CurrencyInput } from "@/components/ui/currency-input";
import { cn } from "@/lib/utils";

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Salary', 'Investment', 'Education', 'Housing', 'Other'];

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction, pockets } = useData();
  
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPocketId, setSelectedPocketId] = useState<string>(pockets[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) return;
    if (!selectedPocketId && pockets.length > 0) setSelectedPocketId(pockets[0].id);

    addTransaction({
      amount: Number(amount),
      description,
      type,
      category,
      date: new Date(date).toISOString(),
      pocketId: selectedPocketId
    });

    router.push('/');
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <header className="flex items-center space-x-4">
        <Link href="/">
           <ArrowLeft className="text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Add Transaction</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Type Selector */}
        <div className="flex bg-muted p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={cn(
              "flex-1 py-3 text-sm font-medium rounded-lg transition-all",
              type === 'expense' ? "bg-background text-red-600 dark:text-red-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={cn(
              "flex-1 py-3 text-sm font-medium rounded-lg transition-all",
              type === 'income' ? "bg-background text-green-600 dark:text-green-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Amount</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl font-medium">Rp</span>
             <CurrencyInput
               value={amount}
               onValueChange={setAmount}
               placeholder="0"
               className="w-full pl-12 pr-4 py-4 bg-background text-foreground border border-input rounded-2xl text-3xl font-bold outline-none focus:ring-2 focus:ring-ring"
               required
            />
         </div>
       </div>

       {/* Pocket Selector */}
       <div className="space-y-2">
           <label className="text-sm font-medium text-foreground">Wallet / Pocket</label>
           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
               {pockets.map(pocket => (
                   <button
                       key={pocket.id}
                       type="button"
                       onClick={() => setSelectedPocketId(pocket.id)}
                       className={cn(
                           "flex items-center space-x-2 px-4 py-2 rounded-xl border whitespace-nowrap transition-all",
                           selectedPocketId === pocket.id 
                               ? "border-ring bg-primary/10 ring-1 ring-ring" 
                               : "border-input bg-background hover:bg-muted/50"
                       )}
                   >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pocket.color }} />
                        <span className="text-sm font-medium text-foreground">{pocket.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "py-3 px-2 text-xs border rounded-xl transition-all truncate",
                  category === cat 
                    ? "border-ring bg-primary/10 text-primary font-medium ring-1 ring-ring" 
                    : "border-input text-muted-foreground bg-background hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date</label>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Note (Optional)</label>
          <input 
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a note..."
            className="w-full p-4 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <Check size={20} />
          <span>Save Transaction</span>
        </button>

      </form>
    </div>
  );
}
