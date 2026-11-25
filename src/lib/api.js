import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

export const ticketsApi = {
  list: async (page = 1, limit = 10) =>
    (await api.get("/tickets", { params: { page, limit } })).data,
  create: async (body) => (await api.post("/tickets", body)).data,
  setStatus: async (id, status) => (await api.patch(`/tickets/${id}/status`, { status })).data,
  remove: async (id) => (await api.delete(`/tickets/${id}`)).data,
};