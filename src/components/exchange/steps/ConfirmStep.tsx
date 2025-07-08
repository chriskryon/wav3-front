import React from "react";

interface ConfirmStepProps {
  data: any;
  onBack: () => void;
  onNext: (data: any) => void;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ data, onBack, onNext }) => {
  const handleNext = () => {
    const mockOrder = { orderId: "12345" };
    onNext(mockOrder);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-bold">Confirm Step</h2>
      <p>Source: {data?.source}</p>
      <p>Target: {data?.target}</p>
      <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
        Back
      </button>
      <button onClick={handleNext} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Next
      </button>
    </div>
  );
};
