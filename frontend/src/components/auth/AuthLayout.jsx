import React from 'react';
import Navbar from '../Navbar';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
return (
    <div className="w-full flex max-md:flex-wrap justify-between">
        <div className="w-full h-[100vh] bg-[#9ccb3b] flex px-2">
            <div className="flex flex-col justify-center mx-auto">
                <p className="text-white text-xl text-center font-sans mx-8">
                    Have you joined the movement to take your organisation to Zero Waste
                    in the near future? To best ensure success for your new or improved
                    recycling project (whether at the office or within your school),
                    Postwink aims to make this easier for you. See below for our service
                    offerings.
                </p>
            </div>
        </div>
        <div className="w-full flex px-2 max-md:mt-5">
            <div className="flex flex-col justify-center mx-auto">
                <Outlet />
            </div>
        </div>
    </div>
);
};

export default AuthLayout;
