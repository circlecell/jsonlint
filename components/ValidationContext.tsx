'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ValidationState = 'idle' | 'valid' | 'invalid';

interface ValidationContextType {
  status: ValidationState;
  setStatus: (status: ValidationState) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  errorLine: number | null;
  setErrorLine: (line: number | null) => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(
  undefined
);

export function ValidationProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ValidationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);

  return (
    <ValidationContext.Provider
      value={{
        status,
        setStatus,
        errorMessage,
        setErrorMessage,
        errorLine,
        setErrorLine,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
}
