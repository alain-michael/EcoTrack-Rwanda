import React from "react";
import TodayTime from "@mui/icons-material/Today";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RecyclingIcon from "@mui/icons-material/Recycling";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedItem } from "../../features/SharedDataSlice/SharedData";

export const SideBar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();

  const houseHoldSidebarItems = [
    { label: "Schedule", icon: <TodayTime /> },
    { label: "Achievements", icon: <EmojiEventsIcon /> },
    { label: "Collections", icon: <RecyclingIcon /> },
  ];
  const settings = [
    { label: "Settings", icon: <SettingsIcon /> },
    { label: "Logout", icon: <LogoutIcon /> },
  ];
  const selectedItem = useSelector(state => state.sharedData.selectedItem);
  const changeView = (item) => {
    dispatch(setSelectedItem(item));
  };

  return (
    <>
      <div className="sticky top-0 text-white py-4 px-4 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-[#207855]">ECO-TRACK.RW</h3>
        <button
          className="text-[#207855] rounded-md focus:outline-none "
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
      <div className="p-2 flex gap-2 items-center justify-between border-b bg-[#207855]">
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full bg-black cursor-pointer">
            <img
              src="/profile/img1.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="">
            <p className="font-semibold text-green-50">Christian</p>
            <small className="text-xs text-green-50">Admin</small>
          </div>
        </div>
        <MenuOpenIcon className="-rotate-90 cursor-pointer text-green-50" />
      </div>

      <div className="menu">
        <div className="">
          <h3 className="text-primary p-3 font-semibold">Menu</h3>
          <div className="text-primary">
            {houseHoldSidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center py-2 px-4 hover:bg-gray-200 rounded-r-full w-11/12 cursor-pointer ${
                  selectedItem == item.label
                    ? "bg-green-100 border-l-4 border-[#207855] text-[#207855]"
                    : ""
                }`}
                onClick={() => changeView(item.label)}
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
