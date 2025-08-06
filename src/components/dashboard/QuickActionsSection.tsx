import { ArrowDown, RefreshCw, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActionsSection({ setActiveModal }: { setActiveModal: (type: string | null) => void }) {
  return (
    <Card className='glass-card-enhanced'>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-main'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Button
            onClick={() => setActiveModal('deposit')}
            className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
          >
            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <ArrowDown className='w-5 h-5' />
            </div>
            <span>Deposit</span>
          </Button>
          <Button
            onClick={() => setActiveModal('exchange')}
            className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
          >
            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <RefreshCw className='w-5 h-5' />
            </div>
            <span>Exchange</span>
          </Button>
          <Button
            onClick={() => setActiveModal('send')}
            className='h-20 flex-col gap-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
          >
            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <Send className='w-5 h-5' />
            </div>
            <span>Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
