import React from 'react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
export const queryClient=new QueryClient({defaultOptions:{queries:{staleTime:30000,retry:0}}});
export function AppQueryProvider({children}){return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>}
