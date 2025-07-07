import React from 'react';
import { Button } from '@/components/ui/button';

interface SuccessStepProps {
  onNewExchange: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onNewExchange }) => (
  <div className='flex flex-col items-center justify-center gap-8 min-h-[300px]'>
    <div className='flex flex-col items-center gap-2'>
      <div className='w-20 h-20 rounded-full bg-[#1ea3ab]/10 flex items-center justify-center border-4 border-[#1ea3ab] mb-2'>
        <svg
          width='40'
          height='40'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#1ea3ab'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <title>Exchange Confirmed Checkmark</title>
          <polyline points='20 6 10 18 4 12'></polyline>
        </svg>
      </div>
      <h2 className='text-2xl font-bold text-[#1ea3ab]'>
        Exchange Confirmed!
      </h2>
      <p className='text-lg text-gray-500'>
        Your exchange was successfully confirmed.
      </p>
    </div>
    <Button
      className='mt-4 bg-[#1ea3ab] hover:bg-[#1ea3ab]/90 text-white font-bold shadow-lg text-lg py-4 rounded-xl'
      onClick={onNewExchange}
    >
      New Exchange
    </Button>
  </div>
);
