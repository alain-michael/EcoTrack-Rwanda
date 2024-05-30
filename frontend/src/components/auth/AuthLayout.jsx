import React from 'react';
import Navbar from '../Navbar';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <main className="auth-main-container">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
