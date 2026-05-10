import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WelcomeData } from './components/WelcomeData';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  );
}