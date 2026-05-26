import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LpDetailPage from './pages/LpDetailPage';
import MyPage from './pages/MyPage';
import { QUERY_CACHE_TIME } from './constants/key';
import ProtectedRoute from './components/ProtectedRoute';

// TanStack Query 목적: 서버 상태를 패칭/캐싱/동기화하고 로딩·에러 상태를 일관되게 관리한다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CACHE_TIME.default.staleTime,
      gcTime: QUERY_CACHE_TIME.default.gcTime,
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
      <Route
        path="my"
        element={(
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="lp/:lpId"
        element={(
          <ProtectedRoute>
            <LpDetailPage />
          </ProtectedRoute>
        )}
      />
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
