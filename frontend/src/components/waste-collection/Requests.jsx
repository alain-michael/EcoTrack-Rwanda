import React, { useState } from 'react';
import requests from '../../assets/requests.svg';
import requestsBlack from '../../assets/requests_black.svg';
import toast, { Toaster } from 'react-hot-toast';


import dots from '../../assets/dots.svg';
import { setSelectedItem } from '../../features/SharedDataSlice/SharedData';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import createAxiosInstance from '../../features/AxiosInstance';
function Requests() {
  const instance = createAxiosInstance();
  const dispatch = useDispatch();
  const changeView = (item) => {
    dispatch(setSelectedItem(item));
  };
  const [showAvailableRequests, setShowAvailableRequests] = useState(true);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const showAvailableRequestsHandler = () => {
    setShowAvailableRequests(true);
    setShowMyRequests(false);
  };
  const showMyRequestsHandler = () => {
    setShowMyRequests(true);
    setShowAvailableRequests(false);
  };
  const takeJob = () => {
    toast.success('Job taken successfully');
  };
  const fetchAllCollections = async () => {
    instance.get('/jobs/available-jobs').then((response) => {
      console.log(response.data);
    });
  };

  fetchAllCollections();

  return (
    <div className="mt-10">
      <div className="flex space-x-46"></div>
      <div className="flex">
        <div
          className={
            showAvailableRequests
              ? ' bg-gray-200 flex py-3 px-12 cursor-pointer'
              : ' bg-gray-100 flex py-3 px-12 cursor-pointer'
          }
          onClick={showAvailableRequestsHandler}
        >
          <img src={requestsBlack} alt="" className="w-[20px] mr-1" />
          <p>Available Requests</p>
        </div>
        <div
          className={
            showMyRequests
              ? ' bg-gray-200 flex py-3 px-12 cursor-pointer '
              : ' bg-gray-100 flex py-3 px-12 cursor-pointer'
          }
          onClick={showMyRequestsHandler}
        >
          <img src={requestsBlack} alt="" className="w-[20px] mr-1" />
          <p>My Requests</p>
        </div>
      </div>
      {showAvailableRequests ? (
        <div className="flex w-full overflow-x-auto">
          <table className="mt-2 border border-gray-100 shadow-md text-sm">
            <thead className="shadow-lg mb-2">
              <tr className="">
                <th className="text-left text-gray-500 font-medium  px-10 py-2">
                  #
                </th>
                <th className="text-left text-gray-500 font-medium  px-10 py-2">
                  NAME
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  EMAIL
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  PHONE
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  ADDRESS
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  REQUEST
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="text-small">
              <tr className="bg-gray-200 ">
                <td className="px-10 py-2">1.</td>
                <td className="px-10 py-2 ">John Doe</td>
                <td className="px-10 py-2">johndoe@mail.com</td>
                <td className="px-10 py-2">1234567890</td>
                <td className="px-10 py-2">123, Main Street, Lagos</td>
                <td className="px-10 py-2">Plastic</td>
                <td className="px-10 py-2">
                  <button
                    className="w-[80px] h-7 text-sm bg-[#207855] text-white rounded-md  outline-none"
                    onClick={takeJob}
                  >
                    Take Job
                  </button>
                </td>
              </tr>
              <tr className="">
                <td className="  px-10 py-2">2.</td>
                <td className="  px-10 py-2">John Doe</td>
                <td className=" px-10 py-2">johndoe@mail.com</td>
                <td className=" px-10 py-2">1234567890</td>
                <td className=" px-10 py-2">123, Main Street, Lagos</td>
                <td className=" px-10 py-2">Plastic</td>
                <td className="px-10 py-2">
                  <a href="#" className="">
                    <button
                      className="w-[80px] h-7 text-sm bg-[#207855] text-white rounded-md  outline-none"
                      onClick={takeJob}
                    >
                      Take Job
                    </button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex">
          <table className="mt-2 border border-gray-100 shadow-md text-sm">
            <thead className="shadow-lg mb-2">
              <tr className="">
                <th className="text-left text-gray-500 font-medium  px-10 py-2">
                  #
                </th>
                <th className="text-left text-gray-500 font-medium  px-10 py-2">
                  NAME
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  EMAIL
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  PHONE
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  ADDRESS
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  TIME
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-200 ">
                <td className="px-10 py-2">1.</td>
                <td className="px-10 py-2">John Doe</td>
                <td className="px-10 py-2">johndoe@mail.com</td>
                <td className="px-10 py-2">1234567890</td>
                <td className="px-10 py-2">123, Main Street, Lagos</td>
                <td className="px-10 py-2">10:00 PM</td>
                <td className="px-10 py-2">
                  <Link
                    href="/dashboard/job/id"
                    className=""
                    onClick={() => {
                      changeView('Map');
                    }}
                  >
                    <button className="w-[80px] h-7 text-sm bg-[#207855] text-white rounded-md  outline-none">
                      Start Job
                    </button>
                  </Link>
                </td>
              </tr>
              <tr className="">
                <td className="px-10 py-2">2.</td>
                <td className="px-10 py-2">John Doe</td>
                <td className="px-10 py-2">johndoe@mail.com</td>
                <td className="px-10 py-2">1234567890</td>
                <td className="px-10 py-2">123, Main Street, Lagos</td>
                <td className="px-10 py-2">10:00 PM</td>
                <td className="px-10 py-2">
                  <Link
                    href="/dashboard/job/id"
                    className=""
                    onClick={() => {
                      changeView('Map');
                    }}
                  >
                    <button className="w-[80px] h-7 text-sm bg-[#207855] text-white rounded-md  outline-none">
                      Start Job
                    </button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default Requests;
