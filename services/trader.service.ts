import { api } from "./api";
import { ApiResponse, Trader, WorkArea } from "../types";

export const traderService = {
  async getAllTraders(params?: {
    category?: string;
    searchTerm?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get<ApiResponse<Trader[]>>("/traders", { params });
    return res.data;
  },

  async getProfile() {
    const res = await api.get<ApiResponse<Trader>>("/traders/profile");
    return res.data;
  },

  async updateProfile(payload: {
    businessName: string;
    tradeCategory: string;
    bio?: string;
    hourlyRate?: number;
  }) {
    const res = await api.post<ApiResponse<Trader>>(
      "/traders/profile",
      payload,
    );
    return res.data;
  },

  async setWorkArea(payload: {
    workDate: string;
    postalCodePrefix: string;
    city?: string;
    radiusKm?: number;
  }) {
    const res = await api.post<ApiResponse<WorkArea>>(
      "/traders/work-area",
      payload,
    );
    return res.data;
  },

  async getWorkAreas(date?: string) {
    const res = await api.get<ApiResponse<WorkArea[]>>("/traders/work-area", {
      params: { date },
    });
    return res.data;
  },

  async checkCoverage(traderId: string, postalCode: string, date: string) {
    const res = await api.get<
      ApiResponse<{ isAvailable: boolean; workArea: WorkArea | null }>
    >("/traders/check-coverage", {
      params: { traderId, postalCode, date },
    });
    return res.data;
  },

  async aiFindTrader(payload: {
    role: string;
    technologies: string;
    experience: string;
  }) {
    const res = await api.post<
      ApiResponse<{
        recommendations: Array<{
          traderId: string;
          businessName: string;
          fullName: string;
          matchScore: number;
          aiSummary: string;
        }>;
        searchSummary: string;
        matchedSkills: string[];
      }>
    >("/ai/find-trader", payload);
    return res.data;
  },
};
