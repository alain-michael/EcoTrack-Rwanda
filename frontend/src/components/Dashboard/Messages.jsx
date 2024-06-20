import AddIcon from "@mui/icons-material/Add";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import CheckIcon from "@mui/icons-material/Check";
import { DoneAll } from "@mui/icons-material";
import createAxiosInstance from "../../features/AxiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSelectedItem,
  setCurrentChat,
} from "../../features/SharedDataSlice/SharedData";

export const Messages = () => {
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState(false);
  const instance = createAxiosInstance();
  const user = useSelector((state) => state.sharedData.usersLogin);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const goto = useNavigate();

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    if (timestamp == null) {
      return "--:--";
    }

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    if (search !== "") {
      setFilteredChats(
        chats.filter(
          (chat) =>
            chat.other_user.first_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            chat.other_user.last_name
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredChats(chats);
    }
  }, [search, chats]);

  const getRooms = () => {
    console.log("Fetching rooms...");
    instance
      .get("/rooms")
      .then((res) => {
        // console.log("User:", user);
        const updatedRooms = res.data.map((room) => {
          const read_receipts =
            user.email === room.latest_message_receiver &&
            room.latest_message_read === false;
          return {
            ...room,
            read_receipts,
            other_user:
              room.user1.email === user.email ? room.user2 : room.user1,
          };
        });
        setChats(updatedRooms);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      user_role: "Admin",
      email: "",
    },
    onSubmit: (values) => {
      instance
        .post("/rooms/create", values)
        .then((res) => {
          dispatch(setSelectedItem("Chatroom")),
          dispatch(setCurrentChat(res.data.chatroom_id));
        });
    },
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="messages m-8">
      <div className="top-menu block sm:flex justify-between">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search for a chat"
          className="p-2 border border-gray-300 outline-none rounded w-full mb-1 sm:w-1/4"
        />
        <div
          onClick={() => setNewChat(true)}
          className="new-chat cursor-pointer flex items-center px-6 py-2 border bg-green-100 text-[#207855] rounded"
        >
          <AddIcon />
          New Chat
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-600">Chats</h1>
      <div className="chats mt-4 flex flex-col gap-1">
        {filteredChats &&
          filteredChats.map((chat) => (
            <div
              onClick={() => {
                dispatch(setSelectedItem("Chatroom")),
                  dispatch(setCurrentChat(chat.id));
              }}
              key={chat.user1.id + chat.user2.id}
              className={`flex justify-between items-center rounded p-2 py-4 w-full bg-gray-100 hover:bg-green-100 cursor-pointer`}
            >
              <div className="chat">
                <p className="font-bold text-gray-600 text-xl">
                  {chat.other_user.first_name + " " + chat.other_user.last_name}{" "}
                  {chat.read_receipts && !chat.latest_message_read && (
                    <span>
                      <span className="text-blue-600">●</span>
                    </span>
                  )}
                </p>
                <p className="text-gray-600">
                  {!chat.read_receipts && (
                    <DoneAll
                      sx={{
                        color: `${
                          chat.latest_message_read ? "#207855" : "gray"
                        }`,
                      }}
                    />
                  )}{" "}
                  {chat.latest_message}
                </p>
              </div>
              <p>{formatTimestamp(chat.latest_message_time)}</p>
            </div>
          ))}
        {chats.length === 0 && !loading && <p>No chats available</p>}
      </div>
      {newChat && (
        <>
          <div
            onClick={() => setNewChat(false)}
            className="overlay fixed top-0 left-0 w-full h-full bg-black opacity-50"
          ></div>
          <div
            className={`new-chat absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-1/2 ${
              newChat ? "block" : "hidden"
            }`}
          >
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4 bg-gray-200 p-12 rounded-lg"
            >
              <h1 className="text-2xl font-bold text-gray-600 mb-4 text-center">
                {" "}
                Select Contact{" "}
              </h1>
              <FormControl>
                <InputLabel>User Role</InputLabel>
                <Select
                  label="User Role"
                  value={formik.values.user_role}
                  onChange={formik.handleChange}
                  name="user_role"
                  className="w-full"
                >
                  <MenuItem value="Admin"> Admin </MenuItem>
                  <MenuItem value="Household User"> Fellow User </MenuItem>
                  <MenuItem value="Waste Collector"> Collector </MenuItem>
                </Select>
              </FormControl>
              {formik.values.user_role !== "Admin" && (
                <TextField
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  name="email"
                  className="w-full"
                />
              )}
              <button
                type="submit"
                className="p-2 border border-black bg-green-700 text-white rounded"
              >
                Create Chat
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
