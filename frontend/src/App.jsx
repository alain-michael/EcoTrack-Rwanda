import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  const routes = [
    {
      path: '/',
      element: <AuthLayout />,
      children: [{ path: 'register', element: <Register /> },{path:"login", element:<Login />}],
    },
  ];
  const router = (
    <BrowserRouter>
      <Routes></Routes>
    </BrowserRouter>
  );

  return <></>;
}

export default App;
