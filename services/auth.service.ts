import { api } from "./api";
import { ApiResponse, User } from "../types";

function setAuthCookies(token: string) {
  if (typeof document !== "undefined") {
    const expires = "max-age=604800; path=/; SameSite=Lax";
    document.cookie = `tradeslot_token=${token}; ${expires}`;
    document.cookie = `token=${token}; ${expires}`;
    document.cookie = `accessToken=${token}; ${expires}`;
  }
}

function clearAuthCookies() {
  if (typeof document !== "undefined") {
    const expired = "path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `tradeslot_token=; ${expired}`;
    document.cookie = `token=; ${expired}`;
    document.cookie = `accessToken=; ${expired}`;
  }
}

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
      const token = res.data.data.token;
      localStorage.setItem("tradeslot_token", token);
      localStorage.setItem(
        "tradeslot_user",
        JSON.stringify(res.data.data.user),
      );
      setAuthCookies(token);
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
      const token = res.data.data.token;
      localStorage.setItem("tradeslot_token", token);
      localStorage.setItem(
        "tradeslot_user",
        JSON.stringify(res.data.data.user),
      );
      setAuthCookies(token);
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    if (res.data.data) {
      localStorage.setItem("tradeslot_user", JSON.stringify(res.data.data));
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (_e) {
      // Ignore network errors during logout
    }
    localStorage.removeItem("tradeslot_token");
    localStorage.removeItem("tradeslot_user");
    clearAuthCookies();
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("tradeslot_user");
    return stored ? JSON.parse(stored) : null;
  },
};
