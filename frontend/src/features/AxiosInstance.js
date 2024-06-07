import axios from 'axios';
import { store } from '../app/store';

const state = store.getState();
const token = state.sharedData.usersLogin.access_token;

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization:
      'Bearer ' +
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4MDA0OTUzLCJpYXQiOjE3MTc3ODg5NTMsImp0aSI6IjE0ZmM2MzA4Yjg1YjQ5NWI5MzVkMWE3Y2Y2ZGU4NmY4IiwidXNlcl9pZCI6MywiZW1haWwiOiJtYXJ5amFuZUBtYWlsLmNvbSIsInVzZXJfcm9sZSI6Ildhc3RlIENvbGxlY3RvciIsImlzX2FjdGl2ZSI6dHJ1ZSwiaXNfc3RhZmYiOmZhbHNlLCJmdWxsX25hbWUiOiIgZGVhbiJ9.2V4hEsDLXkbLH4jcqfZoHyaQNTSdoVAIoT7AYci7Ek8',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
