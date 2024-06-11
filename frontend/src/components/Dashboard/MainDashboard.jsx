import React, { useEffect, useState } from "react";
import { SideBar } from "./SideBar";
import { Header } from "./Header";
import { DashItems } from "./DashItems";
import { useSelector } from "react-redux";
import { WasteCollector } from "./WasteCollector";
import { Admin } from "./Admin";

export const MainDashboard = () => {
  const userInfo = useSelector((state) => state.sharedData.usersLogin);
  const defaultUserType = useSelector((state) => state.sharedData.defaultUserType);

  const [isOpen, setIsOpen] = useState(true);
  const isScreenWidth767 = () => {
    return window.innerWidth;
  };
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isScreenWidth767() >= 867) {
        setIsOpen(true); // Open sidebar if screen width is greater than or equal to 767 pixels
      } else {
        setIsOpen(false); // Close sidebar if screen width is less than 767 pixels
      }
    }, 1);

    setIntervalId(interval);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (intervalId) clearInterval(intervalId); // Clear the interval when sidebar is opened or closed manually
  };

  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar */}
      <div
        className={`shadow-sm  bg-white text-primary flex-shrink-0 overflow-y-auto  transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-64' : '-translate-x-64 w-0'
          }`}
      >
        {/** Sidebar Or Body Goes  */}
        <SideBar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      </div>
      <div
        className={` w-full ${isOpen ? 'ml-0' : 'ml-0'} h-screen overflow-auto`}
      >
        {/** Header Goes Here Or Body Goes  */}
        <header className="sticky top-0">
          <Header toggleSidebar={toggleSidebar} isOpen={isOpen} />
        </header>
        <main className="pt-3 px-2">
          {/** Main Data Or Body Goes  */}
          {defaultUserType == "Household User" && <DashItems />}
          {defaultUserType == "Waste Collector" && <WasteCollector />}
          {defaultUserType == "admin" && <Admin />}
        </main>
      </div>
    </div>
  );
};
