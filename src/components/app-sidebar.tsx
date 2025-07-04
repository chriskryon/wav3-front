'use client';

import {
  Coins,
  CreditCard,
  Home,
  ShoppingCart,
  Wallet,
  User,
  LogOut,
  PiggyBank,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import logo from '../app/logo.svg';

const menuItems = [
  {
    title: 'Overview',
    url: '/',
    icon: Home,
  },
  {
    title: 'Assets',
    url: '/assets',
    icon: Coins,
  },
  {
    title: 'Crypto Wallet',
    url: '/wallets',
    icon: Wallet,
  },
  {
    title: 'Banking Account',
    url: '/banking-account',
    icon: PiggyBank,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Cards',
    url: '/cards',
    icon: CreditCard,
  },
];

// Sempre mostra o menu de profile como último item
const profileMenuItem = { title: 'Profile', url: '/profile', icon: User };
const activeItems = [...menuItems, profileMenuItem];

// Contexto para estado do sidebar
export const SidebarCollapseContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
} | null>(null);

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const sidebarCtx = useContext(SidebarCollapseContext);
  const collapsed = sidebarCtx?.collapsed ?? true;
  const setCollapsed = sidebarCtx?.setCollapsed ?? (() => {});

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar:collapsed', String(collapsed));
    }
  }, [collapsed]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth');
  };

  return (
    <aside
      className={`transition-all duration-200 flex flex-col shadow-lg border-r border-black/10 bg-white/90 backdrop-blur-md fixed top-0 left-0 h-screen z-30 ${collapsed ? 'w-20 min-w-0' : 'sidebar-width min-w-[280px]'} overflow-hidden`}
    >
      {/* Logo WAV3 - centralizado e maior quando colapsado */}
      <div
        className={`flex items-center justify-center border-b border-black/10 h-20 ${collapsed ? 'p-0' : 'p-4 justify-between'}`}
      >
        <div className='rounded-xl flex items-center justify-center overflow-hidden w-full'>
          <Image
            src={logo}
            alt='WAV3 Logo'
            width={collapsed ? 56 : 64}
            height={collapsed ? 56 : 64}
            className='object-contain transition-all duration-200'
          />
        </div>
        {/* {!collapsed && (
					<div className="ml-2">
						<h1 className="text-xl font-semibold text-main">Wav3</h1>
						<p className="text-sm muted-text">Dashboard</p>
					</div>
				)} */}
      </div>

      {/* Navigation */}
      <nav className='flex-1 flex flex-col items-center py-6 px-0'>
        <ul className='space-y-2 w-full flex flex-col items-center'>
          {activeItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li key={item.title} className='w-full flex justify-center'>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 rounded-lg smooth-transition font-medium w-12 h-12 justify-center ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                      : 'text-main hover:bg-black/5 hover:text-primary hover:shadow-sm'
                  }
									${collapsed ? '' : 'w-full px-4 justify-start'} transition-all duration-200`}
                >
                  <item.icon className='w-5 h-5' />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Botão de colapso acima do avatar do usuário */}
      <div className='flex flex-col items-center w-full gap-2 pb-4'>
        <Button
          variant='ghost'
          size='icon'
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          className='mb-2'
        >
          {collapsed ? (
            <svg
              width='20'
              height='20'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <title>Expand sidebar</title>
              <path d='M9 18l6-6-6-6' />
            </svg>
          ) : (
            <svg
              width='20'
              height='20'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <title>Collapse sidebar</title>
              <path d='M15 6l-6 6 6 6' />
            </svg>
          )}
        </Button>
        <div
          className={`flex items-center gap-2 w-full px-2 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center'>
            <User className='w-5 h-5' />
          </div>
          {!collapsed && userData && (
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium text-main truncate'>
                {userData.name || userData.email}
              </div>
              <div className='text-xs muted-text'>
                {userData.hasBetaAccount ? 'Verified' : 'Profile Incomplete'}
              </div>
            </div>
          )}
          {/* Botão de logout só aparece expandido */}
          {!collapsed && (
            <Button
              onClick={handleLogout}
              variant='ghost'
              size='icon'
              aria-label='Logout'
              className='ml-auto text-red-600 hover:text-red-700'
            >
              <LogOut className='w-5 h-5' />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function useSidebarCollapse() {
  const context = useContext(SidebarCollapseContext);
  if (!context) {
    throw new Error(
      'useSidebarCollapse must be used within a SidebarCollapseProvider',
    );
  }
  return context;
}
