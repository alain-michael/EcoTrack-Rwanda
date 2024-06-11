import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { MainDashboard } from './components/Dashboard/MainDashboard';
import AuthLayout from './components/auth/AuthLayout';
import Navbar from './components/sharedComponents/Navbar';
import RequestsLayout from './components/waste-collection/RequestsLayout';
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { MainDashboard } from "./components/Dashboard/MainDashboard";
import AuthLayout from "./components/auth/AuthLayout";
import RequestsLayout from "./components/waste-collection/RequestsLayout";
import { useSelector } from "react-redux";

import NotFound from "./components/serverError/NotFound";
import MainPage from "./components/LandingPage/MainPage";
import { Toaster } from "react-hot-toast";

function App() {
  // handel login sessions for register
  const userInfo = useSelector((state) => state.sharedData.usersLogin);
  let logginSession;
  if (userInfo.access) {
    logginSession = <MainDashboard />;
  } else {
    logginSession = <AuthLayout />;
  }
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={logginSession} />
          <Route path="/dashboard" element={logginSession} />
          <Route path="/dashboard/job/:id" element={logginSession} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
