import React, { useState, useEffect, useRef } from 'react';
import createAxiosInstance from '../../features/AxiosInstance';
import SendIcon from '@mui/icons-material/Send';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedItem } from '../../features/SharedDataSlice/SharedData';

export const ChatRoom = () => {
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

    return (
        <>
            <div className="top-bar fixed w-full bg-white border-b-2 border-gray-200 p-4 relative text-xl">
                <span>{roomInfo.user1.id === user.user_id ? roomInfo.user2.first_name + " " + roomInfo.user2.last_name : roomInfo.user1.first_name + " " + roomInfo.user1.last_name}</span>
            </div>
            <div className="messages relative flex flex-col gap-1 h-[68vh] overflow-y-scroll" onScroll={handleScroll}>
                {messages.map((message, index) => (
                    <div key={index} className={`message w-1/2 p-2 rounded-lg ${message.isMine ? 'bg-green-200 ml-auto' : 'bg-gray-200'}`}>
                        {message.content}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="new-message w-full sticky bottom-0 bg-white px-4 border-t-2 border-gray-200 flex justify-between items-center">
                <input 
                    type="text" 
                    className='w-full border-none outline-none py-3' 
                    value={newMessage} 
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                />
                <SendIcon 
                    className='cursor-pointer text-blue-500' 
                    onClick={handleSendMessage}
                />
            </div>
        </>
    );
};
