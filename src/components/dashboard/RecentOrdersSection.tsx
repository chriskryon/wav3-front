import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Send, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function RecentOrdersSection({ recentTransactions }: any) {
  return (
    <Card className='glass-card-enhanced'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-xl font-bold text-main'>Recent Orders</CardTitle>
          <Button variant='ghost' size='sm' className='glass-button'>
            <RefreshCw className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4 max-h-80 scroll-area'>
          {recentTransactions.map((tx: any) => (
            <div key={tx.id} className='glass-item p-4 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                  tx.type === 'Buy'
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                    : tx.type === 'Sell'
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                    : 'bg-primary/20 text-primary border border-primary/30'
                }`}>
                  {tx.type === 'Buy' ? (
                    <ArrowDown className='w-6 h-6' />
                  ) : tx.type === 'Sell' ? (
                    <ArrowUp className='w-6 h-6' />
                  ) : (
                    <Send className='w-6 h-6' />
                  )}
                </div>
                <div>
                  <div className='font-semibold text-main'>
                    {tx.type} {tx.asset}
                  </div>
                  <div className='text-sm muted-text'>{tx.date}</div>
                </div>
              </div>
              <div className='text-right'>
                <div className='font-bold text-main'>
                  ${tx.value.toLocaleString()}
                </div>
                <Badge
                  className={`text-xs font-medium mt-1 ${
                    tx.status === 'Completed'
                      ? 'bg-green-500/20 text-green-500 border-green-500/40'
                      : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40'
                  }`}
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
