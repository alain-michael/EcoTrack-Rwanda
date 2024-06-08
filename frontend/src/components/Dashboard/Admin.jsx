import React from "react";

import { useState } from "react";
import { Archivements } from "./Archivements";
import { useSelector } from "react-redux";
import Requests from "../waste-collection/Requests";
import Job from "../waste-collection/Job";
import WasteCollectorMDash from "./WasteCollectorMDash";
import ManageAllUser from "./ManageAllUser";

{/** This page is for layout for all Admin items */}
export const Admin = () => {
  const selectedItem = useSelector(state => state.sharedData.selectedItem);
  return (
    <div className="flex flex-col w-full rounded-lg mx-auto justify-around bg-white p-4 text-primary">
      {selectedItem == "Dashboard" && <WasteCollectorMDash />}
      {selectedItem == "Achievements" && <Archivements />}
      {selectedItem == "Collections" && <Requests />}
      {selectedItem == "Map" && <Job />}
      {selectedItem == "Manage Users" && <ManageAllUser />}
    </div>
  );
};
