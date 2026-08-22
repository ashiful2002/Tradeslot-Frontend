import { api } from './api';
import { ApiResponse, Booking, Payment } from '../types';

export const paymentService = {
  async onboardStripeConnect() {
    const res = await api.post<ApiResponse<{ onboardingUrl: string; stripeAccountId: string; message: string }>>(
      '/payments/trader/onboard-connect'
    );
    return res.data;
  },

  async checkConnectStatus() {
    const res = await api.get<
      ApiResponse<{ stripeAccountId: string | null; onboardingComplete: boolean; detailsSubmitted: boolean }>
    >('/payments/trader/connect-status');
    return res.data;
  },

  async createCheckoutSession(bookingId: string) {
    const res = await api.post<
      ApiResponse<{
        checkoutUrl: string;
        sessionId: string;
        paymentId: string;
        amount: number;
        platformFeeAmount: number;
        traderPayoutAmount: number;
        currency: string;
      }>
    >('/payments/create-checkout-session', { bookingId });
    return res.data;
  },

  async confirmPayment(bookingId: string, sessionId?: string) {
    const res = await api.post<ApiResponse<{ booking: Booking; payment: Payment; message: string }>>(
      '/payments/confirm',
      { bookingId, stripeCheckoutSessionId: sessionId }
    );
    return res.data;
  },

  async getPaymentsByBookingId(bookingId: string) {
    const res = await api.get<ApiResponse<Payment[]>>(`/payments/booking/${bookingId}`);
    return res.data;
  },
};
