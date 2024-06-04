import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import DropdownProfile from "./DropdownProfile";
import { useSelector } from "react-redux";
export const Header = ({ isOpen, toggleSidebar }) => {
  const userInfo = useSelector((state) => state.sharedData.usersLogin); //accessing react redux fr userLogin

  return (
    <div className="flex justify-between items-center h-8 bg-white p-8">
      <button
        title="Menu"
        className="text-[#207855] focus:outline-none "
        onClick={toggleSidebar}
      >
        {isOpen ? null : <MenuIcon style={{ fontSize: "30px" }} />}
      </button>
      <DropdownProfile/>
    </div>
  );
};
