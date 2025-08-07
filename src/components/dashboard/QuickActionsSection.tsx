import { ArrowDown, RefreshCw, Send, ArrowDownToLine, Repeat2, SendHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActionsSection({ setActiveModal }: { setActiveModal: (type: string | null) => void }) {
  const actions = [
    {
      key: 'deposit',
      label: 'Deposit',
      description: 'Add funds to your wallet',
      icon: <ArrowDownToLine className='w-5 h-5' />,
      gradient: 'from-primary to-primary/80',
      hoverGradient: 'hover:from-primary/90 hover:to-primary/70',
      bgGlow: 'shadow-primary/25',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
    },
    {
      key: 'exchange',
      label: 'Exchange',
      description: 'Swap between assets',
      icon: <Repeat2 className='w-5 h-5' />,
      gradient: 'from-primary/90 to-primary/70',
      hoverGradient: 'hover:from-primary/80 hover:to-primary/60',
      bgGlow: 'shadow-primary/20',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
    },
    {
      key: 'send',
      label: 'Send',
      description: 'Transfer to others',
      icon: <SendHorizontal className='w-5 h-5' />,
      gradient: 'from-primary/80 to-primary/60',
      hoverGradient: 'hover:from-primary/70 hover:to-primary/50',
      bgGlow: 'shadow-primary/20',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
    },
  ];

  return (
    <Card className='glass-card-enhanced'>
      <CardHeader className="pb-4 px-3 sm:px-6">
        <CardTitle className='text-lg font-semibold text-main tracking-tight'>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {actions.map(({ key, label, description, icon, gradient, hoverGradient, bgGlow, iconBg, iconColor }, index) => (
            <div
              key={key}
              className={`
                quick-action-card opacity-0 animate-fade-in-up
                ${index === 0 ? 'animation-delay-0' : ''}
                ${index === 1 ? 'animation-delay-100' : ''}
                ${index === 2 ? 'animation-delay-200' : ''}
              `}
            >
              <Button
                onClick={() => setActiveModal(key)}
                className={`
                  group relative w-full h-24 sm:h-28
                  bg-gradient-to-br ${gradient} ${hoverGradient}
                  border-0 rounded-2xl
                  flex flex-col items-center justify-center gap-2
                  text-white font-semibold
                  shadow-lg ${bgGlow} hover:shadow-xl hover:${bgGlow}
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:-translate-y-1
                  active:scale-95 active:translate-y-0
                  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
                  overflow-hidden
                `}
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon Container */}
                <div className={`
                  relative z-10 w-10 h-10 sm:w-12 sm:h-12 
                  ${iconBg} ${iconColor}
                  rounded-full flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                  shadow-lg
                `}>
                  {icon}
                </div>
                
                {/* Label */}
                <div className="relative z-10 text-center">
                  <span className="text-sm sm:text-base font-bold block">
                    {label}
                  </span>
                  <span className="text-xs opacity-90 font-medium hidden sm:block">
                    {description}
                  </span>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
