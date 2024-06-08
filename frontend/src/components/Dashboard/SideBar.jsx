// SideBar.js

import React, { useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedItem, setdefaultUserType } from "../../features/SharedDataSlice/SharedData";
import SiderBar from "../sharedComponents/userSideBar"; // Adjust the path if needed

export const SideBar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.sharedData.usersLogin);
  const selectedItem = useSelector((state) => state.sharedData.selectedItem);
  const houseHoldSidebarItems = SiderBar();

  const changeView = (item) => {
    dispatch(setSelectedItem(item));
  };
  // const userRole = userInfo.user_role;
  // const userRole = "Waste Collector";
  const userRole = "admin";
  const defaultUserType = useSelector((state) => state.sharedData.defaultUserType);
  const ChangeUserType = () => {
    if (userRole !== defaultUserType) {
      dispatch(setdefaultUserType(userRole))
    } else {
      dispatch(setdefaultUserType("Household User"))
    }
    setChangeAccount(false)
    dispatch(setSelectedItem("Dashboard"));
  }
  const [changeAccount, setChangeAccount] = useState(false)
  return (
    <>
      <div className="sticky top-0 text-white py-4 px-4 flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-[#207855]">ECO-TRACK.RW</h3>
        <button
          className="text-[#207855] rounded-md focus:outline-none"
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
      <div className="p-2 pb-5 relative flex gap-2 items-center justify-between border-b bg-[#207855]">
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full bg-black cursor-pointer">
            <img
              src="/profile/img1.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-green-50">{userInfo.full_name}</p>
            <small className="text-xs text-green-50">{defaultUserType}</small>
          </div>
        </div>
        {userRole !== "Household User" && <>
          <MenuOpenIcon onClick={() => setChangeAccount(true)} className="-rotate-90 cursor-pointer text-green-50" />
          <div className={`${changeAccount ? "block" : "hidden"} transition-transform p-2 bg-white absolute w-full text-center left-0 top-0 h-full text-sm`}>
            Change to
            <span onClick={() => ChangeUserType()} className="text-[#207855] cursor-pointer font-bold hover:underline">
              {' '}{defaultUserType == "Household User" ? userRole : "Household User"}
            </span>
            <div onClick={() => setChangeAccount(false)} className="p-1 mt-2 w-fit m-auto cursor-pointer rounded-md bg-red-500 text-white">
              Close
            </div>

          </div>
        </>
        }
      </div>

      <div className="menu">
        <div>
          <h3 className="text-primary p-3 font-semibold">Menu</h3>
          <div className="text-primary">

            {Object.keys(houseHoldSidebarItems[defaultUserType]).map((subCategory) => (
              <div key={subCategory}>
                {houseHoldSidebarItems[defaultUserType][subCategory].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center py-2 px-4 hover:bg-gray-200 rounded-r-full w-11/12 cursor-pointer ${selectedItem === item.action
                      ? "bg-green-100 border-l-4 border-[#207855] text-[#207855]"
                      : ""
                      }`}
                    onClick={() => changeView(item.goto)}
                  >
                    <div className="mr-3">{item.icon}</div>
                    <span>{item.action}</span>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  );
};
