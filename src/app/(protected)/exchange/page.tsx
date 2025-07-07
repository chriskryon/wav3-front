'use client';
import { ExchangeQuoteForm } from '@/components/exchange/ExchangeQuoteForm';

export default function ExchangePage() {
  return (
    <div className='bg-gradient-to-br from-[#e6f7f8] via-white to-[#d0f3f6] flex flex-col items-center justify-center py-2 px-2 box-border h-full'>
      <div className='w-full max-w-2xl mx-auto box-border'>
      <ExchangeQuoteForm />
      </div>
    </div>
  );
}
