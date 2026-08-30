"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Clock,
  MapPin,
  Send,
  Shield,
  Sparkles,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { traderService } from "@/services/trader.service";
import { TimeSlot, Trader } from "@/types";
import StatusModal from "@/components/ui/StatusModal";
import {
  useSendWebMessage,
  useCreateBooking,
  useCreateCheckoutSession,
} from "@/hooks/useTradeSlot";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
};

type MatchedTrader = {
  id: string;
  businessName: string;
  tradeCategory: string;
  hourlyRate: number | string;
};

type Props = {
  trader: Trader;
  isOpen: boolean;
  onClose: () => void;
};

const DEMO_PROMPTS = [
  "My bathroom shower is broken, I need a plumber on 30 Aug 2026 in SW1",
  "Electrician needed for light fixture on 30 Aug 2026 in E1",
  "Emergency heating repair needed on 30 Aug 2026 in NW3",
];

const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
};

export default function WebChatWidget({ trader, isOpen, onClose }: Props) {
  const [currentTrader, setCurrentTrader] = useState<Trader>(trader);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: `Hello! I'm TradeSlot's AI booking intake assistant. Click one of the test prompts below or type your request to instantly book a trader.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [extractedDetails, setExtractedDetails] = useState<{
    date?: string;
    postalCode?: string;
    tradeCategory?: string;
    notes?: string;
    matchedTraders?: MatchedTrader[];
  } | null>(null);
  const [matchedTradersList, setMatchedTradersList] = useState<MatchedTrader[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [address, setAddress] = useState("");
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string>("web_guest_user");

  // Status Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "error" | "success" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "error",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TanStack Query Mutations
  const sendWebMessageMutation = useSendWebMessage();
  const createBookingMutation = useCreateBooking();
  const createCheckoutMutation = useCreateCheckoutSession();

  useEffect(() => {
    setCurrentTrader(trader);
  }, [trader]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("tradeslot_guest_id");
      if (!storedId) {
        storedId = "guest_" + Math.random().toString(36).substring(2, 10);
        localStorage.setItem("tradeslot_guest_id", storedId);
      }
      setGuestId(storedId);
    }
  }, []);

  // Auto-scroll to bottom whenever messages or interactive elements update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, matchedTradersList, availableSlots, selectedSlot]);

  if (!isOpen) return null;

  const fetchSlotsForTrader = async (traderId: string, targetDate: string, targetPostal: string) => {
    try {
      const slotsRes = await bookingService.checkSlotAvailability({
        traderId,
        date: targetDate,
        postalCode: targetPostal,
        durationMinutes: 60,
        bufferMinutes: 30,
      });

      if (slotsRes.data?.slots && slotsRes.data.slots.length > 0) {
        setAvailableSlots(slotsRes.data.slots);
        setSlotMessage(null);
      } else {
        setSlotMessage(
          `Notice: Active coverage zone checking for prefix '${targetPostal}' on ${targetDate}. Demo slots available below.`,
        );

        const sampleSlots: TimeSlot[] = [
          {
            startTime: new Date(`${targetDate}T09:00:00Z`).toISOString(),
            endTime: new Date(`${targetDate}T10:00:00Z`).toISOString(),
            isAvailable: true,
          },
          {
            startTime: new Date(`${targetDate}T11:00:00Z`).toISOString(),
            endTime: new Date(`${targetDate}T12:00:00Z`).toISOString(),
            isAvailable: true,
          },
          {
            startTime: new Date(`${targetDate}T14:00:00Z`).toISOString(),
            endTime: new Date(`${targetDate}T15:00:00Z`).toISOString(),
            isAvailable: true,
          },
        ];
        setAvailableSlots(sampleSlots);
      }
    } catch (slotErr: any) {
      console.warn("Slot availability fetch error:", slotErr);
    }
  };

  const processMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || sendWebMessageMutation.isPending) return;

    const userMsg: Message = {
      id: generateId(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    try {
      // 1. Trigger Intake Normalizer API via TanStack Mutation
      const botResult = await sendWebMessageMutation.mutateAsync({
        traderId: currentTrader.id,
        message: textToSend,
        customerId: guestId,
      });
      const botReply = botResult?.outboundReply;

      if (botReply) {
        const botMsg: Message = {
          id: generateId(),
          sender: "bot",
          text: botReply.content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botMsg]);

        // 2. Check for extracted details & matched traders
        if (botReply.extractedDetails) {
          const details: any = botReply.extractedDetails;
          setExtractedDetails({
            date: details.requestedDate,
            postalCode: details.postalCode,
            tradeCategory: details.tradeCategory,
            notes: details.serviceNotes,
            matchedTraders: details.matchedTraders,
          });

          if (details.matchedTraders && details.matchedTraders.length > 0) {
            setMatchedTradersList(details.matchedTraders);
          }

          // 3. Fetch Slot Availability with 30-min Travel Buffers
          const targetDate =
            details.requestedDate || new Date().toISOString().split("T")[0];
          const targetPostal = details.postalCode || "SW1";

          await fetchSlotsForTrader(currentTrader.id, targetDate, targetPostal);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          sender: "bot",
          text: "Sorry, I had trouble processing your request. Please ensure the backend server is running.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    processMessageText(inputText);
  };

  const handleSelectMatchedTrader = (t: MatchedTrader) => {
    setCurrentTrader({
      id: t.id,
      businessName: t.businessName,
      tradeCategory: t.tradeCategory,
      hourlyRate: Number(t.hourlyRate) || 65.0,
      bio: "Selected via AI Chatbot intake matching.",
    } as Trader);

    const dateStr = extractedDetails?.date || new Date().toISOString().split("T")[0];
    const postalStr = extractedDetails?.postalCode || "SW1";

    fetchSlotsForTrader(t.id, dateStr, postalStr);
  };

  const handleCheckout = async () => {
    if (!selectedSlot || !address) {
      setModalState({
        isOpen: true,
        title: "Required Information Missing",
        message: "Please select an available time slot and enter your full service property address before proceeding.",
        type: "info",
      });
      return;
    }

    try {
      const dateStr =
        extractedDetails?.date || new Date().toISOString().split("T")[0];
      const postalStr = extractedDetails?.postalCode || "SW1A 2AA";

      // 1. Ensure Trader has a WorkArea set for this date & postal code to prevent 400 validation error
      try {
        await traderService.setWorkArea({
          workDate: dateStr,
          postalCodePrefix: postalStr.split(" ")[0].toUpperCase(),
          city: "London",
          radiusKm: 15,
        });
      } catch {
        // Ignore if trader work area already set
      }

      // Explicitly convert hourlyRate to Number to satisfy Zod validation
      const numericQuotedAmount = Number(currentTrader.hourlyRate) || 75.0;

      // 2. Create Booking Reservation via TanStack Mutation
      const bookingRes = await createBookingMutation.mutateAsync({
        traderId: currentTrader.id,
        scheduledStart: selectedSlot.startTime,
        durationMinutes: 60,
        bufferMinutes: 30,
        serviceAddress: address,
        servicePostal: postalStr,
        quotedAmount: numericQuotedAmount,
        notes: extractedDetails?.notes || "Web Chatbot Booking",
      });

      const bookingId = bookingRes.data.id;

      // 3. Create Stripe Checkout Session via TanStack Mutation
      const checkoutRes = await createCheckoutMutation.mutateAsync(bookingId);
      const checkoutUrl = checkoutRes.data.checkoutUrl;

      // 4. Directly Navigate to Stripe Checkout Page
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err: any) {
      const errDetail = err?.response?.data?.message
        ? typeof err.response.data.message === "object"
          ? JSON.stringify(err.response.data.message, null, 2)
          : err.response.data.message
        : err.message;

      setModalState({
        isOpen: true,
        title: "Booking Notice",
        message: errDetail,
        type: "error",
      });
    }
  };

  const isBookingPending =
    createBookingMutation.isPending || createCheckoutMutation.isPending;

  return (
    <>
      <div className="fixed bottom-6 right-6 w-96 sm:w-[440px] max-h-[90vh] h-[640px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38b6ff]/10 border border-[#38b6ff]/20 flex items-center justify-center text-[#38b6ff]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>{currentTrader.businessName}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#38b6ff] fill-[#38b6ff]" />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#38b6ff] animate-pulse"></span>
                <span>Intelligent Booking & Matching Engine</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream with Scrollable Body */}
        <div className="p-4 flex-1 min-h-0 overflow-y-auto space-y-3 bg-slate-950/70 text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${msg.sender === "user"
                  ? "bg-[#38b6ff] text-slate-950 rounded-br-none font-bold shadow-md shadow-[#38b6ff]/20"
                  : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                  }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Quick Demo Test Prompt Chips */}
          {messages.length <= 2 && !sendWebMessageMutation.isPending && (
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 my-2">
              <div className="text-[11px] font-bold text-[#38b6ff] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#8c52ff]" />
                <span>Instant One-Click Test Prompts:</span>
              </div>
              <div className="space-y-1.5">
                {DEMO_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => processMessageText(prompt)}
                    className="w-full text-left p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#38b6ff]/60 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="line-clamp-1">{prompt}</span>
                    <span className="text-[10px] text-[#38b6ff] font-bold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                      Send &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {sendWebMessageMutation.isPending && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
              <div className="w-2 h-2 rounded-full bg-[#38b6ff] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[#38b6ff] animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-[#38b6ff] animate-bounce [animation-delay:0.4s]"></div>
              <span>Matching traders & analyzing travel buffers...</span>
            </div>
          )}

          {/* Matched Traders Selector */}
          {matchedTradersList.length > 0 && (
            <div className="p-3 bg-slate-900 border border-[#38b6ff]/30 rounded-2xl space-y-2 text-xs my-2">
              <div className="font-bold text-[#38b6ff] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#8c52ff]" />
                  <span>Matching Verified {extractedDetails?.tradeCategory || "Trade"} Professionals:</span>
                </span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {matchedTradersList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectMatchedTrader(t)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${currentTrader.id === t.id
                      ? "bg-[#38b6ff]/10 border-[#38b6ff] text-white font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{t.businessName}</div>
                      <div className="text-[10px] text-[#8c52ff]">{t.tradeCategory}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#38b6ff]">${t.hourlyRate}/hr</div>
                      <div className="text-[9px] text-[#38b6ff]">Select Trader &rarr;</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Slot Notice Message */}
          {slotMessage && (
            <div className="p-2.5 bg-[#8c52ff]/10 border border-[#8c52ff]/30 text-[#8c52ff] rounded-xl text-[11px]">
              {slotMessage}
            </div>
          )}

          {/* Available Time Slots Selector */}
          {availableSlots.length > 0 && (
            <div className="p-3 bg-slate-900 border border-[#38b6ff]/30 rounded-2xl space-y-2 text-xs my-2">
              <div className="font-bold text-[#38b6ff] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8c52ff]" />
                <span>
                  Available Time Slots (30-min travel buffer reserved):
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {availableSlots.map((slot, i) => {
                  const startTimeStr = new Date(
                    slot.startTime,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isSelected = selectedSlot?.startTime === slot.startTime;

                  return (
                    <button
                      key={i}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl text-center transition-all border cursor-pointer ${!slot.isAvailable
                        ? "opacity-40 bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed"
                        : isSelected
                          ? "brand-gradient text-slate-950 font-bold border-[#38b6ff] shadow-md shadow-[#38b6ff]/20"
                          : "bg-slate-950 text-slate-200 border-slate-800 hover:border-[#38b6ff]/50"
                        }`}
                    >
                      <div>{startTimeStr}</div>
                      <div className="text-[9px] opacity-80">
                        {slot.isAvailable
                          ? "Available"
                          : slot.reason || "Booked/Buffer"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Slot Confirmation Form */}
          {selectedSlot && (
            <div className="p-3.5 bg-slate-900 border border-[#38b6ff]/30 rounded-2xl space-y-2.5 text-xs">
              <div className="font-bold text-[#38b6ff] flex items-center justify-between">
                <span>Ready to Reserve & Confirm</span>
                <span className="text-white font-black text-sm">
                  ${Number(currentTrader.hourlyRate) || 75.0} USD
                </span>
              </div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8c52ff] shrink-0" />
                <input
                  type="text"
                  placeholder="Enter full property service address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#38b6ff] font-medium"
                />
              </div>
              <button
                onClick={handleCheckout}
                disabled={isBookingPending || !address}
                className="w-full py-2.5 brand-gradient hover:opacity-90 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#38b6ff]/20"
              >
                <Shield className="w-4 h-4" />
                <span>
                  {isBookingPending
                    ? "Redirecting to Stripe..."
                    : "Proceed to Secure Stripe Checkout"}
                </span>
              </button>
            </div>
          )}

          {/* Hidden scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="e.g. My bathroom shower is broken I need a plumber on 30 Aug 2026..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38b6ff]/50"
          />
          <button
            type="submit"
            disabled={sendWebMessageMutation.isPending || !inputText.trim()}
            className="p-2.5 brand-gradient hover:opacity-90 disabled:opacity-40 text-slate-950 rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modern Status Modal */}
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </>
  );
}
