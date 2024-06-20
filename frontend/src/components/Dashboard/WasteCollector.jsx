import React from "react";

import { Achievements } from "./Achievements";
import { useSelector } from "react-redux";
import Requests from "../waste-collection/Requests";
import Job from "../waste-collection/Job";
import WasteCollectorMDash from "./WasteCollectorMDash";
import { Messages } from "./Messages";
import { ChatRoom } from "./ChatRoom";
import { HouseShedule } from "./HouseShedule";
{/** This page is for layout for all waste collectors items */}
export const WasteCollector = () => {
  const selectedItem = useSelector((state) => state.sharedData.selectedItem);
  return (
    <div className="flex flex-col w-full rounded-lg mx-auto justify-around bg-white p-4 text-primary">
      {selectedItem == "Dashboard" && <Requests />}
      {selectedItem == "Achievements" && <Achievements />}
      {selectedItem == "Collections" && <Requests />}
      {selectedItem == "Map" && <Job />}
      {selectedItem == "Messages" && <Messages />}
      {selectedItem == "Chatroom" && <ChatRoom />}
      {selectedItem == "All Schedule" && <HouseShedule />}
    </div>
  );
};
