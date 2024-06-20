// wasteCollectorMDash.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../api/user";
import DataProgressLoad from "../Loads/DataProgressLoad";
import toast from "react-hot-toast";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Redeem from "@mui/icons-material/Redeem";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import Checklist from "@mui/icons-material/Checklist";
import { setNotificationOpen, setSelectedItem } from "../../features/SharedDataSlice/SharedData";
import api from "../../features/axios";

const WasteCollectorMDash = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const getNotifications = () => {
    api().get("/notifications?type=count").then((res) => {
      console.log(res.data);
      setNotifications(res.data);
    })
  }

  useEffect(() => {
    getNotifications();
  }, []);

  const getUnreadMessages = () => {
    api().get("/messages/unread-count").then((res) => {
      setUnreadMessages(res.data);
    })
  }

  useEffect(() => {
    getUnreadMessages();
  }, []);

  const changeView = (item) => {
    dispatch(setSelectedItem(item));
  };

  const defaultUserType = useSelector(
    (state) => state.sharedData.defaultUserType
  );
  const userInfo = useSelector((state) => state.sharedData.usersLogin);

  const [data, setData] = useState();
  const notificationOpen = useSelector((state) => state.sharedData.notificationOpen);
  const [loading, setLoading] = useState(true);

  const getDetails = async () => {
    setLoading(true);
    const res = await getUserDetails(userInfo.user_id);
    setData(res || []);
    setLoading(false);
  };
  useEffect(() => {
    getDetails();
  }, []);

  const handleCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      toast.success("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy text");
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="mt-4 p-5 pb-2 text-primary">
        <h1 className="text-2xl font-bold text-gray-600">Dashboard</h1>
        <p className="text-gray-600">
          {userInfo.full_name} Welcome to your dashboard. Here you will find an
          overview of your activity and notifications.
        </p>
      </header>

      <div className="bg-white p-5 rounded-md">
        {loading && <DataProgressLoad />}
        {data && (
          <>
            <div className={`${!notificationOpen? 'lg:grid-cols-3 xl:grid-cols-4':''} grid sm:grid-cols-2  gap-6`}>
              <div className="bg-gray-100 hover:bg-gray-200 flex justify-between h-24 rounded-lg items-center">
                <div className=" p-4 ">
                  <div
                    className="text-leftfont-medium text-sm text-gray-500 uppercase"
                    onClick={() => handleCopy(data.sharecode)}
                  >
                    share code
                    <span className="pl-2">
                      <ContentCopyOutlined className="w-4" fontSize="lg" />
                    </span>
                  </div>
                  <div className="text-left font-bold text-2xl text-gray-900 uppercase">
                    {data.sharecode}
                  </div>
                </div>

                <div className=" p-4">
                  <div className="text-right font-medium text-sm text-gray-500 uppercase">
                    Points
                  </div>
                  <div className="text-right font-bold text-4xl text-gray-900 uppercase">
                    {data.totalPoints}
                  </div>
                </div>
              </div>

              <div
                onClick={() => changeView("Achievements")}
                className="p-4 bg-green-100 overflow-hidden  cursor-pointer hover:bg-green-200 bg-opacity-50 rounded-lg flex gap-4 items-center"
              >
                <div>
                  <Redeem style={{ color: "green", fontSize: "45px" }} />
                </div>{" "}
                <div>
                  <h2 className="text-xl font-semibold text-green-800">
                    Achievements
                  </h2>
                  <p className="text-green-800 text-sm">
                    {data &&
                      data.achievements.filter(
                        (ach) => ach.completedDate != null
                      ).length}{" "}
                    completed
                  </p>
                </div>
              </div>

              <div onClick={() => dispatch(setNotificationOpen(true))} className="p-4 bg-orange-100  cursor-pointer hover:bg-orange-200 bg-opacity-50 rounded-lg flex gap-4 items-center">
                <div>
                  <Checklist style={{ color: "orange", fontSize: "45px" }} />
                </div>{" "}
                <div>
                  <h2 className="text-xl font-semibold text-orange-800">
                    {defaultUserType === "Waste Collector" ? "Tasks" : "Notifications"}
                  </h2>
                  <p className="text-orange-800 text-sm">{notifications.notifications_count} {defaultUserType === "Waste Collector" ? "Pending Tasks" : "Unread Notifications" }</p>
                </div>
              </div>

              <div onClick={() => changeView("Messages")} className="p-4 bg-blue-100  cursor-pointer hover:bg-blue-200 bg-opacity-50 rounded-lg flex gap-4 items-center">
                <div>
                  <QuestionAnswer style={{ color: "blue", fontSize: "45px" }} />
                </div>{" "}
                <div>
                  <h2 className="text-xl font-semibold text-blue-800">
                    Messages
                  </h2>
                  <p className="text-blue-800 text-sm">{unreadMessages} new messages</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 px-5">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-600">Recent logs</h1>
          <p>Recent 10 logs</p>
          <div className="mt-2 flex flex-col gap-2">
            {loading && <DataProgressLoad />}
            {data && (
              <>
                {data.logs.length == 0 && (
                  <p className="text-xs">There is no log yet!</p>
                )}
                {data.logs.slice(0, 10).map((log, index) => (
                  <div
                    key={index}
                    className={`w-full border-l border-gray-100 rounded-md p-2 border-2 flex gap-4 items-center `}
                  >
                    <div>
                      {log.earned ? (
                        <Redeem style={{ color: "green" }} />
                      ) : (
                        <InfoOutlined style={{ color: "blue" }} />
                      )}
                    </div>
                    <div>
                      <div>{log.text}</div>
                      <div className="text-xs font-light">
                        {new Date(log.date).toDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteCollectorMDash;
