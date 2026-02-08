"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, List, ShieldCheck, Calendar, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from '@/components/mode-toggle';

export function BottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/transactions', icon: List, label: 'History' },
    { href: '/add', icon: PlusCircle, label: 'Add', highlight: true },
    { href: '/plans', icon: Calendar, label: 'Plans' },
  ];

  if (user?.role === 'admin') {
      links.push({ href: '/admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-primary" : "text-muted-foreground",
                link.highlight && "text-primary"
              )}
            >
              {link.highlight ? (
                 <div className="bg-primary text-primary-foreground p-3 rounded-full -mt-6 shadow-lg border-4 border-background">
                   <Icon size={24} />
                 </div>
              ) : (
                <Icon size={24} />
              )}
              {!link.highlight && <span className="text-xs font-medium">{link.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground"
          aria-label="Logout"
        >
          <LogOut size={24} />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
