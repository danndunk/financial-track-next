"use client";

import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoading) {
        if (!user && !isLoginPage) {
            router.push('/login');
        } else if (user && isLoginPage) {
            router.push('/');
        }
    }
  }, [user, isLoading, isLoginPage, router]);

  if (isLoading) {
      return (
          <div className="flex h-screen items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  if (!user && !isLoginPage) return null; // Wait for redirect

  return (
    <main className="max-w-md mx-auto min-h-screen bg-background shadow-2xl overflow-hidden relative">
        <div className={`h-full overflow-y-auto ${!isLoginPage && user ? 'pb-24' : ''}`}>
            {children}
        </div>
        {!isLoginPage && user && <BottomNav />}
    </main>
  );
}
