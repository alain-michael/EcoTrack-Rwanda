import AddIcon from '@mui/icons-material/Add';
import { MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useFormik } from 'formik';

export const Messages = () => {
    const [search, setSearch] = useState("");
    const [chats, setChats] = useState([]);
    const [newChat, setNewChat] = useState(false);

    const formik = useFormik(
        {
            initialValues: {
                user_type: "Admin",
                email: "",
            },
            onSubmit: (values) => {
                console.log(values);
            },
        }
    )
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
                <div onClick={() => setNewChat(true)} className="new-chat cursor-pointer flex items-center px-6 py-2 border bg-green-100 text-[#207855] rounded"><AddIcon />New Chat</div>
            </div>
            <div className="chats text-2xl font-bold text-gray-600">
                <h1>Chats</h1>
                {chats && chats.map((chat) => (
                    <p>{chat}</p>
                ))}
                <p>No chats available</p>
            </div>
            {newChat &&
            <>
            <div onClick={() => setNewChat(false)} className="overlay fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <div className={`new-chat absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-1/2 ${newChat ? "block" : "hidden"}`}>
                <form className='flex flex-col gap-4 bg-gray-200 p-12 rounded-lg'>
                    <h1 className='text-2xl font-bold text-gray-600 mb-4 text-center'> Select Contact </h1>
                    <FormControl>
                        <InputLabel>User Role</InputLabel>
                        <Select label="User Role" value={formik.values.user_type} onChange={formik.handleChange} name='user_type' className="w-full">
                            <MenuItem value="Admin"> Admin </MenuItem>
                            <MenuItem value="Household User"> Fellow User </MenuItem>
                            <MenuItem value="Waste Collector"> Collector </MenuItem>
                        </Select>
                    </FormControl>
                    {formik.values.user_type != "Admin" && <TextField label="Email" value={formik.values.email} onChange={formik.handleChange} name='email' className="w-full" />}
                    <button type="submit" className="p-2 border border-black bg-green-700 text-white rounded">Create Chat</button>
                </form>
            </div>
            </>
            }
        </div>
    );
}