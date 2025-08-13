// src/hooks/useNotifications.ts - VERSÃO CORRIGIDA
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useUser } from './useUser';

interface Notification {
  id: string;
  type: 'connected' | 'order_created' | 'order_confirmed' | 'order_cancelled' | 'order_failed' | 'order_expired' | 'payment_received' | 'test';
  title: string;
  message: string;
  user_id: string;
  created_at?: string;
  timestamp?: string;
  data?: {
    orderId?: string;
    amount?: string | number;
    asset?: string;
    status?: string;
    subAccountId?: string;
    order_id?: string;
    currency?: string;
  };
  metadata?: {
    order_id?: string;
    amount?: number;
    currency?: string;
  };
}

export function useNotifications() {
  const { user, isHydrated } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const showNotification = useCallback((notification: Notification) => {
    const { type, title, message, metadata, data } = notification;
    
    // Usar data ou metadata para order_id
    const orderId = data?.orderId || data?.order_id || metadata?.order_id;
    
    const toastOptions = {
      description: message,
      duration: 5000,
      action: orderId ? {
        label: 'Ver Detalhes',
        onClick: () => window.location.href = `/orders?highlight=${orderId}`
      } : undefined
    };

    switch (type) {
      case 'connected':
        toast.info(title, { ...toastOptions, icon: '📡' });
        break;
      case 'order_created':
        toast.info(title, { ...toastOptions, icon: '🎯' });
        break;
      case 'order_confirmed':
        toast.success(title, { ...toastOptions, icon: '✅' });
        break;
      case 'order_cancelled':
        toast.error(title, { ...toastOptions, icon: '❌' });
        break;
      case 'order_failed':
        toast.error(title, { ...toastOptions, icon: '❌' });
        break;
      case 'order_expired':
        toast.error(title, { ...toastOptions, icon: '⏰' });
        break;
      case 'payment_received':
        toast.success(title, { ...toastOptions, icon: '💰' });
        break;
      case 'test':
        toast.info(title, { ...toastOptions, icon: '🧪' });
        break;
      default:
        toast(title, toastOptions);
    }
  }, []);

  const connect = useCallback(() => {
    if (!user?.id) {
      console.log('⚠️ Usuário não disponível para conectar notificações');
      return;
    }

    // ✅ SEMPRE usar user.id (userId) para SSE
    console.log('🔗 Conectando notificações para userId:', user.id);
    
    const es = new EventSource(
      `http://localhost:3000/notifications/stream/${user.id}`
    );

    es.onopen = () => {
      console.log('✅ Notificações conectadas para userId:', user.id);
      setIsConnected(true);
    };
    
    es.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        console.log('📥 Nova notificação recebida:', notification);
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
        if (user?.id) {
          console.log('🔄 Tentando reconectar...');
          connect();
        }
      }, 5000);
    };

    setEventSource(es);
    return es;
  }, [user?.id, showNotification]); // ✅ Removeu user?.account das dependências

  useEffect(() => {
    // Só conectar após a hidratação e se tiver user
    if (isHydrated && user?.id) {
      console.log('🚀 Iniciando conexão de notificações...');
      const es = connect();
      return () => {
        console.log('🔌 Desconectando notificações');
        es?.close();
      };
    } else {
      console.log('⏳ Aguardando hidratação ou usuário...', { isHydrated, hasUser: !!user?.id });
    }
  }, [isHydrated, user?.id, connect]); // ✅ Removeu user?.account

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (eventSource) {
        console.log('🧹 Limpando EventSource no unmount');
        eventSource?.close();
      }
    };
  }, [eventSource]);

  const testNotification = useCallback(async (type = 'order_created') => {
    if (!user?.id) {
      console.error('❌ Usuário não disponível para teste');
      toast.error('Erro', { description: 'Usuário não encontrado' });
      return;
    }
    
    // ✅ SEMPRE usar user.id (userId) para teste
    console.log('🧪 Enviando teste para userId:', user.id);
    
    const testPayloads = {
      connected: {
        type: 'connected',
        title: '📡 Conectado',
        message: 'Conexão com notificações estabelecida',
        metadata: {}
      },
      order_created: {
        type: 'order_created',
        title: '🎯 Nova Order Criada',
        message: 'Order #TEST-001 foi criada com sucesso',
        metadata: { order_id: 'TEST-001', amount: 1000, currency: 'USD' }
      },
      order_confirmed: {
        type: 'order_confirmed',
        title: '✅ Order Confirmada',
        message: 'Pagamento de $1,000.00 confirmado',
        metadata: { order_id: 'TEST-001', amount: 1000, currency: 'USD' }
      },
      order_failed: {
        type: 'order_failed',
        title: '❌ Order Falhou',
        message: 'Order #TEST-001 falhou no processamento',
        metadata: { order_id: 'TEST-001', amount: 1000, currency: 'USD' }
      },
      order_expired: {
        type: 'order_expired',
        title: '⏰ Order Expirou',
        message: 'Order #TEST-001 expirou sem pagamento',
        metadata: { order_id: 'TEST-001', amount: 1000, currency: 'USD' }
      },
      payment_received: {
        type: 'payment_received',
        title: '💰 Pagamento Recebido',
        message: 'Recebemos seu pagamento de $500.00',
        metadata: { amount: 500, currency: 'USD' }
      },
      order_cancelled: {
        type: 'order_cancelled',
        title: '❌ Order Cancelada',
        message: 'Order #TEST-001 foi cancelada pelo usuário',
        metadata: { order_id: 'TEST-001' }
      },
      test: {
        type: 'test',
        title: '🧪 Teste de Notificação',
        message: 'Esta é uma notificação de teste do sistema',
        metadata: {}
      }
    };
    
    try {
      console.log(`🧪 Enviando notificação de teste tipo "${type}" para userId:`, user.id);
      
      const response = await fetch(
        `http://localhost:3000/test/notification/${user.id}`, // ✅ SEMPRE user.id
        { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayloads[type as keyof typeof testPayloads] || testPayloads.order_created)
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Teste enviado com sucesso:', result);
        toast.info('🧪 Teste enviado!', { 
          description: `Notificação do tipo "${type}" enviada para userId ${user.id}`,
        });
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar teste:', error);
      toast.error('❌ Erro no teste', { 
        description: error instanceof Error ? error.message : 'Falha ao enviar notificação de teste'
      });
    }
  }, [user?.id]); // ✅ Removeu user?.account

  // ✅ Função adicional para debug
  const getConnectionInfo = useCallback(() => {
    return {
      isConnected,
      userId: user?.id,
      isHydrated,
      hasEventSource: !!eventSource
    };
  }, [isConnected, user?.id, isHydrated, eventSource]);

  return { 
    isConnected, 
    testNotification,
    getConnectionInfo // ✅ Nova função para debug
  };
}
