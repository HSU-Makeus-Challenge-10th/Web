import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import CartPage from './pages/CartPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CartPage />,
      },
    ],
  },
]);
