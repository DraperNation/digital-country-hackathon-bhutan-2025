import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export function useModal(initialState = false) {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
  });

  const openModal = useCallback((data?: any) => {
    setState({
      isOpen: true,
      data,
    });
  }, []);

  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
    });
  }, []);

  const toggleModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    openModal,
    closeModal,
    toggleModal,
  };
} 