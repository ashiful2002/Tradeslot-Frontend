import { api } from './api';
import { ApiResponse } from '../types';

export type IntakeResponse = {
  conversationId: string;
  inboundMessage: any;
  outboundReply: {
    content: string;
    extractedDetails?: {
      requestedDate?: string;
      requestedTime?: string;
      postalCode?: string;
      serviceNotes?: string;
    };
  };
  meta: {
    channel: string;
    processedAt: string;
  };
};

export const intakeService = {
  async sendWebMessage(traderId: string, message: string, customerId?: string) {
    const res = await api.post<ApiResponse<any>>('/messages/web', {
      traderId,
      message,
      customerId,
    });

    const payload = res.data?.data?.result || res.data?.data || res.data;
    return payload as IntakeResponse;
  },
};
