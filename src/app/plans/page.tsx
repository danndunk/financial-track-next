"use client";

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2, Calendar, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Category, TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CurrencyInput } from "@/components/ui/currency-input";
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const CATEGORIES: Category[] = ['Bills', 'Education', 'Housing', 'Other', 'Shopping', 'Salary', 'Investment'];

export default function PlansPage() {
  const { plans, addPlan, markPlanAsPaid, deletePlan, updatePlan, pockets, isLoading } = useData();
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<Category>('Bills');
  const [type, setType] = useState<TransactionType>('expense');
  const [pocketId, setPocketId] = useState<string>('');

  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  
  // Deletion Confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<any | null>(null);

  // Payment Confirmation
  const [payConfirmOpen, setPayConfirmOpen] = useState(false);
  const [planToPay, setPlanToPay] = useState<any | null>(null);
  
  // Expanded State for Mobile Actions
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !amount || !date) return;

      addPlan({
          title,
          amount: Number(amount),
          dueDate: new Date(date).toISOString(),
          category,
          type,
          isPaid: false,
          pocketId: pocketId || undefined, // Send pocketId if selected
      });
      setIsAdding(false);
      setTitle('');
      setAmount('');
      setDate('');
      setPocketId('');
  };
  
  const openEdit = (plan: any) => {
    setEditingPlan({
      ...plan,
      dueDate: plan.dueDate.slice(0, 10),
    });
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    await updatePlan(editingPlan.id, {
      title: editingPlan.title,
      amount: Number(editingPlan.amount),
      dueDate: new Date(editingPlan.dueDate).toISOString(),
      category: editingPlan.category,
      type: editingPlan.type,
      isPaid: editingPlan.isPaid,
      pocketId: editingPlan.pocketId || undefined,
    });
    setEditingPlan(null);
  };
  
  const togglePaid = async (plan: any) => {
    if (plan.isPaid) {
      await updatePlan(plan.id, { isPaid: false });
    } else {
      // Prompt for confirmation before marking as paid
      setPlanToPay(plan);
      setPayConfirmOpen(true);
    }
  };

  const confirmPayPlan = async () => {
    if (!planToPay) return;
    await markPlanAsPaid(planToPay.id);
    setPlanToPay(null);
    setPayConfirmOpen(false);
  };
  
  const promptDeletePlan = (plan: any) => {
    setPlanToDelete(plan);
    setDeleteConfirmOpen(true);
  };
  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    await deletePlan(planToDelete.id);
    setPlanToDelete(null);
    setDeleteConfirmOpen(false);
  };
  const cancelDeletePlan = () => {
    setPlanToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const sortedPlans = [...plans].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="p-6 space-y-6 pb-32">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <Link href="/">
                <ArrowLeft className="text-muted-foreground" />
            </Link>
            <h1 className="text-2xl font-bold">Upcoming Plans</h1>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="p-2 bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-colors"
        >
            <Plus size={24} />
        </button>
      </header>

      <AnimatePresence>
      {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-card p-4 rounded-xl shadow-sm border border-border space-y-4 overflow-hidden"
          >
              <h3 className="font-semibold text-sm text-muted-foreground">Add New Plan</h3>
              
              <div className="flex gap-2 mb-2">
                <button 
                    type="button"
                    onClick={() => setType('expense')} 
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", type === 'expense' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-muted text-muted-foreground')}
                >
                    Expense
                </button>
                <button 
                    type="button"
                    onClick={() => setType('income')} 
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-muted text-muted-foreground')}
                >
                    Income
                </button>
              </div>

              <input 
                  placeholder="Title (e.g. House Rent)"  
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-3 bg-muted rounded-lg border-none text-sm"
                  required
              />
              <div className="flex gap-2">
                  <div className="relative flex-1">
                     <CurrencyInput 
                        placeholder="0" 
                        value={amount}
                        onValueChange={setAmount}
                        className="w-full pl-8 p-3 bg-muted rounded-lg border-none text-sm"
                        required
                    />
                  </div>
                  <input 
                        type="date" 
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="flex-1 p-3 bg-muted rounded-lg border-none text-sm"
                        required
                    />
              </div>

              {/* Pocket Selection */}
              <div className="relative">
                <select
                    value={pocketId}
                    onChange={(e) => setPocketId(e.target.value)}
                    className="w-full p-3 bg-muted rounded-lg border-none text-sm appearance-none"
                >
                    <option value="">Select Pocket (Optional)</option>
                    {pockets.map(pocket => (
                        <option key={pocket.id} value={pocket.id}>
                            {pocket.name} ({formatCurrency(pocket.balance)})
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs whitespace-nowrap border",
                            category === cat 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-card text-muted-foreground border-border"
                        )}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm">Add Plan</button>
          </motion.form>
      )}
      </AnimatePresence>

      <div className="space-y-3">
          {sortedPlans.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No upcoming plans.</p>
              </div>
          ) : (
              sortedPlans.map(plan => {
                  const isExpanded = expandedId === plan.id;
                  return (
                  <motion.div 
                    layout
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                    className={cn(
                        "flex flex-col rounded-xl border transition-all cursor-pointer overflow-hidden",
                        plan.isPaid 
                            ? "bg-muted/50 border-border opacity-60" 
                            : "bg-card border-border shadow-sm",
                        isExpanded && "ring-1 ring-primary/20"
                    )}
                  >
                      <div className="flex items-center justify-between p-4 w-full">
                          <div className="flex items-center gap-4">
                              <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePaid(plan);
                                }}
                                className={cn(
                                    "transition-colors",
                                    plan.isPaid ? "text-green-500 dark:text-green-400" : "text-muted-foreground hover:text-green-500 dark:hover:text-green-400"
                                )}
                              >
                                  {plan.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                              </button>
                              <div>
                                  <p className={cn("font-medium text-foreground text-sm", plan.isPaid && "line-through text-muted-foreground")}>{plan.title}</p>
                                  <p className="text-xs text-muted-foreground">Due {formatDate(plan.dueDate)} • {plan.category}</p>
                              </div>
                          </div>
                          <span className={cn(
                              "font-bold text-sm", 
                              plan.isPaid 
                                ? "text-muted-foreground" 
                                : plan.type === 'income' ? "text-green-600 dark:text-green-400" : "text-destructive"
                            )}>
                                {plan.type === 'income' ? '+ ' : '- '} {formatCurrency(plan.amount)}
                          </span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex justify-end items-center gap-3 px-4 pb-4"
                            >
                                <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      openEdit(plan);
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <Pencil size={14} /> Edit
                                </button>
                                <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      promptDeletePlan(plan);
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:text-destructive/80 bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </motion.div>
                        )}
                      </AnimatePresence>
                  </motion.div>
              )})
          )}
      </div>
      
      {editingPlan && (
        <div className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm flex items-end justify-center md:items-center">
          <form onSubmit={handleEditSubmit} className="w-full md:w-[520px] bg-card p-5 rounded-2xl border border-border shadow-2xl space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Edit Plan</h3>
            <div className="flex gap-2 mb-2">
              <button 
                  type="button"
                  onClick={() => setEditingPlan({ ...editingPlan, type: 'expense' })} 
                  className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", editingPlan.type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground')}
              >
                  Expense
              </button>
              <button 
                  type="button"
                  onClick={() => setEditingPlan({ ...editingPlan, type: 'income' })} 
                  className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", editingPlan.type === 'income' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground')}
              >
                  Income
              </button>
            </div>
            <input
              value={editingPlan.title}
              onChange={e => setEditingPlan({ ...editingPlan, title: e.target.value })}
              className="w-full p-3 bg-muted rounded-lg border-none text-sm text-foreground"
              placeholder="Title"
              required
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <CurrencyInput
                  value={editingPlan.amount}
                  onValueChange={(v) => setEditingPlan({ ...editingPlan, amount: v })}
                  placeholder="0"
                  className="w-full pl-8 p-3 bg-muted rounded-lg border-none text-sm text-foreground"
                  required
                />
              </div>
              <input
                type="date"
                value={editingPlan.dueDate}
                onChange={e => setEditingPlan({ ...editingPlan, dueDate: e.target.value })}
                className="flex-1 p-3 bg-muted rounded-lg border-none text-sm text-foreground"
                required
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEditingPlan({ ...editingPlan, category: cat })}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs whitespace-nowrap border",
                    editingPlan.category === cat 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="flex-1 py-3 rounded-xl border border-border bg-muted text-muted-foreground hover:bg-muted/80 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete plan?"
        description={planToDelete ? `Remove plan "${planToDelete.title}" permanently.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeletePlan}
        onCancel={cancelDeletePlan}
      />
      
      <ConfirmDialog
        open={payConfirmOpen}
        title="Mark as Paid?"
        description={planToPay ? `This will create a transaction of ${formatCurrency(planToPay.amount)} from ${planToPay.pocketId ? (pockets.find(p => p.id === planToPay.pocketId)?.name || 'Default Pocket') : 'Default Pocket'}.` : ''}
        confirmText="Pay"
        cancelText="Cancel"
        onConfirm={confirmPayPlan}
        onCancel={() => setPayConfirmOpen(false)}
      />
    </div>
  );
}
