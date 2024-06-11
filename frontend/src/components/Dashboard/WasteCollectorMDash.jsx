// wasteCollectorMDash.js

import React from 'react';
import { useSelector } from 'react-redux';

const WasteCollectorMDash = () => {
  const defaultUserType = useSelector((state) => state.sharedData.defaultUserType);
  const userInfo = useSelector((state) => state.sharedData.usersLogin);
  return (
    <div className="p-6">
      <header className="mb-4 text-primary">
        <h1 className="text-2xl font-bold text-gray-600">Dashboard</h1>
        <p className="text-gray-600">{userInfo.full_name}{" "}Welcome to your dashboard. Here you will find an overview of your activity and notifications.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100  cursor-pointer hover:bg-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Overview</h2>
          <p className="text-blue-800 text-sm">Summary of your recent activities.</p>
        </div>
        <div className="p-4 bg-red-100  cursor-pointer hover:bg-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800">Notifications</h2>
          <p className="text-red-800 text-sm">You have 3 new notifications.</p>
        </div>
        <div className="p-4 bg-green-100  cursor-pointer hover:bg-green-200 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Tasks</h2>
          <p className="text-green-800 text-sm">You have 5 pending tasks.</p>
        </div>
        <div className="p-4 bg-slate-100  cursor-pointer hover:bg-slate-200 rounded-lg">
          <h2 className="text-xl font-semibold text-slate-800">Messages</h2>
          <p className="text-slate-800 text-sm">You have 2 new messages.</p>
        </div>
      </div>
    </div>
  );
}

export default WasteCollectorMDash;
