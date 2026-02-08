"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (newUser: Omit<User, 'id'>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session
  useEffect(() => {
    const sessionUser = localStorage.getItem('fintrack_session_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: pass })
        });

        if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem('fintrack_session_user', JSON.stringify(userData));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Login failed", error);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fintrack_session_user');
    router.push('/login');
  };

  const registerUser = async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        return res.ok;
    } catch (error) {
        console.error("Registration failed", error);
        return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
