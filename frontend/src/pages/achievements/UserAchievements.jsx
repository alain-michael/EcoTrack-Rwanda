import React, { useState, useEffect } from "react";
import DataProgressLoad from "../../components/Loads/DataProgressLoad";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import createAxiosInstance from "../../features/AxiosInstance";
import {
  deleteAchievement,
  getAchievements,
  updateAchievement,
} from "../../api/achievements";
import toast from "react-hot-toast";
import Modal from "../../components/sharedComponents/Modal";
import AchievementForm from "../../components/achievements/AchievementForm";
import AchievementDetails from "../../components/achievements/AchievementDetails";

const UserAchievements = () => {
  const instance = createAxiosInstance();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(undefined);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getAllAchievements = async () => {
    setLoading(true);
    const res = await getAchievements();
    setData(res || []);
    setLoading(false);
  };
  useEffect(() => {
    getAllAchievements();
  }, []);

  const UpdateUser = (id, data) => {
    setLoading(true);
    updateAchievement
      .put(id, data)
      .then((res) => {
        if (res.status === 200) {
          getAllAchievements(); // Correct function name
          setSelectedAchievement(null);
          toast.success("Changed Achievement Account Type Well");
        } else {
          toast.error(
            "Error While Changing Achievement Account Type Try Later"
          );
        }
        setLoading(false); // Correct state update
      })
      .catch((error) => {
        setLoading(false); // Correct state update
        console.log(error);
        setError(error); // Handle error
      });
  };

  const handleViewDetails = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const handleDeleteAchievement = async (id) => {
    const res = await deleteAchievement(id);
    setData(data.filter((achievement) => achievement.id !== id));
    toast.success("Deleted");
  };

  const handleCloseModal = () => {
    setSelectedAchievement(null);
  };

  if (loading) {
    return <DataProgressLoad />;
  }

  const closeModal = () => {
    isFormOpen && setIsFormOpen(false);
    selectedAchievement && setSelectedAchievement(undefined);
    detailsOpen && setDetailsOpen(false);

    console.log(detailsOpen, isFormOpen, selectedAchievement);
  };
  return (
    <div className="p-4 pt-0">
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={closeModal}
          title={`${
            selectedAchievement === undefined
              ? "New achievement"
              : `Update ${selectedAchievement?.name}`
          }`}
        >
          <AchievementForm
            close={closeModal}
            achievements={data}
            achievement={selectedAchievement}
            onSuccess={() => getAllAchievements()}
          />
        </Modal>
      )}

      {detailsOpen && selectedAchievement && (
        <Modal
          isOpen={detailsOpen}
          onClose={closeModal}
          title={`Update ${selectedAchievement?.name}
          `}
        >
          <AchievementDetails
            achievement={selectedAchievement}
            achievements={data}
          />
        </Modal>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-bold text-[#207855] p-3 pl-0">
          User Achievements
        </h2>
        <div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-white bg-green-900 p-2 rounded-lg text-sm"
          >
            Create
          </button>
        </div>
      </div>

      <table className="w-full bg-white border-separate border-spacing-y-6">
        <thead>
          <tr className="">
            <th className="text-left text-gray-500 font-medium px-10 py-2 text-nowrap"></th>

            <th className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap"></th>
            <th className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">
              Frequency
            </th>
            <th className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">
              Points
            </th>
            <th className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">
              Preceding
            </th>
            <th className="text-primary p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((achievement, index) => (
            <tr
              key={achievement.id}
              className={`bg-white shadow rounded-lg text-primary cursor-pointer hover:shadow-xl hover:ring-0`}
            >
              <td className="border-b px-4 py-2">
                <img src={achievement.image} className="h-24 w-24 rounded" />
              </td>
              <td className="border-b px-4 py-2">
                {achievement.name}
                <br /> {achievement.type}
              </td>
              <td className="border-b px-4 py-2">{achievement.points}</td>
              <td className="border-b px-4 py-2">{achievement.frequency}</td>
              <td className="border-b px-4 py-2">
                {data.find((ach) => ach.id === achievement.preceding)?.name}
              </td>
              <td className="border-b px-4 py-2">
                <button
                  title="View Details"
                  onClick={() => {
                    setSelectedAchievement(achievement);
                    setDetailsOpen(true);
                  }}
                  className="text-blue-500 p-1 rounded-lg ml-2"
                >
                  <RemoveRedEyeOutlined />
                </button>
                <button
                  title="Update"
                  onClick={() => {
                    setIsFormOpen(true);
                    setSelectedAchievement(achievement);
                  }}
                  className="text-green-500 p-1 rounded-lg ml-2"
                >
                  <DriveFileRenameOutlineIcon />
                </button>
                <button
                  title="Delete"
                  onClick={() => handleDeleteAchievement(achievement.id)}
                  className="text-red-500 p-1 rounded-lg ml-2"
                >
                  <DeleteOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAchievements;
