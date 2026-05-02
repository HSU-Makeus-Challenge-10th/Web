import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import SignupPage from './pages/SignupPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, 
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

function App() {
  
  return <RouterProvider router={router} />;
}

export default App;