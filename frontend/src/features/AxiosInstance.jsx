import axios from "axios";
import { useSelector } from "react-redux";

function createAxiosInstance() {
    const userInfo = useSelector(state => state.sharedData.usersLogin);
    const token = userInfo.access;

    return axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
        headers: {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
}

export default createAxiosInstance;
