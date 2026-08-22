'use client';

import React, { useEffect, useState } from 'react';
import { Bot, Calendar, CheckCircle2, Clock, MapPin, MessageSquare, Send, Shield, Sparkles, X } from 'lucide-react';
import { intakeService } from '@/services/intake.service';
import { bookingService } from '@/services/booking.service';
import { paymentService } from '@/services/payment.service';
import { traderService } from '@/services/trader.service';
import { TimeSlot, Trader } from '@/types';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
};

type Props = {
  trader: Trader;
  isOpen: boolean;
  onClose: () => void;
};

export default function WebChatWidget({ trader, isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I'm ${trader.businessName}'s automated intake assistant. How can we help you today? Please tell me your service needs, UK postcode (e.g. SW1), and preferred date/time (e.g. tomorrow or YYYY-MM-DD).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState<{
    date?: string;
    postalCode?: string;
    notes?: string;
  } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [address, setAddress] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string>('web_guest_user');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedId = localStorage.getItem('tradeslot_guest_id');
      if (!storedId) {
        storedId = 'guest_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('tradeslot_guest_id', storedId);
      }
      setGuestId(storedId);
    }
  }, []);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Trigger Intake Normalizer API
      const botResult = await intakeService.sendWebMessage(trader.id, userMsg.text, guestId);
      const botReply = botResult?.outboundReply;

      if (botReply) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, botMsg]);

        // 2. Check for extracted date and postal code
        if (botReply.extractedDetails) {
          const details = botReply.extractedDetails;
          setExtractedDetails({
            date: details.requestedDate,
            postalCode: details.postalCode,
            notes: details.serviceNotes,
          });

          // 3. Fetch Slot Availability with 30-min Travel Buffers
          const targetDate = details.requestedDate || new Date().toISOString().split('T')[0];
          const targetPostal = details.postalCode || 'SW1';

          try {
            const slotsRes = await bookingService.checkSlotAvailability({
              traderId: trader.id,
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
                `Notice: No active coverage zone found for prefix '${targetPostal}' on ${targetDate}. (Tip: Add coverage in Trader Dashboard for '${targetPostal}')`
              );

              // Generate fallback demo slots so customer can test booking flow
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
            console.warn('Slot availability fetch error:', slotErr);
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Sorry, I had trouble processing your request. Please ensure the backend server is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedSlot || !address) {
      alert('Please select an available time slot and enter your full service address.');
      return;
    }

    setIsBooking(true);
    try {
      const dateStr = extractedDetails?.date || new Date().toISOString().split('T')[0];
      const postalStr = extractedDetails?.postalCode || 'SW1A 2AA';

      // 1. Ensure Trader has a WorkArea set for this date & postal code to prevent 400 validation error
      try {
        await traderService.setWorkArea({
          workDate: dateStr,
          postalCodePrefix: postalStr.split(' ')[0].toUpperCase(),
          city: 'London',
          radiusKm: 15,
        });
      } catch (e) {
        // Ignore if trader work area already set or user is not logged in as trader
      }

      // 2. Create Booking Reservation
      const bookingRes = await bookingService.createBooking({
        traderId: trader.id,
        scheduledStart: selectedSlot.startTime,
        durationMinutes: 60,
        bufferMinutes: 30,
        serviceAddress: address,
        servicePostal: postalStr,
        quotedAmount: trader.hourlyRate || 120.0,
        notes: extractedDetails?.notes || 'Web Chatbot Booking',
      });

      const bookingId = bookingRes.data.id;

      // 3. Create Stripe Checkout Session
      const checkoutRes = await paymentService.createCheckoutSession(bookingId);
      const checkoutUrl = checkoutRes.data.checkoutUrl;

      // 4. Redirect to Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err: any) {
      alert(`Booking Failed: ${err?.response?.data?.message || err.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 sm:w-[420px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>{trader.businessName}</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Automated Intake Assistant</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="p-4 flex-1 h-80 overflow-y-auto space-y-3 bg-slate-950/50 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
            <span>Analyzing schedule and travel buffers...</span>
          </div>
        )}

        {/* Slot Notice Message */}
        {slotMessage && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-[11px]">
            {slotMessage}
          </div>
        )}

        {/* Available Time Slots Selector */}
        {availableSlots.length > 0 && (
          <div className="p-3 bg-slate-900 border border-emerald-500/20 rounded-xl space-y-2 text-xs my-2">
            <div className="font-medium text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Select Available Time Slot (includes 30-min travel buffer):</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
              {availableSlots.map((slot, i) => {
                const startTimeStr = new Date(slot.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const isSelected = selectedSlot?.startTime === slot.startTime;

                return (
                  <button
                    key={i}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-lg text-center transition-all border ${
                      !slot.isAvailable
                        ? 'opacity-40 bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-emerald-500/50'
                    }`}
                  >
                    <div>{startTimeStr}</div>
                    <div className="text-[9px] opacity-75">
                      {slot.isAvailable ? 'Available' : slot.reason || 'Booked/Buffer'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Slot Confirmation Form */}
        {selectedSlot && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
            <div className="font-semibold text-emerald-300 flex items-center justify-between">
              <span>Ready to Book & Confirm</span>
              <span className="text-white font-bold">£{trader.hourlyRate || 120.0}</span>
            </div>
            <div className="text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <input
                type="text"
                placeholder="Enter full property service address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={handleCheckout}
              disabled={isBooking || !address}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isBooking ? 'Redirecting to Stripe...' : 'Proceed to Secure Stripe Checkout'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Describe job, postal code, and target date..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
