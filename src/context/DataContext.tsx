"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Transaction, Pocket, Plan, Category } from '@/lib/types';
import { useAuth } from './AuthContext';

interface DataContextType {
  transactions: Transaction[];
  pockets: Pocket[];
  plans: Plan[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
  isLoading: boolean;
  
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  addPocket: (pocket: Omit<Pocket, 'id' | 'userId'>) => Promise<void>;
  updatePocket: (id: string, updates: Partial<Pocket>) => Promise<void>;
  deletePocket: (id: string) => Promise<void>;
  
  addPlan: (plan: Omit<Plan, 'id' | 'userId'>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  markPlanAsPaid: (id: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  
  getPocketBalance: (pocketId: string) => number;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) {
        setTransactions([]);
        setPockets([]);
        setPlans([]);
        return;
    }
    
    setIsLoading(true);
    try {
        const res = await fetch(`/api/data?userId=${user.id}`);
        if (res.ok) {
            const data = await res.json();
            setTransactions(data.transactions || []);
            setPockets(data.pockets || []);
            setPlans(data.plans || []);
        } else {
            console.error("Failed to fetch data:", res.status, res.statusText);
        }
    } catch (error) {
        console.error("Failed to fetch data", error);
    } finally {
        setIsLoading(false);
    }
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!user) return;
    await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...transaction, userId: user.id })
    });
    fetchData();
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    fetchData();
  };

  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const addPocket = async (pocket: Omit<Pocket, 'id' | 'userId'>) => {
    if (!user) return;
    await fetch('/api/pockets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pocket, userId: user.id })
    });
    fetchData();
  };

  const updatePocket = async (id: string, updates: Partial<Pocket>) => {
    await fetch(`/api/pockets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    fetchData();
  };

  const deletePocket = async (id: string) => {
    await fetch(`/api/pockets/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const addPlan = async (plan: Omit<Plan, 'id' | 'userId'>) => {
    if (!user) return;
    await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, userId: user.id })
    });
    fetchData();
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    fetchData();
  };

  const markPlanAsPaid = async (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (!plan || plan.isPaid) return;

    // 1. Determine Pocket to use
    // Priority: 1. Plan's specific pocket, 2. First available pocket
    const pocketToUse = plan.pocketId 
        ? pockets.find(p => p.id === plan.pocketId) 
        : pockets[0];

    if (!pocketToUse) {
        // Fallback or Error handling if no pockets exist
        console.error("No pocket available to pay this plan!");
        return;
    }

    // 2. Create Transaction
    await addTransaction({
        amount: plan.amount,
        type: plan.type || 'expense', 
        category: plan.category,
        description: `Plan Payment: ${plan.title}`,
        date: new Date().toISOString(),
        pocketId: pocketToUse.id
    });

    // 3. Update Plan
    await updatePlan(id, { isPaid: true });
  };

  const deletePlan = async (id: string) => {
    await fetch(`/api/plans/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getPocketBalance = (pocketId: string) => {
    return pockets.find(p => p.id === pocketId)?.balance || 0;
  };

  // Derived state
  const balance = pockets.reduce((acc, curr) => acc + curr.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <DataContext.Provider value={{
      transactions,
      pockets,
      plans,
      balance,
      totalIncome,
      totalExpense,
      isLoading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addPocket,
      updatePocket,
      deletePocket,
      addPlan,
      updatePlan,
      markPlanAsPaid,
      deletePlan,
      getPocketBalance,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};
