import axios, { AxiosError } from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { resetStateToDefault } from './SharedDataSlice/SharedData';
import toast, { Toaster } from 'react-hot-toast';
import { store } from '../app/store';

function createAxiosInstance() {
  const dispatch = useDispatch();
  const info = localStorage.getItem('persist:root');
  let token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxODUzOTUzOCwiaWF0IjoxNzE4NDUzMTM4LCJqdGkiOiJjZjI5MmY4ZmI1NGI0ODY3YmFjOTBiMTNlNzE1MTVjYSIsInVzZXJfaWQiOjIsImVtYWlsIjoiZGVhbmRhcnlsN0BnbWFpbC5jb20iLCJ1c2VyX3JvbGUiOiJIb3VzZWhvbGQgVXNlciIsImlzX2FjdGl2ZSI6dHJ1ZSwiaXNfc3RhZmYiOmZhbHNlLCJmdWxsX25hbWUiOiIgZGVhbiIsImFkZHJlc3NlcyI6eyJsb25naXR1ZGUiOm51bGwsImxhdGl0dWRlIjpudWxsfX0.oNrg2wIbdNjxiolx65icPcdzqUDsJfH6sfUKs1a_k7k';
  if (info) {
    const userInfo = JSON.parse(JSON.parse(info).usersLogin);
    token = userInfo.access;
  }
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorObj = error;
      if (errorObj.response?.status == 401) {
        window.location.href = '/auth';
      } else {
        const errorData = errorObj.response?.data;
        const errorMessage = errorData
          ? errorData.message || errorData.error || errorObj.message
          : 'Failed';
        toast.error(errorMessage);
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const api = () => createAxiosInstance();

export default createAxiosInstance;
