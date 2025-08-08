// src/components/dev/TestNotifications.tsx
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestNotifications() {
  const { isConnected, testNotification, userId } = useNotifications();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">🔔 Test Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>User ID:</span>
          <span className="font-mono text-sm">{userId || 'N/A'}</span>
        </div>

        <Button 
          onClick={testNotification}
          disabled={!isConnected}
          className="w-full"
        >
          Enviar Notificação de Teste
        </Button>
      </CardContent>
    </Card>
  );
}