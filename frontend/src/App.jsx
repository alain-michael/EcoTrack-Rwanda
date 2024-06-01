
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { MainDashboard } from "./components/Dashboard/MainDashboard";
import AuthLayout from "./components/auth/AuthLayout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/auth" element={<AuthLayout />} />
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
