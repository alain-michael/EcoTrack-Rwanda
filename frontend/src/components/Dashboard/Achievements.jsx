import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../api/user";
import DataProgressLoad from "../Loads/DataProgressLoad";
import UserAchievements from "../achievements/UserAchievemnts";

export const Achievements = () => {
  const userInfo = useSelector((state) => state.sharedData.usersLogin);

  const [data, setData] = useState();
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

  return (
    <>
      <header className="mt-4 p-5 pb-6 text-primary">
        <h1 className="text-2xl font-bold text-gray-600">Achievements</h1>
        <p className="text-gray-600">
          Here you will find an list of your achievements
        </p>
      </header>
      <div className="achievement-cards flex justify-around">
        {loading && <DataProgressLoad />}

        {data && (
          <div className="w-full gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <UserAchievements achievements={data.achievements} />
          </div>
        )}
      </div>
    </>
  );
};
