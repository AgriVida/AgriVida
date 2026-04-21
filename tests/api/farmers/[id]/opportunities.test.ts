import { config } from "dotenv";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { GET } from "@/app/api/farmers/[id]/opportunities/route";
import type { Database } from "@/lib/supabase/database.types";

config({ path: ".env.local" });

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const HUB_ID = "1e53e9e8-11db-4012-9451-f996632cd250";
const TAG = `itest-oppty-${Date.now()}`;
let farmerId = "";
let openRouteId = "";
let respondedRouteId = "";
let responseId = "";

beforeAll(async () => {
  const { data: prior } = await supabase.from("farmers").select("id").eq("phone", "+15052267998");
  const priorIds = (prior ?? []).map((f) => f.id);
  if (priorIds.length) {
    await supabase.from("route_responses").delete().in("farmer_id", priorIds);
    await supabase.from("notification_log").delete().in("farmer_id", priorIds);
    await supabase.from("farmers").delete().in("id", priorIds);
  }

  const { data: f } = await supabase.from("farmers").insert({
    name: `Oppty Farmer ${TAG}`, phone: "+15052267998",
    address_text: "addr", latitude: 35.085, longitude: -106.651,
  }).select("id").single();
  farmerId = f!.id;

  const insertRoute = async (title: string) => {
    const { data } = await supabase.from("routes").insert({
      hub_id: HUB_ID, title, route_polyline: "x",
      start_lat: 35.086, start_lng: -106.652,
      end_lat: 35.09, end_lng: -106.65,
      start_time: "2026-06-02T09:00:00Z",
      end_time: "2026-06-02T11:00:00Z",
      published: true,
    }).select("id").single();
    return data!.id;
  };
  openRouteId = await insertRoute(`${TAG} open`);
  respondedRouteId = await insertRoute(`${TAG} responded`);

  const { data: rr } = await supabase.from("route_responses").insert({
    route_id: respondedRouteId, farmer_id: farmerId,
    response_type: "crop_pickup", status: "pending",
  }).select("id").single();
  responseId = rr!.id;
});

afterAll(async () => {
  await supabase.from("route_responses").delete().eq("id", responseId);
  await supabase.from("routes").delete().in("id", [openRouteId, respondedRouteId]);
  await supabase.from("farmers").delete().eq("id", farmerId);
});

describe("GET /api/farmers/[id]/opportunities", () => {
  it("returns open routes and excludes already-responded routes", async () => {
    const res = await GET(new Request(`http://localhost/api/farmers/${farmerId}/opportunities`), {
      params: Promise.resolve({ id: farmerId }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as Array<{ routeId: string }>;
    const routeIds = json.map((o) => o.routeId);
    expect(routeIds).toContain(openRouteId);
    expect(routeIds).not.toContain(respondedRouteId);
  });

  it("400 on invalid farmer id", async () => {
    const res = await GET(new Request("http://localhost/api/farmers/nope/opportunities"), {
      params: Promise.resolve({ id: "nope" }),
    });
    expect(res.status).toBe(400);
  });
});
