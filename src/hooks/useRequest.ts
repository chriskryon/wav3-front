import { useExchangeContext } from '@/context/ExchangeContext';

export const useRequest = () => {
  const { setError } = useExchangeContext();

  const executeRequest = async (
    requestFn: () => Promise<any>,
    onSuccess: (response: any) => void
  ) => {
    try {
      setError(null);
      const response = await requestFn();
      onSuccess(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return { executeRequest };
};
