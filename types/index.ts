export type UserRole = 'CUSTOMER' | 'TRADER' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
};

export type Trader = {
  id: string;
  userId: string;
  businessName: string;
  tradeCategory: string;
  bio?: string;
  isVerified: boolean;
  hourlyRate?: number;
  currency: string;
  stripeAccountId?: string;
  stripeOnboardingComplete: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type WorkArea = {
  id: string;
  traderId: string;
  workDate: string;
  postalCodePrefix: string;
  city?: string;
  radiusKm: number;
};

export type TimeSlot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
};

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Booking = {
  id: string;
  customerId: string;
  traderId: string;
  status: BookingStatus;
  scheduledStart: string;
  scheduledEnd: string;
  durationMinutes: number;
  bufferMinutes: number;
  serviceAddress: string;
  servicePostal: string;
  quotedAmount: number;
  currency: string;
  notes?: string;
  trader?: {
    businessName: string;
    tradeCategory: string;
  };
  customer?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  payments?: Payment[];
};

export type Payment = {
  id: string;
  bookingId: string;
  stripeAccountId?: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  amount: number;
  applicationFeeAmount: number;
  currency: string;
  status: string;
  paidAt?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
};
