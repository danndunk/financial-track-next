"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { SummaryCard } from "@/components/SummaryCard";
import MonthlyChart from "@/components/MonthlyChart";
import { TransactionList } from "@/components/TransactionList";
import Link from "next/link";
import { ChevronRight, User, Plus, Wallet, X, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Pocket } from "@/lib/types";

import { CurrencyInput } from "@/components/ui/currency-input";

import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const { user } = useAuth();
  const {
    balance,
    totalIncome,
    totalExpense,
    transactions,
    pockets,
    addPocket,
    updatePocket,
    deletePocket,
  } = useData();

  const [isAddingPocket, setIsAddingPocket] = useState(false);
  const [newPocketName, setNewPocketName] = useState("");
  const [newPocketBalance, setNewPocketBalance] = useState<number | "">("");

  // Edit Pocket State
  const [editingPocket, setEditingPocket] = useState<Pocket | null>(null);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleAddPocket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPocketName) return;

    await addPocket({
      name: newPocketName,
      balance: Number(newPocketBalance) || 0,
      type: "wallet",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
    });
    setIsAddingPocket(false);
    setNewPocketName("");
    setNewPocketBalance("");
  };

  const closeEditModal = () => {
    setEditingPocket(null);
  };

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getGreeting()},{" "}
            <span className="text-primary">{user?.name || "User"}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's your financial summary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-secondary text-secondary-foreground p-2">
            <ModeToggle />
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </header>

      <section>
        <SummaryCard
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />
        <div className="mt-6">
          <MonthlyChart transactions={transactions} />
        </div>
      </section>

      {/* Pockets Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-lg text-foreground">Your Pockets</h2>
          <button
            onClick={() => setIsAddingPocket(!isAddingPocket)}
            className="text-primary text-sm font-medium flex items-center hover:underline"
          >
            <Plus size={16} className="mr-1" /> Add New
          </button>
        </div>

        {isAddingPocket && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            onSubmit={handleAddPocket}
            className="bg-card p-4 rounded-xl space-y-3 border border-border"
          >
            <input
              placeholder="Pocket Name (e.g., Bank Jago)"
              className="w-full p-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              value={newPocketName}
              onChange={(e) => setNewPocketName(e.target.value)}
              required
            />
            <CurrencyInput
              placeholder="Initial Balance"
              className="w-full p-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none"
              value={newPocketBalance}
              onValueChange={setNewPocketBalance}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingPocket(false)}
                className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {pockets.map((pocket) => (
            <div
              key={pocket.id}
              onClick={() => setEditingPocket(pocket)}
              className="min-w-[160px] cursor-pointer bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between h-28 relative overflow-hidden group hover:shadow-md hover:border-primary transition-all"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={60} color={pocket.color} />
              </div>
              <div className="flex items-center space-x-2 z-10">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pocket.color }}
                />
                <span className="font-medium text-sm truncate text-foreground">
                  {pocket.name}
                </span>
              </div>
              <div className="font-bold text-lg z-10 text-foreground">
                {formatCurrency(pocket.balance, true)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">
            Recent Transactions
          </h2>
          <Link
            href="/transactions"
            className="text-sm font-medium text-primary flex items-center hover:underline"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <TransactionList transactions={recentTransactions} />
      </section>

      {/* Edit Pocket Modal */}
      {editingPocket && (
        <EditPocketModal
          pocket={editingPocket}
          onClose={closeEditModal}
          onSave={async (updated) => {
            await updatePocket(editingPocket.id, updated);
            closeEditModal();
          }}
          onDelete={async () => {
            await deletePocket(editingPocket.id);
            closeEditModal();
          }}
        />
      )}
    </div>
  );
}

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function EditPocketModal({
  pocket,
  onClose,
  onSave,
  onDelete,
}: {
  pocket: Pocket;
  onClose: () => void;
  onSave: (p: Partial<Pocket>) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [name, setName] = useState(pocket.name);
  const [balance, setBalance] = useState<number>(pocket.balance);
  const [color, setColor] = useState(pocket.color);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({
      name,
      balance,
      color,
    });
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Edit Pocket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Pocket Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl font-bold text-lg text-foreground outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Balance
            </label>
            <CurrencyInput
              value={balance}
              onValueChange={setBalance}
              className="w-full p-3 bg-muted border border-transparent focus:border-ring rounded-xl font-medium text-foreground outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Color Tag
            </label>
            <div className="flex gap-2 flex-wrap">
              {["#000000", "#EF4444", "#F97316", "#F59E0B", "#84CC16", "#10B981", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-primary' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="p-3 rounded-xl border border-destructive/30 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors"
                title="Delete Pocket"
             >
                <Trash2 size={20} />
             </button>
             <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
             >
                {isLoading ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Pocket?"
        description="Transactions linked to this pocket will remain but might show invalid pocket info."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
