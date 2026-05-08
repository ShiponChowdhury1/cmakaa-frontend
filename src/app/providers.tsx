import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global providers wrapper.
 * Redux store + any future providers go here.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
