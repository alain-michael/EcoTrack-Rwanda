import React, { useState } from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";
import authBg from "../../assets/auth_illustration.svg";
import Login from "./Login";
import Register from "./Register";

const AuthLayout = () => {
  const [viewType, setviewType] = useState(false);
  return (
    <div className="w-full flex max-md:flex-wrap justify-between">
      <div className="w-full h-[100vh] bg-[#207855] flex px-2">
        <div className="flex flex-col justify-center mx-auto">
          <img src={authBg} alt="" className="w-[200px] mx-auto mb-8" />
          <p className="text-white  text-center font-sans mx-10">
            Have you joined the movement to take your organisation to Zero Waste
            in the near future? To best ensure success for your new or improved
            recycling project (whether at the office or within your school),
            Postwink aims to make this easier for you. See below for our service
            offerings.
          </p>
        </div>
      </div>
      <div className="w-full flex  max-md:mt-5">
        <div className="m-auto">
          {!viewType && <Login viewType={viewType} setviewType={setviewType}/>}
          {viewType && <Register viewType={viewType} setviewType={setviewType}/>}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
