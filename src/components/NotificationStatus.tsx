// src/components/NotificationStatus.tsx
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Wifi, WifiOff } from 'lucide-react';

export function NotificationStatus() {
  const { isConnected, testNotification, userId } = useNotifications();

  if (!userId) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Status Badge */}
      <Badge 
        variant={isConnected ? "default" : "secondary"}
        className={`
          flex items-center gap-1 text-xs
          ${isConnected 
            ? 'bg-green-500/20 text-green-700 border-green-500/30' 
            : 'bg-red-500/20 text-red-700 border-red-500/30'
          }
        `}
      >
        {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {isConnected ? 'Online' : 'Offline'}
      </Badge>

      {/* Test Button (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outline"
          size="sm"
          onClick={testNotification}
          className="h-6 px-2 text-xs"
        >
          <Bell className="w-3 h-3 mr-1" />
          Teste
        </Button>
      )}
    </div>
  );
}