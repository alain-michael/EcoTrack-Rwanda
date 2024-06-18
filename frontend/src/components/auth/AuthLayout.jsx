import React, { useState } from "react";
import Navbar from "../sharedComponents/Navbar";
import { Outlet } from "react-router-dom";
import authBg from "../../assets/auth_illustration.svg";
import Login from "./Login";
import Register from "./Register";
import Side from "../LandingPage/Side";

const AuthLayout = () => {
  const [viewType, setviewType] = useState(false);
  return (
    <div className="w-full flex max-md:flex-wrap justify-between  ">
      <div className="w-full h-[100vh]  hidden lg:flex items-center justify-center px-2">
        <Side hideLink="yes" />
      </div>
      <div className="w-full flex h-[100vh] max-md:mt-5 bg-green-900">
        <div className="m-auto">
          {!viewType && <Login viewType={viewType} setviewType={setviewType} />}
          {viewType && (
            <Register viewType={viewType} setviewType={setviewType} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
