
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { MainDashboard } from "./components/Dashboard/MainDashboard";
import AuthLayout from "./components/auth/AuthLayout";
import Navbar from "./components/sharedComponents/Navbar";
import RequestsLayout from "./components/waste-collection/RequestsLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/auth" element={<AuthLayout />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/collection" element={<RequestsLayout />} />
        <Route path="collection/job" element={<RequestsLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
