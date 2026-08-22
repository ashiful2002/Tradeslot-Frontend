import { api } from './api';
import { ApiResponse, Booking, BookingStatus, TimeSlot } from '../types';

export const bookingService = {
  async checkSlotAvailability(params: {
    traderId: string;
    date: string;
    postalCode: string;
    durationMinutes?: number;
    bufferMinutes?: number;
  }) {
    const res = await api.get<ApiResponse<{ date: string; postalCode: string; slots: TimeSlot[] }>>(
      '/bookings/available-slots',
      { params }
    );
    return res.data;
  },

  async createBooking(payload: {
    traderId: string;
    scheduledStart: string;
    durationMinutes?: number;
    bufferMinutes?: number;
    serviceAddress: string;
    servicePostal: string;
    quotedAmount: number;
    notes?: string;
  }) {
    const res = await api.post<ApiResponse<Booking>>('/bookings', payload);
    return res.data;
  },

  async getBookingById(id: string) {
    const res = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return res.data;
  },

  async getAllBookings(params?: { status?: BookingStatus; traderId?: string; customerId?: string; page?: number }) {
    const res = await api.get<ApiResponse<Booking[]>>('/bookings', { params });
    return res.data;
  },

  async updateBookingStatus(id: string, status: BookingStatus) {
    const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return res.data;
  },
};
