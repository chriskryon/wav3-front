import { ArrowDown, RefreshCw, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActionsSection({ setActiveModal }: { setActiveModal: (type: string | null) => void }) {
  const actions = [
    {
      key: 'deposit',
      label: 'Deposit',
      icon: <ArrowDown className='w-5 h-5' />,
    },
    {
      key: 'exchange',
      label: 'Exchange',
      icon: <RefreshCw className='w-5 h-5' />,
    },
    {
      key: 'send',
      label: 'Send',
      icon: <Send className='w-5 h-5' />,
    },
  ];

  return (
    <Card className='glass-card-enhanced'>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-main'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {actions.map(({ key, label, icon }) => (
            <Button
              key={key}
              onClick={() => setActiveModal(key)}
              className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-101'
            >
              <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                {icon}
              </div>
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
