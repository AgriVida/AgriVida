@AGENTS.md

# FridgeToFarm

Connecting delivery hubs and local farmers through intelligent route matching and SMS discovery.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database/Auth**: Supabase
- **Mapping**: Google Maps (Routes, Geocoding, Places)
- **Communications**: Twilio SMS
- **AI**: OpenAI Vision (Load Capacity Estimation)
- **Testing**: Vitest

## 📜 Build & Test Commands
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Test**: `npm run test` / `npm run test:watch`
- **Lint**: `npm run lint`

## 📂 Architecture
- `app/`: Next.js pages and API route handlers
- `backend/services/`: Business logic (Geocoding, SMS, Load Capacity)
- `lib/services/`: Client-side services (Autocomplete, Directions)
- `components/`: UI components (Shadcn UI based)
- `supabase/migrations/`: Database schema and seed data
- `docs/`: PRD and design specs
