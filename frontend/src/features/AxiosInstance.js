import axios from "axios";
import { store } from '../app/store'

const state = store.getState();
const token = state.sharedData.usersLogin.access_token;

export const instance = axios.create({
    baseURL: `${import.meta.env.BASE_URL}`,
    headers: {
        "Authorization": "Bearer " + token
    },
})
