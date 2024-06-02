import React from "react";
import TodayTime from "@mui/icons-material/Today";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RecyclingIcon from "@mui/icons-material/Recycling";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CancelIcon from "@mui/icons-material/Cancel";

export const SideBar = ({ isOpen, toggleSidebar, selectedItem, setSelectedItem }) => {
  const houseHoldSidebarItems = [
    { label: "Schedule", icon: <TodayTime /> },
    { label: "Achievements", icon: <EmojiEventsIcon /> },
    { label: "Recycle", icon: <RecyclingIcon /> },
  ];
  const settings = [
    { label: "Settings", icon: <SettingsIcon /> },
    { label: "Logout", icon: <LogoutIcon /> },
  ];

  return (
    <>
      <div className="sticky top-0 bg-[#207855] text-white py-4 px-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">ECO-TRACK.RW</h3>
        <button
          className="text-white rounded-md focus:outline-none "
          name="btn"
          id="btn"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <CancelIcon style={{ fontSize: "30px" }} />
          ) : (
            <MenuOpenIcon style={{ fontSize: "30px" }} />
          )}
        </button>
      </div>
      <div className="menu">
        <div className="py-3">
          <h3 className="text-primary p-3 font-semibold">Menu</h3>
          <div className="text-primary">
            {houseHoldSidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center py-2 px-4 hover:bg-gray-200 cursor-pointer ${selectedItem == item.label ? "bg-green-200" : ""}`}
                onClick={() => setSelectedItem(item.label)}
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="menu">
        <div className="py-3">
          <h3 className="text-primary p-3 font-semibold">Management</h3>
          <div className="text-primary">
            {settings.map((item, index) => (
              <div
                key={index}
                className="flex items-center py-2 px-4 hover:bg-gray-200 cursor-pointer"
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
