import React from 'react';
import { Outlet } from 'react-router-dom';
import history from '../../assets/history.svg';
import requests from '../../assets/requests.svg';
import settings from '../../assets/settings.svg';

function RequestsLayout() {
  const listItemStyle = 'flex gap-2 cursor-pointer';
  return (
    <div className="w-full">
      <div className="flex ">
        <div className="relative left-0 top-0 bg-primary-100 h-[100vh] px-10 py-5 max-md:hidden">
          <div>
            <h2 className="text-white font-medium">ECOTRACK</h2>
          </div>
          <div className="my-10 ">
            <ul className="text-white space-y-10">
              <li className={listItemStyle}>
                <img src={requests} alt="" className="w-[25px]" />
                <a href="#"> Requests</a>{' '}
              </li>
              <li className={listItemStyle}>
                <img src={history} alt="" className="w-[25px]" />
                <a href="#"> History</a>{' '}
              </li>
              <li className={listItemStyle}>
                <img src={settings} alt="" className="w-[25px]" />
                <a href="#"> Settings</a>{' '}
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto">
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestsLayout;
