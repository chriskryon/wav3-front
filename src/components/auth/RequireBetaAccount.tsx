'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function RequireBetaAccount({
  children,
  hasBetaAccount,
}: {
  children: React.ReactNode;
  hasBetaAccount?: boolean;
}) {
  const router = useRouter();

  if (!hasBetaAccount) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[340px] p-0 mt-10'>
        <div className='relative w-full max-w-md mx-auto'>
          <div className='absolute -top-8 left-1/2 -translate-x-1/2 z-10'>
            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-[#1ea3ab] to-[#17818a] flex items-center justify-center shadow-lg border-2 border-white'>
              <svg width='36' height='36' fill='none' viewBox='0 0 24 24'>
                <title>KYC User Icon</title>
                <path
                  d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.66-5.33-4-8-4z'
                  fill='#fff'
                />
              </svg>
            </div>
          </div>
          <div className='bg-white/90 rounded-2xl shadow-xl border border-[#1ea3ab]/15 pt-14 pb-8 px-6 flex flex-col items-center animate-fade-in-up'>
            <h2 className='text-2xl font-bold text-[#1ea3ab] mb-2 tracking-tight'>
              KYC Required
            </h2>
            <p className='mb-6 text-base text-[#17818a] font-normal max-w-md mx-auto leading-relaxed'>
              Please complete your identity verification (KYC) to unlock this
              feature and keep your account secure.
              <br />
              <span className='block mt-2 text-[#1ea3ab] font-semibold'>
                Enjoy the full experience by verifying your identity!
              </span>
            </p>
            <Button
              onClick={() => router.push('/profile')}
              className='bg-[#1ea3ab] hover:bg-[#17818a] text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 text-base tracking-wide'
              size='lg'
            >
              Complete KYC Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
