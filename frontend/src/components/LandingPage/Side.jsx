import React, { useState, useEffect } from "react";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";
import { getStats } from "../../api/front";

const Side = (props) => {
  const [data, setData] = useState();

  const getStatusCounts = async () => {
    const res = await getStats();
    setData(res || []);
  };
  useEffect(() => {
    getStatusCounts();
  }, []);

  return (
    <div className="w[-450px] max-w-[450px] flex flex-col gap-12">
      <div>
        <div className="flex gap-8">
          <a href="/">
            <img src="/logo.png" className="w-28 h-auto" />
          </a>{" "}
          <div className="font-extrabold text-gray-900 text-3xl">
            Empowering a{" "}
            <span className="text-green-900 block">Greener Future</span>{" "}
          </div>
        </div>
      </div>
      {/* <div className="uppercase text-gray-500 font-medium">
              Welcome to EcoTrack Rwanda!
            </div> */}
      <div className="text-sm text-gray-700">
        At EcoTrack, we are dedicated to fostering sustainable practices and
        empowering communities to make environmentally conscious decisions. Our
        platform connects households and waste collectors, enabling efficient
        and responsible waste management.
      </div>

      {!props.hideLink && (
        <>
          <div className="grid grid-cols-3 gap-6">
            <div className="shadow-md border border-gray-100 p-8 rounded-xl bg-white">
              <div className="font-bold text-gray-900 text-3xl">
                {data?.total_users}+
              </div>
              <div className="text-sm text-w-500">Users</div>
            </div>
            <div className="shadow-md border border-gray-100 p-8 rounded-xl bg-white">
              <div className="font-bold text-gray-900 text-3xl">
                {data?.total_collectors}+
              </div>
              <div className="text-sm text-w-500">Collectors</div>
            </div>
            <div className="shadow-md border border-gray-100 p-8 rounded-xl bg-white">
              <div className="font-bold text-gray-900 text-3xl">
                {data?.total_schedules}+
              </div>
              <div className="text-sm text-w-500">Schedules</div>
            </div>
          </div>
          <div className="mt-5">
            <a
              href="/auth"
              className="p-3 px-4 rounded-md bg-green-900 text-white shadow-4xl"
              rel="noopener noreferrer"
            >
              Get Started
            </a>
          </div>
        </>
      )}

      {props && props.hideLink == "yes" && (
        <>
          <div className="mt-5">
            <a
              href="/"
              className="p-3 px-4 rounded-md text-green-900 bg-white shadow-2xl border border-gray-100"
              rel="noopener noreferrer"
            >
              Homepage
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Side;
