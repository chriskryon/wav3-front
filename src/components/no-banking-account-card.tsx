import { Plus } from "lucide-react";
import { Button } from "./ui/button";

// Card genérico para ausência de contas
export function NoBankAccountCard({
  type,
  onAdd,
}: {
  type: 'shared' | 'external';
  onAdd: () => void;
}) {
  return (
    <div className='relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 via-white to-primary/5 border border-primary/20 flex flex-col items-center justify-center min-h-[220px] p-6'>
      <div className='absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-white/0 to-transparent' />
      <div className='z-10 flex flex-col items-center gap-3'>
        <button
          type='button'
          className='rounded-full bg-primary/10 p-4 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-primary/50 transition hover:bg-primary/20'
          onClick={onAdd}
          aria-label={type === 'shared' ? 'Add deposit account' : 'Add withdraw account'}
        >
          <Plus className='w-8 h-8 text-primary' />
        </button>
        <span className='text-base text-main font-semibold tracking-wide text-center'>
            {type === 'shared'
            ? 'No deposit accounts found.'
            : 'No withdraw accounts found.'}
        </span>
        <Button
          className='bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          onClick={onAdd}
        >
           {type === 'shared' ? 'Add deposit account' : 'Add withdraw account'}
        </Button>
      </div>
    </div>
  );
}