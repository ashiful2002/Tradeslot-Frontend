# 🎨 TradeSlot Frontend — AI-Powered Multi-Channel Trade Booking Web App

TradeSlot Frontend is a high-performance, modern web application built with **Next.js (App Router), TypeScript, and Tailwind CSS**. It provides a frictionless user experience for finding local tradespeople, requesting AI-assisted bookings, and completing secure payments.

---

## 🌟 Key Features

- **Interactive Web AI Booking Chatbot**:
  - Embedded floating drawer (`WebChatWidget.tsx`) featuring real-time natural language intake.
  - Automatically parses service details, matches verified professionals, queries 30-minute travel buffer slots, and redirects directly to Stripe Checkout.
- **Unified Custom Color Palette**:
  - Designed around Electric Cyan (`#38b6ff`) and Royal Purple (`#8c52ff`) CSS tokens.
  - Glassmorphic panels, dark mode depth, and micro-animations.
- **Trader Network Directory**:
  - Responsive directory featuring search by business name or trade category (Plumbing, Electrical, Carpentry, HVAC, etc.).
- **Role-Based User Dashboards**:
  - **Trader Portal**: Configure daily postal work area, track upcoming job reservations, and connect Stripe account for payouts.
  - **Customer Portal**: Review booking history, service status, and payment receipts.
  - **Admin Dashboard**: Overview platform revenue, total bookings, and active tradespeople.

---

## ⚙️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Full-stack React Framework |
| **TypeScript** | Type safety across API services & UI components |
| **Tailwind CSS v4** | Custom design system & utility classes |
| **TanStack React Query** | Async state management & API data fetching |
| **Lucide React Icons** | Modern icon set |
| **Axios** | HTTP client with bearer token interceptors |

---

## 🎨 Design Tokens

The application uses global CSS variables defined in `app/globals.css`:

```css
:root {
  --primary: #38b6ff;      /* Electric Cyan */
  --secondary: #8c52ff;    /* Royal Purple */
}
```

- `.brand-gradient`: `linear-gradient(135deg, #38b6ff 0%, #8c52ff 100%)`
- `.glass-panel`: Glassmorphic slate-900 panels with backdrop blur

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- `pnpm` installed globally (`npm install -g pnpm`)

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5001/api/v1"
```

### 3. Installation & Local Execution

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Folder Structure

```
tradeslot_frontend/
├── app/                      # Next.js App Router pages & layouts
│   ├── all-traders/          # Complete trader directory
│   ├── booking/              # Checkout & success confirmation pages
│   ├── dashboard/            # Role-based dashboard views (@customer, @trader, @admin)
│   ├── login/                # Authentication portal
│   └── register/             # User registration
├── components/
│   ├── chatbot/              # WebChatWidget & GlobalFloatingChatbot
│   ├── layout/               # Navbar & Footer
│   ├── trader/               # StripeConnectCard & WorkAreaForm
│   └── ui/                   # TraderCard & StatusModal
├── hooks/                    # TanStack Query custom hooks
├── services/                 # Axios API service wrappers
└── types/                    # TypeScript data interfaces
```

---

## 📄 License
ISC License — TradeSlot Platform.
