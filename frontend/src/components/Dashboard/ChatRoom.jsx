import React, { useState, useEffect, useRef } from 'react';
import createAxiosInstance from '../../features/AxiosInstance';
import SendIcon from '@mui/icons-material/Send';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedItem } from '../../features/SharedDataSlice/SharedData';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
export const ChatRoom = () => {
    const [showEmoji, setShowEmoji] = useState(false)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [roomInfo, setRoomInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const instance = createAxiosInstance();
    const user = useSelector(state => state.sharedData.usersLogin);
    const room_id = useSelector(state => state.sharedData.currentChat);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    if (room_id === null) {
        dispatch(setSelectedItem("Messages"))
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getMessages = (page = 1, append = false) => {
        instance.get(`/rooms/${room_id}?page=${page}`)
            .then((res) => {
                const roomData = res.data.results['room'];
                const messagesData = res.data.results['messages'].map((message) => ({
                    ...message,
                    isMine: message.sender === user.user_id,
                }));

                setMessages(prevMessages => append ? [...messagesData, ...prevMessages] : messagesData);
                console.log(messagesData)
                setRoomInfo(roomData);
                setLoading(false); // Set loading to false after data is fetched
                scrollToBottom();
            })
            .catch((err) => {
                console.error(err);
                setLoading(false); // Set loading to false even if there is an error
            });
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                getMessages(newPage, true);
                return newPage;
            });
        }
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        getMessages();
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageData = { content: newMessage, receiver: roomInfo.user1.id === user.user_id ? roomInfo.user2.id : roomInfo.user1.id };

            instance.post('/messages/send', messageData)
                .then((res) => {
                    setMessages([...messages, { content: messageData.content, isMine: true }]);
                    setNewMessage("");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    if (loading) {
        return <div>Loading...</div>; // Loading indicator
    }
    const addEmoji = (emoji) =>{
        setNewMessage(newMessage+emoji.native)
        setShowEmoji(false)
        document.getElementById("msg").focus()
    }

    return (
        <>
            <div className="top-bar  w-full bg-white border-b-2 border-gray-200 p-4 relative text-xl">
                <span title='Back' onClick={() => dispatch(setSelectedItem("Messages"))} className='text-[black] cursor-pointer p-2'>
                    <ArrowBackIcon></ArrowBackIcon>
                </span>
                <span>{roomInfo.user1.id === user.user_id ? roomInfo.user2.first_name + " " + roomInfo.user2.last_name : roomInfo.user1.first_name + " " + roomInfo.user1.user_role}</span>
            </div>
            <div  onClick={() => setShowEmoji(false)} className="messages relative flex flex-col gap-1 p-2 h-[60vh] overflow-y-scroll" onScroll={handleScroll}>
                {messages.map((message, index) => (
                    <div key={index} className={`message w-fit p-2 rounded-full rounded-br-md ${message.isMine ? 'bg-green-100 ml-auto' : 'bg-gray-200'}`}>
                        <span>
                            {message.content}
                        </span>
                        <sub className='text-xs float-right p-2 text-primary'>{message.created ? message.created.split('T')[0] : "now"}</sub>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="new-message w-full gap-2 sticky bottom-0 px-4 border-t-2 border-gray-200 flex justify-between items-center">
                <div onClick={() => setShowEmoji(true)} className="mt-3 flex justify-center items-center bg-green-100 hover:bg-green-200 cursor-pointer p-4 rounded-full">
                    <AddReactionIcon
                        className='cursor-pointer text-green-500 '
                    />
                </div>

                <input
                    type="text"
                    id="msg"
                    className='w-full border-none outline-none py-3 rounded-full pl-4 mt-3 bg-gray-200'
                    value={newMessage}
                    onClick={() => setShowEmoji(false)}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                />
                <div className="mt-3 flex justify-center items-center bg-blue-100 hover:bg-blue-200 cursor-pointer p-4 rounded-full">
                    <SendIcon
                        className='cursor-pointer text-blue-500 '
                        onClick={handleSendMessage}
                    />
                </div>

            </div>
            {showEmoji &&
                <div className="absolute">
                    <Picker data={data}  onEmojiSelect={(emoji)=>addEmoji(emoji)} />
                </div>
            }
        </>
    );
};
