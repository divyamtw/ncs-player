import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true,
});

export const authApi = {
  login: (data) => API.post("/api/auth/login", data),
  register: (data) => API.post("/api/auth/register", data),
  logout: () => API.post("/api/auth/logout"),
  getUser: () => API.get("/api/auth/get-user"),
};

export const songsApi = {
  getStats: () => API.get("/api/songs/stats"),
  getAll: (params) => API.get("/api/songs", { params }),
  getById: (id) => API.get(`/api/songs/${id}`),
  create: (data) => API.post("/api/songs", data),
  update: (id, data) => API.put(`/api/songs/${id}`, data),
  delete: (id) => API.delete(`/api/songs/${id}`),
  togglePopular: (id) => API.patch(`/api/songs/${id}/toggle-popular`),
};

export default API;
