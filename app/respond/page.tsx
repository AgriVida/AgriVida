import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface RespondPageProps {
  searchParams: Promise<{ route?: string; farmer?: string }>;
}

export default async function RespondPage({ searchParams }: RespondPageProps) {
  const params = await searchParams;
  const routeId = params.route;
  const farmerId = params.farmer;

  if (!routeId || !farmerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Invalid Link</h1>
          <p className="mt-2 text-slate-600">
            This response link is missing required information. Please contact the hub directly.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createAdminSupabaseClient();

  const { data: routeData } = await supabase
    .from("routes")
    .select("*, hubs ( id, name, phone, email )")
    .eq("id", routeId)
    .single();

  if (!routeData) {
    notFound();
  }

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, name")
    .eq("id", farmerId)
    .single();

  if (!farmer) {
    notFound();
  }

  const hub = routeData.hubs;
  const startTime = new Date(routeData.start_time).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = new Date(routeData.end_time).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
          Delivery Route Notification
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{routeData.title}</h1>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p><span className="font-medium text-slate-900">Hub:</span> {hub.name}</p>
          <p><span className="font-medium text-slate-900">Farmer:</span> {farmer.name}</p>
          <p><span className="font-medium text-slate-900">Date:</span> {startTime} – {endTime}</p>
          {routeData.notes && (
            <p><span className="font-medium text-slate-900">Notes:</span> {routeData.notes}</p>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Hub Contact</p>
          <p className="mt-1 text-sm text-slate-700">Phone: {hub.phone}</p>
          <p className="text-sm text-slate-700">Email: {hub.email}</p>
        </div>

        <form action="/api/responses" method="POST" className="mt-6 space-y-4">
          <input type="hidden" name="route_id" value={routeId} />
          <input type="hidden" name="farmer_id" value={farmerId} />

          <div>
            <p className="text-sm font-medium text-slate-700">What would you like?</p>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                <input type="radio" name="response_type" value="crop_pickup" required className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-slate-700">Crop Pickup</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                <input type="radio" name="response_type" value="compost_pickup" className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-slate-700">Compost Pickup</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                <input type="radio" name="response_type" value="both" className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-slate-700">Both</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Notes (optional)
              <textarea
                name="notes"
                rows={3}
                placeholder="e.g., What crops, how much compost..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Submit Response
          </button>
        </form>
      </div>
    </div>
  );
}