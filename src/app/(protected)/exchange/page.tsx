"use client";

import { useEffect } from "react";
import { ExchangeProvider, useExchangeContext } from "@/context/ExchangeContext";
import { QuoteStep } from "@/components/exchange/steps/QuoteStep";
import { PreDepositStep } from "@/components/exchange/steps/PreDepositStep";
import { DepositStep } from "@/components/exchange/steps/DepositStep";

function ExchangeV2Page() {
  const { step, navigateToStep, orderResult } = useExchangeContext();

  const handleBackToQuote = () => {
    navigateToStep("quote");
  };

  useEffect(() => {
    navigateToStep(step);
  }, [step, navigateToStep]);

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#e6f7f8] via-white to-[#d0f3f6]">
      <div className="w-full max-w-2xl bg-white/60 border border-wav3/50 shadow-xl rounded-2xl p-6 backdrop-blur-md h-[90%] md:h-[90%] my-4 md:my-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {step === "quote" && <QuoteStep />}
          {step === "pre-deposit" && (
            <PreDepositStep
              onBack={handleBackToQuote}
              onConfirm={() => console.log("Confirmed")}
            />
          )}
          {step === "deposit" && (
            <DepositStep
              data={orderResult}
              onBack={() => navigateToStep("pre-deposit")}
              onNext={() => navigateToStep("success")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function WrappedExchangeV2Page() {
  return (
    <ExchangeProvider>
      <ExchangeV2Page />
    </ExchangeProvider>
  );
}
