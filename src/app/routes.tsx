import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Compose } from '../pages/Compose';
import { Profile } from '../pages/Profile';
import { Wallet } from '../pages/Wallet';
import { Calendar } from '../pages/Calendar';
import { Missions } from '../pages/Missions';
import { About } from '../pages/About';
import { Layout } from './Layout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'compose',
          element: <Compose />,
        },
        {
          path: 'wallet',
          element: <Wallet />,
        },
        {
          path: 'calendar',
          element: <Calendar />,
        },
        {
          path: 'missions',
          element: <Missions />,
        },
        {
          path: 'profile/:id',
          element: <Profile />,
        },
        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ],
  {
    basename: '/Re-kind/',
  }
);

export const Routes = () => <RouterProvider router={router} />;

