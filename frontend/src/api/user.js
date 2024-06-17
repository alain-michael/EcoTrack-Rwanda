import api from "../features/axios";

export const getUserDetails = async (id) => {
  return (await api().get(`/user/${id}/`)).data;
};
