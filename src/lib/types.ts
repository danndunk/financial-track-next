export type TransactionType = 'income' | 'expense';

export type Category = 'Food' | 'Transport' | 'Shopping' | 'Entertainment' | 'Bills' | 'Health' | 'Salary' | 'Investment' | 'Housing' | 'Education' | 'Other';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Salary', 'Investment', 'Housing', 'Education', 'Other'];

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Pocket {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: 'bank' | 'wallet' | 'ewallet';
  color: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string; // ISO string
  pocketId: string;
}

export interface Plan {
  id: string;
  userId: string;
  title: string;
  amount: number;
  dueDate: string; // ISO string
  category: Category;
  type: TransactionType; // 'income' or 'expense'
  isPaid: boolean;
  pocketId?: string;
}

export interface FinancialData {
  transactions: Transaction[];
  pockets: Pocket[];
  plans: Plan[];
}
