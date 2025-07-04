'use client';

import { Bell, Settings, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSidebarCollapse } from './app-sidebar';

export function AppHeader() {
  const [userData, setUserData] = useState<any>(null);
  // Usa o contexto global do sidebar
  // Se quiser detectar mobile, use um hook próprio (ex: useIsMobile) ou adicione ao contexto global se necessário
  const { collapsed, setCollapsed } = useSidebarCollapse();
  // Exemplo: se quiser mostrar o botão hamburguer apenas quando colapsado (ou adapte para seu fluxo)
  const isMobile = false; // ajuste conforme sua lógica
  const setOpenMobile = () => setCollapsed(false); // ou sua lógica de mobile

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  return (
    <header className='header-height backdrop-blur-md bg-white/90 border-b border-black/10 flex items-center justify-between px-4 sm:px-8 shadow-sm gap-3 sm:gap-0'>
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

      <div className='flex flex-col items-center sm:items-start text-center sm:text-left gap-1 py-2'>
        <h1 className='text-xl sm:text-2xl font-semibold primary-text truncate max-w-xs sm:max-w-none'>
          {userData?.hasBetaAccount
            ? `Hello, ${userData.name || 'Crypto Trader'}!`
            : 'Complete Your Profile'}
        </h1>
        <p className='text-xs sm:text-sm text-main'>
          {userData?.hasBetaAccount ? (
            <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
              Verified
            </span>
          ) : (
            <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
              Please complete your KYC information
            </span>
          )}
        </p>
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
        <Button
          variant='ghost'
          size='sm'
          className='backdrop-blur-sm bg-black/5 hover:bg-black/10 w-10 h-10 p-0 rounded-full border border-black/10 shadow-sm smooth-transition'
        >
          <Settings className='w-4 h-4 text-main' />
        </Button>
        <div className='w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-md font-bold text-base uppercase select-none'>
          {userData?.name ? userData.name[0] : <User className='w-4 h-4' />}
        </div>
      </div>
    </header>
  );
}
