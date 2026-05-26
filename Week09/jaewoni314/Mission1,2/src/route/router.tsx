import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import PlayList from '../components/playlist/PlayList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PlayList />,
      },
    ],
  },
]);

export default router;