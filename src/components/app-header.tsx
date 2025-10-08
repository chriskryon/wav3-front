'use client';

import { Bell, User, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSidebarCollapse } from './app-sidebar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { NotificationStatus } from './NotificationStatus';

export function AppHeader() {
  const [userData, setUserData] = useState<any>(null);
  // Usa o contexto global do sidebar
  // Se quiser detectar mobile, use um hook próprio (ex: useIsMobile) ou adicione ao contexto global se necessário
  const { collapsed, setCollapsed } = useSidebarCollapse();
  // Exemplo: se quiser mostrar o botão hamburguer apenas quando colapsado (ou adapte para seu fluxo)
  const isMobile = false; // ajuste conforme sua lógica
  const setOpenMobile = () => setCollapsed(false); // ou sua lógica de mobile

  useEffect(() => {
    // Só acessar localStorage no cliente
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setUserData(JSON.parse(user));
      }
    }
  }, []);

  return (
    <header className='header-height backdrop-blur-md bg-white/90 border-b border-black/10 flex items-center justify-between px-2 sm:px-4 shadow-sm gap-3 sm:gap-0'>
      {/* Botão hamburguer mobile */}
      {isMobile && (
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden mr-2'
          aria-label='Abrir menu'
          onClick={() => setOpenMobile()}
        >
          <Menu className='w-6 h-6 text-main' />
        </Button>
      )}

      <div className='flex flex-col items-center sm:items-start text-center sm:text-left gap-0 py-1'>
        <div className="flex items-center gap-2">
          <h1 className='text-sm sm:text-base font-semibold text-[#1ea3ab] tracking-tight truncate max-w-[180px] sm:max-w-none'>
            {userData?.hasBetaAccount
              ? `Hello, ${userData.name || 'User'}!`
              : 'Complete Your Profile'}
          </h1>
          {userData?.hasBetaAccount ? (
            <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f7f8] text-[#1ea3ab] border border-[#1ea3ab]/30 ml-1 shadow-sm'>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="mr-1"><circle cx="10" cy="10" r="10" fill="#1ea3ab"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <title>Verified</title>
              </svg>
              Verified
            </span>
          ) : null}
        </div>
        {!userData?.hasBetaAccount && (
          <button
            type="button"
            className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 mt-1 shadow-sm cursor-pointer hover:bg-yellow-100 hover:shadow-md transition-colors'
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/profile';
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (typeof window !== 'undefined') {
                  window.location.href = '/profile';
                }
              }
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              className="mr-1 transition-colors"
              style={{ color: '#facc15' }}
            >
              <title>KYC</title>
              <circle cx="10" cy="10" r="10" fill="currentColor" />
              <path d="M10 6V10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="13" r="1" fill="white" />
            </svg>
            Please complete your KYC information
          </button>
        )}
      </div>

      <div className='flex items-center gap-2 sm:gap-4'>
        <div className='relative'>
          <Button
            variant='ghost'
            size='sm'
            className='backdrop-blur-sm bg-black/5 hover:bg-black/10 w-10 h-10 p-0 rounded-full border border-black/10 shadow-sm smooth-transition'
          >
            <Bell className='w-4 h-4 text-main' />
          </Button>
          {/* Badge de notificação (exemplo) */}
          <span className='absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse' />
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type='button' className='w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-md font-bold text-base uppercase select-none'>
              {userData?.name ? userData.name[0] : <User className='w-4 h-4' />}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#1ea3ab]/80 hover:text-white rounded-md cursor-pointer transition-colors"
              onSelect={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/profile';
                }
              }}
            >
              <UserIcon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#e63946]/80 hover:text-white rounded-md cursor-pointer transition-colors"
              onSelect={() => console.log('Exit clicked')}
            >
              <LogOut className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
              Exit
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <NotificationStatus />
      </div>
    </header>
  );
}
