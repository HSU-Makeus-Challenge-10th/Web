import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LpDetailPage from './pages/LpDetailPage';

// TanStack Query 목적: 서버 상태를 패칭/캐싱/동기화하고 로딩·에러 상태를 일관되게 관리한다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: fresh로 간주하는 시간(짧으면 자주 리페치, 길면 트래픽 절감)
      staleTime: 1000 * 60,
      // gcTime: 사용되지 않는 캐시를 메모리에 보관하는 시간
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="lp/:lpId" element={<LpDetailPage />} />
    </Route>
  )
);

function App() {
  const isDev = import.meta.env.DEV;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        {/* Devtools: queryKey, stale/fresh, background refetch 트레이스를 개발 모드에서 확인 */}
        {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
