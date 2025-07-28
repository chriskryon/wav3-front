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
      <div className="relative flex flex-col items-center justify-center min-h-[340px] p-0 mt-10">
        {/* Blurred gradient background for depth */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-[#e0f7fa]/70 via-[#b2ebf2]/60 to-[#1ea3ab]/40 blur-xl" />
        </div>
        <div className="relative w-full max-w-md mx-auto z-10">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1ea3ab] to-[#17818a] flex items-center justify-center shadow-2xl border-4 border-white">
              <svg width="44" height="44" fill="none" viewBox="0 0 24 24">
                <title>KYC User Icon</title>
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.66-5.33-4-8-4z"
                  fill="#fff"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-[#1ea3ab]/20 pt-16 pb-10 px-8 flex flex-col items-center animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-[#17818a] mb-3 tracking-tight drop-shadow-sm">
              KYC Required
            </h2>
            <p className="mb-7 text-base text-[#17818a] font-normal max-w-md mx-auto leading-relaxed text-center">
              Please complete your identity verification (KYC) to unlock this feature and keep your account secure.
              <br />
              <span className="block mt-3 text-[#1ea3ab] font-semibold text-lg">
                Enjoy the full experience by verifying your identity!
              </span>
            </p>
            <Button
              onClick={() => router.push('/profile')}
              className="bg-gradient-to-r from-[#1ea3ab] to-[#17818a] hover:scale-105 hover:shadow-xl text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition-all duration-200 text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-[#1ea3ab]/40"
              size="lg"
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
