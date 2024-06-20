import React, { useEffect, useState } from 'react';
import requests from '../../assets/requests.svg';
import requestsBlack from '../../assets/requests_black.svg';
import toast, { Toaster } from 'react-hot-toast';


import dots from '../../assets/dots.svg';
import {
  setSelectedItem,
  updateTable,
  setAllCollectionsData,
  setMyCollectionsData,
} from '../../features/SharedDataSlice/SharedData';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import createAxiosInstance from '../../features/AxiosInstance';
function Requests() {
  const instance = createAxiosInstance();
  const dispatch = useDispatch();
  const availableRequests = useSelector(
    (state) => state.sharedData.allCollectionsData,
  );
  const myRequests = useSelector((state) => state.sharedData.myCollectionsData);
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
  const takeJob = (id) => {
    acceptJob(id);
  };
  const fetchAllCollections = async () => {
    instance
      .get('/jobs/available-jobs')
      .then((response) => {
        dispatch(setAllCollectionsData(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAllMyCollections = async () => {
    instance
      .get('/jobs/my-jobs')
      .then((response) => {
        dispatch(setMyCollectionsData(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(()=>{
    fetchAllCollections()
    fetchAllMyCollections()

  },[])
  const acceptJob = async (id) => {
    const body = {
      id: parseInt(id),
    };
    instance.post('/jobs/manage-job', body).then((response) => {
      dispatch(updateTable(parseInt(id)));
      toast.success('Job taken successfully');
    });
  };

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
                  TIME
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="text-small">
              {availableRequests?.map((request, index) => (
                <tr className="bg-gray-200" key={index}>
                  <td className="px-10 py-2">{index + 1}.</td>
                  <td className="px-10 py-2 ">
                    {request.user.first_name} {request.user.last_name}
                  </td>
                  <td className="px-10 py-2">{request.user.email}</td>
                  <td className="px-10 py-2">{request.user.phone_number}</td>
                  <td className="px-10 py-2">
                    {new Date(request.date).toLocaleString()}
                  </td>
                  <td className="px-10 py-2">
                    <button
                      className="w-[80px] h-7 text-sm bg-[#207855] text-white rounded-md  outline-none"
                      onClick={() => takeJob(request.id)}
                    >
                      Take Job
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
                  TIME
                </th>
                <th className="text-left text-gray-500 font-medium px-10 py-2">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {myRequests?.map((request, index) => (
                <tr className="bg-gray-200 " key={request.id}>
                  <td className="px-10 py-2">{index + 1}.</td>
                  <td className="px-10 py-2">
                    {request.user.first_name} {request.user.last_name}
                  </td>
                  <td className="px-10 py-2">{request.user.email}</td>
                  <td className="px-10 py-2">{request.user.phone_number}</td>
                  <td className="px-10 py-2">
                    {new Date(request.date).toLocaleString()}
                  </td>
                  <td className="px-10 py-2">
                    <Link
                      to={`/dashboard/job/${request.id}`}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default Requests;
