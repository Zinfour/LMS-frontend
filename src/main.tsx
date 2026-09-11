import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './custom.css';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { Toaster } from '@/components/ui/sonner';

export const queryClient = new QueryClient();

const container = document.getElementById('root')!;

// Reuse the root across HMR updates instead of creating a new one each time
const hot = import.meta.hot as { data: { root?: Root } } | undefined;
const root = hot?.data.root ?? createRoot(container);
if (hot) hot.data.root = root;

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
