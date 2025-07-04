'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { SidebarCollapseContext } from '@/components/app-sidebar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // Estado global do sidebar
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar:collapsed');
      return stored !=='false';
    }
    return true;
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userExists = !!user;
    setIsAuthenticated(userExists);

    // Redirect logic
    if (!userExists && pathname !== '/auth') {
      router.push('/auth');
    } else if (userExists && pathname === '/auth') {
      router.push('/');
    }
  }, [pathname, router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className='full-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4'></div>
          <p className='muted-text'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page without sidebar/header
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  // Show main layout with sidebar/header
  if (isAuthenticated) {
    const paddingLeft = collapsed ? '4rem' : '280px';
    return (
      <SidebarCollapseContext.Provider value={{ collapsed, setCollapsed }}>
        <AppSidebar />
        <div
          className='flex flex-col h-screen'
          style={{ paddingLeft, transition: 'padding 0.2s' }}
        >
          <AppHeader />
          <main className='flex-1 min-h-0 overflow-auto'>{children}</main>
        </div>
      </SidebarCollapseContext.Provider>
    );
  }

  return null;
}
