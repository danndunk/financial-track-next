"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Wallet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
      setLoading(false);
    }
    // Redirect happens in AppShell
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="bg-primary p-4 rounded-2xl shadow-xl shadow-primary/20 mb-4">
            <Wallet className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">FinTrack</h1>
        <p className="text-muted-foreground mt-2">Manage your wealth wisely</p>
      </motion.div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="w-full max-w-sm space-y-4"
      >
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-secondary border border-transparent focus:border-input rounded-xl focus:ring-2 focus:ring-ring outline-none transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="Enter username"
                required
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-secondary border border-transparent focus:border-input rounded-xl focus:ring-2 focus:ring-ring outline-none transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="Enter password"
                required
            />
        </div>

        {error && <p className="text-destructive text-sm text-center">{error}</p>}

        <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex justify-center items-center"
        >
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"/> : 'Login'}
        </button>
      </motion.form>
    </div>
  );
}
