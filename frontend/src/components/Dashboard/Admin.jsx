import React from "react";

import { useState } from "react";
import { Achievements } from "./Achievements";
import { useSelector } from "react-redux";
import Requests from "../waste-collection/Requests";
import Job from "../waste-collection/Job";
import WasteCollectorMDash from "./WasteCollectorMDash";
import ManageAllUser from "./ManageAllUser";
import AllSchedules from "./AllSchedules";
import { Messages } from "./Messages";
import UserAchievements from "../../pages/achievements/UserAchievements";

{
  /** This page is for layout for all Admin items */
}
export const Admin = () => {
  const selectedItem = useSelector((state) => state.sharedData.selectedItem);
  return (
    <div className="flex flex-col w-full rounded-lg mx-auto justify-around bg-white p-4 text-primary">
      {selectedItem == "Dashboard" && <WasteCollectorMDash />}
      {selectedItem == "Achievements" && <Achievements />}
      {selectedItem == "User Achievements" && <UserAchievements />}
      {selectedItem == "Map" && <Job />}
      {selectedItem == "Manage Users" && <ManageAllUser />}
      {selectedItem == "All Schedules" && <AllSchedules />}
      {selectedItem == "Messages" && <Messages />}
      {selectedItem == "Chatroom" && <ChatRoom />}
    </div>
  );
};
