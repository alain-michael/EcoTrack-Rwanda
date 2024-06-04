import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import AuthLayout from './components/auth/AuthLayout';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Route } from 'react-router-dom';
import RequestsLayout from './components/waste-collection/RequestsLayout';
import Requests from './components/waste-collection/Requests';
import Job from './components/waste-collection/Job';
import MapLayout from './components/waste-collection/mapContainer/mapLayout';
import EmptyLayout from './components/waste-collection/EmptyLayout';

function App() {
  const [count, setCount] = useState(0);

  const routes = [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { path: 'register', element: <Register /> },
        { path: 'login', element: <Login /> },
      ],
    },
    {
      path: '/',
      element: <RequestsLayout />,
      children: [{ path: 'requests', element: <Requests /> }],
    },
    {
      path: '/',
      element: <EmptyLayout />,
      children: [{ path: 'job/id', element: <Job /> }],
    },
  ];
  const router = (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children.map((child) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );

  return(router);
}

export default App;
