// src/hooks/useNotifications.ts
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useUser } from './useUser';

interface Notification {
  id: string;
  type: 'order_created' | 'order_confirmed' | 'order_cancelled' | 'payment_received';
  title: string;
  message: string;
  user_id: string;
  created_at: string;
  metadata?: {
    order_id?: string;
    amount?: number;
    currency?: string;
  };
}

export function useNotifications() {
  const { user } = useUser(); // Usar seu hook existente
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const showNotification = useCallback((notification: Notification) => {
    const { type, title, message, metadata } = notification;
    
    const toastOptions = {
      description: message,
      duration: 5000,
      action: metadata?.order_id ? {
        label: 'Ver Detalhes',
        onClick: () => window.location.href = `/orders?highlight=${metadata.order_id}`
      } : undefined
    };

    switch (type) {
      case 'order_created':
        toast.info(title, { ...toastOptions, icon: '🎯' });
        break;
      case 'order_confirmed':
        toast.success(title, { ...toastOptions, icon: '✅' });
        break;
      case 'order_cancelled':
        toast.error(title, { ...toastOptions, icon: '❌' });
        break;
      case 'payment_received':
        toast.success(title, { ...toastOptions, icon: '💰' });
        break;
      default:
        toast(title, toastOptions);
    }
  }, []);

  const connect = useCallback(() => {
    if (!user?.id) return;

    const es = new EventSource(
      `https://wav3-back-hfoyg.ondigitalocean.app/notifications/stream/${user.id}`
    );

    es.onopen = () => {
      console.log('🔗 Notificações conectadas');
      setIsConnected(true);
    };
    
    es.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        console.log('📥 Nova notificação:', notification);
        showNotification(notification);
      } catch (error) {
        console.error('❌ Erro ao processar notificação:', error);
      }
    };

    es.onerror = (error) => {
      console.log('🔌 Conexão SSE perdida, reconectando...');
      setIsConnected(false);
      es.close();
      
      // Reconectar após 5 segundos
      setTimeout(() => {
        if (user?.id) connect();
      }, 5000);
    };

    setEventSource(es);
    return es;
  }, [user?.id, showNotification]);

  useEffect(() => {
    if (user?.id) {
      const es = connect();
      return () => {
        console.log('🔌 Desconectando notificações');
        es?.close();
      };
    }
  }, [user?.id, connect]);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      eventSource?.close();
    };
  }, [eventSource]);

  const testNotification = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await fetch(
        `https://wav3-back-hfoyg.ondigitalocean.app/test/notification/${user.id}`,
        { method: 'POST' }
      );
      toast.info('Teste enviado!', { description: 'Verifique se recebeu a notificação' });
    } catch (error) {
      toast.error('Erro no teste', { description: 'Falha ao enviar notificação de teste' });
    }
  }, [user?.id]);

  return { 
    isConnected, 
    testNotification,
    userId: user?.id 
  };
}