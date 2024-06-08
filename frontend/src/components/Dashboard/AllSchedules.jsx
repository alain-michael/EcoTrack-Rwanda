import React, { useEffect, useState } from "react";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import StarIcon from '@mui/icons-material/Star';
import MedalIcon from '@mui/icons-material/MilitaryTech';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import AchievementIcon from '@mui/icons-material/WorkspacePremium';
import createAxiosInstance from "../../features/AxiosInstance";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DataProgressLoad from "../Loads/DataProgressLoad";
import SwapVertIcon from '@mui/icons-material/SwapVert';

const AllSchedules = () => {
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

    const getAllSchedules = () => {
        instance.get('schedules/all-schedules')
            .then((res) => {
                setServerError(null);
                setData(Array.isArray(res.data) ? res.data : []);
            })
            .catch((error) => {
                setServerError(error.response?.data?.detail || "Server error");
            });
    }
    useEffect(() => {
        getAllSchedules()
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
    // const getUserCountsByRole = () => {
    //     return data.reduce((acc, user) => {
    //         acc[user.user_role] = (acc[user.user_role] || 0) + 1;
    //         return acc;
    //     }, {});
    // };
    const getScheduleCountsByStatus = () => {
        return data.reduce((acc, user) => {
            acc[user.completed] = (acc[user.completed] || 0) + 1;
            return acc;
        }, {});
    }
    //------------------------ fi default
    const filteredData = data
        .filter((schedule) => {return (filterRole === "" || ''+schedule.completed === filterRole) && schedule.user.first_name.toLowerCase().includes(search.toLowerCase())})
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

    const scheduleCounts = getScheduleCountsByStatus();
    //----------------Delete User
    // const deleteUser = (id) => {
    //     instance.delete(`/ManageUser/${id}`,)
    //         .then((res) => {
    //             if (res)
    //                 if (res.status == 204) {
    //                     getAllSchedules()
                       
    //                     setPatchServerError("Deleted User Well ");
    //                     setPatchClassError("success")
    //                 } else {
    //                     setPatchClassError("error")
    //                     setPatchServerError("Error While Deleting User Try Again Later");
    //                 }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             setPatchClassError("error")
    //             setPatchServerError(error.response?.data?.detail || "Server error");
    //         });
    // }

    //----------------Update User
    const [load, setLoad] = useState(false)
    const UpdateUser = (id, newRole) => {
        setLoad(true)
        instance.patch(`/ManageUser/${id}`, newRole)
            .then((res) => {
                if (res.status == 200) {
                    getAllSchedules()
                    setSelectedUser(null)
                    setPatchServerError("Changed User Account Type Well ");
                    setPatchClassError("success")
                } else {
                    setPatchServerError("Error While Changing User Account Type Try Later ");
                    setPatchClassError("error")
                }
                setLoad(false)
            })
            .catch((error) => {
                setLoad(false)
                console.log(error)
                setPatchClassError("error")
                setPatchServerError(error.response?.data?.detail || "Server Is Down Try Again Later");
            });
    }
    return (
        <div className="p-4 pt-0 ">
            {PatchServerError &&
                <div onClick={() => setPatchServerError(null)} className={`${PatchClassError == "error" ? "bg-red-200 text-red-500" : "bg-green-200 text-green-500"} p-3 rounded-lg cursor-pointer w-fit m-auto fixed right-10 `}>
                    {PatchServerError} <HighlightOffIcon />
                </div>
            }
            <h2 className="text-xl font-bold text-[#207855] p-3 pl-0">All Schedules From Eco-Rw</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div
                    onClick={() => handleFilterRole("")}
                    className={`p-4 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer ${filterRole == '' ? "bg-gray-200" : ""}`}
                >
                    <h3 className={"text-lg font-bold text-primary"}>All Schedules</h3>
                    <p className="text-gray-700">{data.length} schedules</p>
                </div>
                {Object.keys(scheduleCounts).map((status) => (
                    <div
                        key={status}
                        onClick={() => handleFilterRole(status)}
                        className={`p-4 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer ${filterRole == status ? "bg-gray-200" : ""}`}
                    >
                        <h3 className="text-lg font-bold text-primary">{status === 'true' ? "Completed" : "Incomplete"}</h3>
                        <p className="text-gray-700">{scheduleCounts[status]} users</p>
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
                <table className="w-full bg-white">
                    <thead>
                        <tr className="shadow-lg mb-2">
                            <th className="text-left text-gray-500 font-medium  px-10 py-2 text-nowrap">#</th>
                            <th onClick={() => handleSort("user")} className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">Household User {sortField === "user" && <SwapVertIcon />}</th>
                            <th onClick={() => handleSort("date")} className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">Date {sortField === "date" && <SwapVertIcon />}</th>
                            <th onClick={() => handleSort("repeat")} className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">Repetition {sortField === "repeat" && <SwapVertIcon />}</th>
                            <th onClick={() => handleSort("collector_name")} className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">Collector Name {sortField === "collector_name" && <SwapVertIcon />}</th>
                            <th onClick={() => handleSort("completed")} className="text-left text-gray-500 font-medium cursor-pointer px-10 py-2 text-nowrap">Completed {sortField === "completed" && <SwapVertIcon />}</th>
                            {/* <th className="text-primary p-3">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {serverError && (
                            <tr>
                                <td colSpan="5" className="text-red-500 p-2 text-center">{serverError}</td>
                            </tr>
                        )}
                        {!serverError && paginatedData.map((schedule, index) => {
                            const date = new Date(schedule.date);
                            const formattedDate = date.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });
                            const formattedTime = date.toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });                        
                            return (
                            <>
                                    <tr key={schedule.id} className={`${index & 1 ? "bg-slate-200" : "bg-slate-50"} text-primary hover:bg-gray-100`}>
                                        <td className="border-b px-4 py-2">{index + 1}</td>
                                        <td className="border-b px-4 py-2">{schedule.user.first_name} {schedule.user.last_name}</td>
                                        <td className="border-b px-4 py-2">{formattedDate} {formattedTime}</td>
                                        <td className="border-b px-4 py-2">{schedule.repeat}</td>
                                        <td onClick={() => setSelectedUser(schedule.collector)} className={`border-b px-4 py-2 cursor-pointer ${schedule.collector_name? "text-blue-400" : "text-yellow-500"}`}>{schedule.collector_name ? schedule.collector_name : "pending"}</td>
                                        <td className="border-b px-4 py-2">{schedule.completed ? "Completed" : "Incomplete"}</td>
                                        <td className="border-b px-4 py-2 flex gap-3 justify-center">
                                        </td>
                                    </tr>
                            </>
                        )})}
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
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded text-sm"
                >
                    Next
                </button>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded w-5/6 max-md:w-11/12 m-auto mt-10">
                        <h2 className="text-xl mb-2 font-bold">User Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <p><strong>First Name:</strong> {selectedUser.first_name}</p>
                            <p><strong>Last Name:</strong> {selectedUser.last_name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <div className="flex gap-2"><strong>Role:</strong>
                                <select onChange={(e) => UpdateUser(selectedUser.id, { "user_role": e.target.value })} className="p-1 rounded-md cursor-pointer outline-none">
                                    <option value={selectedUser.user_role}>{selectedUser.user_role}</option>
                                    <option value="Waste Collector">Waste Collector</option>
                                    <option value="Household User">Household User</option>
                                </select>
                               {load && <DataProgressLoad />}
                            </div>
                        </div>
                        <h2 className="text-primary text-xl mt-2 mb-2 font-bold">Archivements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div className="p-4 bg-blue-100 rounded flex items-center text-sm">
                                <StarIcon className="text-blue-500 mr-2 " />
                                <div>
                                    <h4 className="font-bold">Achievement 1</h4>
                                    <p>Description for achievement 1.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-green-100 rounded flex items-center text-sm">
                                <MedalIcon className="text-green-500 mr-2 " />
                                <div>
                                    <h4 className="font-bold">Achievement 2</h4>
                                    <p>Description for achievement 2.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-yellow-100 rounded flex items-center text-sm">
                                <TrophyIcon className="text-yellow-500 mr-2 " />
                                <div>
                                    <h4 className="font-bold">Achievement 3</h4>
                                    <p>Description for achievement 3.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-red-100 rounded flex items-center text-sm">
                                <AchievementIcon className="text-red-500 mr-2 " />
                                <div>
                                    <h4 className="font-bold">Achievement 4</h4>
                                    <p>Description for achievement 4.</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="mt-4 text-red-500 bg-red-100 p-2 rounded-lg text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllSchedules;
