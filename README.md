# FridgeToFarm

Connecting delivery hubs and local farmers through intelligent route matching and SMS discovery.

FridgeToFarm bridges the coordination gap between food distribution hubs (food banks, logistics companies) and rural farmers. By identifying farmers along active delivery routes, the platform ensures that surplus crops reach markets instead of rotting in the field.

## 🚀 Key Features

- **Hub Route Planner**: A map-based interface for hub operators to plan and visualize delivery routes using Google Maps.
- **Farmer Registration**: A low-friction, mobile-first registration flow that requires only a name, phone number, and location. No accounts or dashboards required for farmers.
- **Intelligent Proximity Matching**: Automatically identifies farmers within a 10-mile radius of *any* point along a planned route's path using geospatial matching.
- **Automated SMS Discovery**: Real-time SMS notifications via Twilio when a route is published, providing farmers with a direct link to coordinate pickups.
- **AI Load Capacity Estimator**: Integrated computer vision using OpenAI (GPT-4o/GPT-5.4-mini) to estimate cargo space usage from a single photo of a truck or trailer bed.
- **Pre-filled Response Flow**: One-tap response forms for farmers to opt-in for crop or compost pickup without needing to log in.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, React Server Components)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth)
- **Mapping**: [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/), Google Routes & Geocoding APIs
- **Communications**: [Twilio](https://www.twilio.com/) (SMS Notifications)
- **AI/Vision**: [OpenAI API](https://openai.com/api/) (Load Capacity Estimation)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Testing**: [Vitest](https://vitest.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project
- Google Maps API Key (with Routes, Geocoding, and Places enabled)
- Twilio Account (SID, Auth Token, and a Messaging Service SID)
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/FridgeToFarm.git
   cd FridgeToFarm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

   # Twilio
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_FROM_NUMBER=your-twilio-number
   TWILIO_MESSAGING_SERVICE_SID=your-messaging-service-sid

   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_VISION_MODEL=gpt-4o # or gpt-4o-mini
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

The project uses Vitest for unit and integration testing.

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📂 Project Structure

- `app/`: Next.js App Router pages and API route handlers.
- `backend/services/`: Core business logic (Geocoding, SMS, Load Capacity).
- `components/`: Shared React components and UI elements.
- `lib/`: Utility functions, Supabase clients, and type definitions.
- `supabase/migrations/`: Database schema and seed data.
- `docs/`: Product requirements, specifications, and feature documentation.
