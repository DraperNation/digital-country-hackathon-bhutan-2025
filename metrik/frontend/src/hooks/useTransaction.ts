import { useState, useCallback } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface TransactionState {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: Error;
}

export function useTransaction() {
  const [state, setState] = useState<TransactionState>({
    status: 'idle',
  });

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: state.hash,
  });

  const startTransaction = useCallback((hash: `0x${string}`) => {
    setState({
      status: 'pending',
      hash,
    });
  }, []);

  const setSuccess = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'success',
    }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      status: 'error',
      error,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
    });
  }, []);

  return {
    state,
    isConfirming,
    startTransaction,
    setSuccess,
    setError,
    reset,
  };
} 