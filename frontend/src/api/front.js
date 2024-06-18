import api from "../features/axios";

export const getStats = async () => {
  return (await api().get(`/count-stats/`)).data;
};
