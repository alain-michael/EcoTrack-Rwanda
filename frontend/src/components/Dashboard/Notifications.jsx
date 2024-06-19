import React, { useState, useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import api from "../../features/axios";
import { useSelector, useDispatch } from "react-redux";
import { setNotificationOpen } from "../../features/SharedDataSlice/SharedData";

export const Notifications = () => {
    const [notifications, setNotifications] = useState({'notifications':[]});
    const notificationOpen = useSelector((state) => state.sharedData.notificationOpen);

    const dispatch = useDispatch();


    const getNotifications = () => {
        api().get("/notifications").then((res) => {
            console.log(res.data);
            setNotifications(res.data);
        })
    };

    useEffect(() => {
      if (notificationOpen){
        getNotifications();
      }
    }, [notificationOpen]);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        if (timestamp == null) {
          return "--:--";
        }
    
        const isToday = date.toDateString() === now.toDateString();
    
        if (isToday) {
          return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } else {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }    


    return (
        <div className='m-4'>
            <div className="title text-xl font-extrabold text-[#207855] py-4 border-b-2 border-[#207855]">
            <button
            className="text-[#207855] rounded-md focus:outline-none mr-2"
            name="btn"
            id="btn"
            onClick={() => dispatch(setNotificationOpen(false))}
            >
                <CancelIcon style={{ fontSize: "30px" }} />   
            </button>
            Notifications
            </div>
            <div className="notis">
                {notifications.notifications.length == 0 && <p className='p-2 py-4'>No new notifications</p>}
                {notifications.notifications.map((notification) => (
                    <div className="notification flex justify-between border-b-2 p-2 py-4 m-0 border-[#207855] items-end">
                        <p>{notification.message}</p>
                        <p className='text-xs'>{formatTimestamp(notification.created)}</p>
                    </div>
                ))} 
            </div>
        </div>
    );
}