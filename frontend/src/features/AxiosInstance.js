import axios from 'axios';
import { store } from '../app/store';

const state = store.getState();
const token = state.sharedData.usersLogin.access;

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization:
      'Bearer ' +
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4Mzk5NjY5LCJpYXQiOjE3MTc3OTQ4NjksImp0aSI6IjNjYjgyY2MwNzg4MzRhMzQ4NzAyZTYyM2M1NzJmYTVmIiwidXNlcl9pZCI6MSwiZW1haWwiOiJtYXJ5amFuZUBtYWlsLmNvbSIsInVzZXJfcm9sZSI6Ildhc3RlIENvbGxlY3RvciIsImlzX2FjdGl2ZSI6dHJ1ZSwiaXNfc3RhZmYiOmZhbHNlLCJmdWxsX25hbWUiOiIgZGVhbiJ9.j_WVFw4a9mLc-nP2V5FR0W2X-wPb3Ej-PoXUD4H2h3I',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
