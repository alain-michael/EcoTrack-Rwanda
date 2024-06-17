import React, { useEffect, useState } from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import createAxiosInstance from "../../features/AxiosInstance";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DataProgressLoad from "../Loads/DataProgressLoad";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import toast from "react-hot-toast";
import Modal from "../sharedComponents/Modal";
import UserDetails from "../users/UserDetails";

const ManageAllUser = () => {
  const instance = createAxiosInstance();
  const [serverError, setServerError] = useState(null);
  const [PatchServerError, setPatchServerError] = useState(null);
  const [PatchClassError, setPatchClassError] = useState("error");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("first_name");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("");
  const itemsPerPage = 5;
  //-------------------get all users

  const getAllUser = () => {
    instance
      .get("/all-users")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        toast.error("Server error");
      });
  };
  useEffect(() => {
    getAllUser();
  }, []);
  //-------------Seacrh
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };
  //------------filter by cols
  const handleFilterRole = (role) => {
    setFilterRole(role);
    setCurrentPage(1);
  };
  //---------------Total Counts
  const getUserCountsByRole = () => {
    return data.reduce((acc, user) => {
      acc[user.user_role] = (acc[user.user_role] || 0) + 1;
      return acc;
    }, {});
  };
  //------------------------ fi default
  const filteredData = data
    .filter((user) => {
      return (
        (filterRole ? user.user_role === filterRole : true) &&
        `${user.first_name} ${user.last_name} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  //------------------pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const userCounts = getUserCountsByRole();
  //----------------Delete User
  const deleteUser = (id) => {
    instance
      .delete(`/ManageUser/${id}`)
      .then((res) => {
        if (res)
          if (res.status == 204) {
            getAllUser();

            toast.success("User deleted");
          } else {
            toast.error("Error While Deleting User Try Again Later");
          }
      })
      .catch((error) => {
        toast.error(error.response?.data?.detail || "Server error");
      });
  };

  //----------------Update User
  const [load, setLoad] = useState(false);
  const UpdateUser = (id, newRole) => {
    setLoad(true);
    instance
      .patch(`/ManageUser/${id}`, newRole)
      .then((res) => {
        if (res.status == 200) {
          getAllUser();
          setSelectedUser(null);
          toast.success("Changed User Account Type Well ");
        } else {
          toast.error("Error While Changing User Account Type Try Later ");
        }
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
        toast.error(
          error.response?.data?.detail || "Server Is Down Try Again Later"
        );
      });
  };
  return (
    <div className="p-4 pt-0 ">
      {PatchServerError && (
        <div
          onClick={() => setPatchServerError(null)}
          className={`${
            PatchClassError == "error"
              ? "bg-red-200 text-red-500"
              : "bg-green-200 text-green-500"
          } p-3 rounded-lg cursor-pointer w-fit m-auto fixed right-10 `}
        >
          {PatchServerError} <HighlightOffIcon />
        </div>
      )}
      <h2 className="text-xl font-bold text-[#207855] p-3 pl-0">
        All User From Eco-Rw
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div
          onClick={() => handleFilterRole("")}
          className="p-4 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
        >
          <h3 className="text-lg font-bold text-primary">All Users</h3>
          <p className="text-gray-700">{data.length} users</p>
        </div>
        {Object.keys(userCounts).map((role) => (
          <div
            key={role}
            onClick={() => handleFilterRole(role)}
            className="p-4 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
          >
            <h3 className="text-lg font-bold text-primary">{role}</h3>
            <p className="text-gray-700">{userCounts[role]} users</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search..."
        className="mb-4 p-2 border border-gray-300 outline-none rounded"
      />
      <div className="w-full overflow-auto">
        <table className="w-full bg-white border">
          <thead>
            <tr className="shadow-lg mb-2 uppercase text-gray-900 font-bold">
              <th className="text-left border-b   px-4 py-2 text-nowrap">#</th>
              <th
                onClick={() => handleSort("first_name")}
                className="text-left border-b  cursor-pointer px-4 py-2 text-nowrap"
              >
                First Name{" "}
                {sortField === "first_name" && <SwapVertIcon fontSize="sm" />}
              </th>
              <th
                onClick={() => handleSort("last_name")}
                className="text-left border-b  cursor-pointer px-4 py-2 text-nowrap"
              >
                Last Name{" "}
                {sortField === "last_name" && <SwapVertIcon fontSize="sm" />}
              </th>
              <th
                onClick={() => handleSort("email")}
                className="text-left border-b  cursor-pointer px-4 py-2 text-nowrap"
              >
                Email {sortField === "email" && <SwapVertIcon fontSize="sm" />}
              </th>
              <th
                onClick={() => handleSort("user_role")}
                className="text-left border-b  cursor-pointer px-4 py-2 text-nowrap"
              >
                Role{" "}
                {sortField === "user_role" && <SwapVertIcon fontSize="sm" />}
              </th>
              <th className="text-center border-b px-4 py-2 text-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {serverError && (
              <tr>
                <td colSpan="5" className="text-red-500 p-2 text-center">
                  {serverError}
                </td>
              </tr>
            )}
            {!serverError &&
              paginatedData.map((user, index) => (
                <tr key={index} className={`bg-white hover:bg-gray-50`}>
                  <td className="border-b px-4 py-2">{index + 1}</td>
                  <td className="border-b px-4 py-2">{user.first_name}</td>
                  <td className="border-b px-4 py-2">{user.last_name}</td>
                  <td className="border-b px-4 py-2">{user.email}</td>
                  <td className="border-b px-4 py-2">{user.user_role}</td>
                  <td className="border-b px-4 py-2">
                    <div className="flex gap-3 justify-end">
                      {user.user_role !== "admin" && (
                        <>
                          <button
                            title="View More User Info"
                            onClick={() => setSelectedUser(user)}
                            className="text-green-700 bg-green-50 p-1 rounded-lg"
                          >
                            <ManageAccountsIcon />
                          </button>
                          <button
                            title="Delete User"
                            onClick={() => deleteUser(user.id)}
                            className="text-red-700 bg-red-50 p-1 rounded-lg"
                          >
                            <PersonRemoveIcon />
                          </button>
                        </>
                      )}
                      {user.user_role === "admin" && "No actions allowed."}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded text-sm"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded text-sm"
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <Modal
          title={`${selectedUser.first_name} ${selectedUser.last_name}`}
          big={true}
          isOpen={true}
          onClose={() => setSelectedUser(null)}
        >
          <UserDetails
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            UpdateUser={UpdateUser}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageAllUser;
