import { api } from "../features/AxiosInstance";

export const createAchievement = async (data) => {
  return (
    await api().post("/achievements/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};

export const updateAchievement = async (id, data) => {
  return (
    await api().put(`/achievements/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};

export const deleteAchievement = async (id) => {
  return (await api().delete(`/achievements/${id}/`)).data;
};

export const getAchievement = async (id) => {
  return (await api().get(`/achievements/${id}/`)).data;
};

export const getAchievements = async () => {
  return (await api().get(`/achievements/`)).data;
};
