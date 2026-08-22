import { api } from "./api";
import { ApiResponse, User } from "../types";

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/login",
      {
        email,
        password,
      },
    );
    if (res.data.data?.token) {
      localStorage.setItem("tradeslot_token", res.data.data.token);
      localStorage.setItem(
        "tradeslot_user",
        JSON.stringify(res.data.data.user),
      );
    }
    return res.data;
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "CUSTOMER" | "TRADER";
  }) {
    const res = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/register",
      data,
    );
    if (res.data.data?.token) {
      localStorage.setItem("tradeslot_token", res.data.data.token);
      localStorage.setItem(
        "tradeslot_user",
        JSON.stringify(res.data.data.user),
      );
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data;
  },

  logout() {
    localStorage.removeItem("tradeslot_token");
    localStorage.removeItem("tradeslot_user");
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("tradeslot_user");
    return stored ? JSON.parse(stored) : null;
  },
};
