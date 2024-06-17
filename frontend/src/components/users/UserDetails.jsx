import React, { useEffect, useState } from "react";
import DataProgressLoad from "../Loads/DataProgressLoad";
import { getUserDetails } from "../../api/user";
import UserAchievements from "../achievements/UserAchievemnts";

const UserDetails = (props) => {
  const { selectedUser, setSelectedUser, UpdateUser } = props;

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getDetails = async () => {
    setLoading(true);
    const res = await getUserDetails(selectedUser.id);
    setData(res || []);
    setLoading(false);
  };
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <div className="bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <p>
            <strong>First Name:</strong> {selectedUser.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {selectedUser.last_name}
          </p>
          <p>
            <strong>Points:</strong> {data?.totalPoints}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>

          <div className="flex gap-2">
            <strong>Role:</strong>
            <select
              onChange={(e) =>
                UpdateUser(selectedUser.id, { user_role: e.target.value })
              }
              className="p-1 rounded-md cursor-pointer outline-none"
            >
              <option value={selectedUser.user_role}>
                {selectedUser.user_role}
              </option>
              <option value="Waste Collector">Waste Collector</option>
              <option value="Household User">Household User</option>
            </select>
            {loading && <DataProgressLoad />}
          </div>
        </div>

        <div className="mt-12"></div>
        {data && (
          <div className="w-full gap-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <UserAchievements
              achievements={data.achievements}
              showImage={false}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetails;
