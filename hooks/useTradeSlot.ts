import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";
import { traderService } from "../services/trader.service";
import { paymentService } from "../services/payment.service";
import { intakeService } from "../services/intake.service";
import { authService } from "../services/auth.service";
import { BookingStatus } from "../types";

// ==========================================
// AUTH QUERY HOOKS
// ==========================================

export function useGetMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: "CUSTOMER" | "TRADER";
    }) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// ==========================================
// INTAKE / CHATBOT HOOKS
// ==========================================

export function useSendWebMessage() {
  return useMutation({
    mutationFn: ({
      traderId,
      message,
      customerId,
    }: {
      traderId: string;
      message: string;
      customerId?: string;
    }) => intakeService.sendWebMessage(traderId, message, customerId),
  });
}

// ==========================================
// BOOKING HOOKS
// ==========================================

export function useCheckSlotAvailability(
  params: {
    traderId: string;
    date: string;
    postalCode: string;
    durationMinutes?: number;
    bufferMinutes?: number;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: ["slots", params],
    queryFn: () => bookingService.checkSlotAvailability(params),
    enabled: enabled && !!params.traderId && !!params.date && !!params.postalCode,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      traderId: string;
      scheduledStart: string;
      durationMinutes?: number;
      bufferMinutes?: number;
      serviceAddress: string;
      servicePostal: string;
      quotedAmount: number;
      notes?: string;
    }) => bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useGetBookingById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: enabled && !!id,
  });
}

export function useGetAllBookings(params?: {
  status?: BookingStatus;
  traderId?: string;
  customerId?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingService.getAllBookings(params),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingService.updateBookingStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
    },
  });
}

// ==========================================
// TRADER & WORK AREA HOOKS
// ==========================================

export function useGetAllTraders(params?: {
  category?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["traders", params],
    queryFn: () => traderService.getAllTraders(params),
  });
}

export function useGetTraderProfile() {
  return useQuery({
    queryKey: ["trader", "profile"],
    queryFn: () => traderService.getProfile(),
  });
}

export function useUpdateTraderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      businessName: string;
      tradeCategory: string;
      bio?: string;
      hourlyRate?: number;
    }) => traderService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader", "profile"] });
    },
  });
}

export function useSetWorkArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      workDate: string;
      postalCodePrefix: string;
      city?: string;
      radiusKm?: number;
    }) => traderService.setWorkArea(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workAreas"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useGetWorkAreas(date?: string) {
  return useQuery({
    queryKey: ["workAreas", date],
    queryFn: () => traderService.getWorkAreas(date),
  });
}

// ==========================================
// PAYMENT HOOKS
// ==========================================

export function useOnboardStripeConnect() {
  return useMutation({
    mutationFn: () => paymentService.onboardStripeConnect(),
  });
}

export function useCheckConnectStatus() {
  return useQuery({
    queryKey: ["stripe", "connectStatus"],
    queryFn: () => paymentService.checkConnectStatus(),
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (bookingId: string) =>
      paymentService.createCheckoutSession(bookingId),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      sessionId,
    }: {
      bookingId: string;
      sessionId?: string;
    }) => paymentService.confirmPayment(bookingId, sessionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useAiFindTrader() {
  return useMutation({
    mutationFn: (payload: {
      role: string;
      technologies: string;
      experience: string;
    }) => traderService.aiFindTrader(payload),
  });
}
