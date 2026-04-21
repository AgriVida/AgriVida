import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

function formatWindow(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const date = s.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const sTime = s.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const eTime = e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${sTime} - ${eTime}`;
}

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Farmer id must be a UUID." }, { status: 400 });
  }
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.rpc("find_routes_near_farmer", {
    farmer_id_in: id, radius_miles: 10,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const shaped = (data ?? []).map((r: {
    route_id: string; route_title: string; hub_name: string;
    start_time: string; end_time: string;
    end_lat: number; end_lng: number;
    min_distance_miles: number;
  }) => ({
    routeId: r.route_id,
    routeTitle: r.route_title,
    hubName: r.hub_name,
    routeDate: new Date(r.start_time).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    }),
    pickupWindow: formatWindow(r.start_time, r.end_time),
    destination: `${r.end_lat.toFixed(4)}, ${r.end_lng.toFixed(4)}`,
    distanceMiles: Number(r.min_distance_miles.toFixed(2)),
  }));
  return NextResponse.json(shaped);
}
