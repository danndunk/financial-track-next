"use client";

import { useData } from "@/context/DataContext";
import { GroupedTransactionList } from "@/components/GroupedTransactionList";
import { ArrowLeft, Filter, X, ChevronDown, Calendar, Check } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { TransactionType, Category, CATEGORIES, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/currency-input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function TransactionsPage() {
  const { transactions, pockets, deleteTransaction, updateTransaction } = useData();
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterPocket, setFilterPocket] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Edit State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (filterPocket !== 'all' && t.pocketId !== filterPocket) return false;
      if (dateRange.start && t.date < dateRange.start) return false;
      if (dateRange.end && t.date > dateRange.end) return false; // Note: simplified date comparison
      return true;
    });
  }, [transactions, filterType, filterCategory, filterPocket, dateRange]);

  const handleDelete = async (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
        await deleteTransaction(transactionToDelete);
        setTransactionToDelete(null);
        setDeleteConfirmOpen(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-24">
      <header className="flex items-center justify-between sticky top-0 bg-background z-20 py-2">
        <div className="flex items-center space-x-4">
            <Link href="/">
                <ArrowLeft className="text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">History</h1>
        </div>
        <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn("p-2 rounded-full transition-colors", showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground")}
        >
            <Filter size={20} />
        </button>
      </header>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-card p-4 rounded-2xl space-y-4 animate-in slide-in-from-top-2 border border-border">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full p-2 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as any)}
                        className="w-full p-2 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                    >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Pocket</label>
                <select 
                    value={filterPocket}
                    onChange={(e) => setFilterPocket(e.target.value)}
                    className="w-full p-2 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                >
                    <option value="all">All Pockets</option>
                    {pockets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                    <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        className="w-full p-2 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">End Date</label>
                    <input 
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        className="w-full p-2 bg-background border border-input rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button 
                    onClick={() => {
                        setFilterType('all');
                        setFilterCategory('all');
                        setFilterPocket('all');
                        setDateRange({ start: '', end: '' });
                    }}
                    className="text-xs text-primary font-medium hover:underline"
                >
                    Reset Filters
                </button>
            </div>
        </div>
      )}

      <GroupedTransactionList 
        transactions={filteredTransactions} 
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Edit Modal */}
      {editingTransaction && (
          <EditTransactionModal 
            transaction={editingTransaction} 
            onClose={closeEditModal}
            onSave={async (updated) => {
                await updateTransaction(editingTransaction.id, updated);
                closeEditModal();
            }}
            pockets={pockets}
          />
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Transaction?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}

function EditTransactionModal({ transaction, onClose, onSave, pockets }: { transaction: Transaction, onClose: () => void, onSave: (t: Partial<Transaction>) => Promise<void>, pockets: any[] }) {
    const [amount, setAmount] = useState<number>(transaction.amount);
    const [description, setDescription] = useState(transaction.description);
    const [type, setType] = useState<TransactionType>(transaction.type);
    const [category, setCategory] = useState<Category>(transaction.category);
    const [date, setDate] = useState(transaction.date.split('T')[0]);
    const [pocketId, setPocketId] = useState(transaction.pocketId);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave({
            amount,
            description,
            type,
            category,
            date: new Date(date).toISOString(),
            pocketId
        });
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-border">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">Edit Transaction</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     {/* Type */}
                     <div className="flex bg-muted p-1 rounded-xl">
                        <button type="button" onClick={() => setType('expense')} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", type === 'expense' ? "bg-destructive/10 text-destructive shadow-sm" : "text-muted-foreground")}>Expense</button>
                        <button type="button" onClick={() => setType('income')} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", type === 'income' ? "bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm" : "text-muted-foreground")}>Income</button>
                     </div>

                     {/* Amount */}
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount</label>
                        <CurrencyInput value={amount} onValueChange={setAmount} className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl font-bold text-lg text-foreground outline-none" required />
                     </div>

                     {/* Pocket */}
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Pocket</label>
                        <select value={pocketId} onChange={e => setPocketId(e.target.value)} className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl text-foreground outline-none">
                            {pockets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                     </div>

                     {/* Category */}
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl text-foreground outline-none">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>

                     {/* Date */}
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl text-foreground outline-none" />
                     </div>

                     {/* Description */}
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Note</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl text-foreground outline-none" />
                     </div>

                     <button disabled={isLoading} type="submit" className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-xl mt-4 transition-opacity">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                     </button>
                </form>
            </div>
        </div>
    )
}
