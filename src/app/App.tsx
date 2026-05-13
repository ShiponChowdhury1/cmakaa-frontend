import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Providers from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop closeOnClick pauseOnHover draggable />
    </Providers>
  );
}
