import React from "react";

interface SuccessStepProps {
  onNewExchange: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onNewExchange }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-bold">Success Step</h2>
      <p>Your exchange was successful!</p>
      <button type="button" onClick={onNewExchange} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        New Exchange
      </button>
    </div>
  );
};
