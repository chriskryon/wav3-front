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
  ArrowLeftRight,
  Landmark,
  ReceiptText,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import logo from '../app/logo.svg';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
    icon: Landmark,
  },
  {
    title: 'Exchange',
    url: '/exchange',
    icon: ArrowLeftRight,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ReceiptText,
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
      className={`transition-all duration-500 ease-in-out transform flex flex-col shadow-lg border-r border-black/10 bg-white/90 backdrop-blur-md fixed top-0 left-0 h-screen z-30 ${collapsed ? 'w-20 min-w-0 -translate-x-0' : 'sidebar-width min-w-[280px] translate-x-0'} overflow-hidden`}
    >
      {/* Logo WAV3 - centralizado e maior quando colapsado */}
      <div
        className={`flex items-center justify-center border-b border-black/10 h-20 ${collapsed ? 'p-2' : 'p-6 justify-between'}`}
      >
        <div className='rounded-xl flex items-center justify-center overflow-hidden w-full'>
          <Image
            src={logo}
            alt='WAV3 Logo'
            width={collapsed ? 48 : 64}
            height={collapsed ? 48 : 64}
            className='object-contain transition-all duration-500 ease-in-out'
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 flex flex-col items-center py-4 px-2'>
        <ul className='space-y-2 w-full flex flex-col items-center'>
          {activeItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li key={item.title} className='w-full flex justify-center'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 rounded-lg smooth-transition font-medium w-10 h-10 justify-center ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-md'
                          : 'text-main hover:bg-black/5 hover:text-primary hover:shadow-md'
                      }
                    ${collapsed ? '' : 'w-full px-4 justify-start'} transition-all duration-500 ease-in-out`}
                    >
                      <item.icon className='w-5 h-5' />
                      {!collapsed && <span className='text-sm'>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Botão de colapso acima do avatar do usuário */}
      <div className='flex flex-col items-center w-full gap-4 pb-6'>
        {/* Collapse/Expand Button */}
        <Button
          variant='ghost'
          size='icon'
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          className={`mb-2 rounded-full transition-colors border border-black/10 bg-white shadow-md hover:bg-primary/10`}
        >
          {collapsed ? (
            <svg
              width='22'
              height='22'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
              className='transition-transform duration-500 ease-in-out'
            >
              <title>Expand sidebar</title>
              <path d='M9 6l6 6-6 6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          ) : (
            <svg
              width='22'
              height='22'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
              className='transition-transform duration-500 ease-in-out'
            >
              <title>Collapse sidebar</title>
              <path d='M15 6l-6 6 6 6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          )}
        </Button>

        {/* User Info & Logout */}
        <button
          type="button"
          className={`flex items-center gap-3 w-full px-3 ${collapsed ? 'justify-center' : ''} cursor-pointer focus:outline-none`}
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/profile';
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (typeof window !== 'undefined') {
                window.location.href = '/profile';
              }
            }
          }}
          aria-label="Go to profile"
        >
          <div className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md'>
            <User className='w-5 h-5' />
          </div>
          {!collapsed && userData && (
            <div className='flex-1 min-w-0 animate-fade-in '>
              <div className='text-sm font-medium text-main truncate'>
                {userData.name || userData.email}
              </div>
              <div className='text-xs text-muted'>
                {userData.hasBetaAccount ? 'Verified' : 'Profile Incomplete'}
              </div>
            </div>
          )}
          {/* Logout button only when expanded */}
          {!collapsed && (
            <Button
              onClick={handleLogout}
              variant='ghost'
              size='icon'
              aria-label='Logout'
              className='ml-auto group hover:bg-red-50 rounded-full transition-colors shadow-md'
            >
              <LogOut className='w-5 h-5 text-red-500 group-hover:text-red-700 transition-colors' />
            </Button>
          )}
        </button>
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
