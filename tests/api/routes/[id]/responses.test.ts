import { config } from "dotenv";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { GET } from "@/app/api/routes/[id]/responses/route";
import type { Database } from "@/lib/supabase/database.types";

config({ path: ".env.local" });

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const HUB_ID = "1e53e9e8-11db-4012-9451-f996632cd250";
const TAG = `itest-routeresp-${Date.now()}`;

let farmerId = "";
let routeId = "";
let responseId = "";

beforeAll(async () => {
  const phone = "+15059990300";
  await supabase.from("farmers").delete().eq("phone", phone);

  const { data: f } = await supabase.from("farmers").insert({
    name: `${TAG} Farmer`,
    phone,
    address_text: "300 Route Resp Way",
    latitude: 35.085,
    longitude: -106.651,
  }).select("id").single();
  farmerId = f!.id;

  const { data: r } = await supabase.from("routes").insert({
    hub_id: HUB_ID,
    title: `${TAG} Route`,
    route_polyline: "x",
    start_lat: 35.086, start_lng: -106.652,
    end_lat: 35.09, end_lng: -106.65,
    start_time: "2026-07-02T09:00:00Z",
    end_time: "2026-07-02T11:00:00Z",
    published: true,
  }).select("id").single();
  routeId = r!.id;

  const { data: rr } = await supabase.from("route_responses").insert({
    route_id: routeId,
    farmer_id: farmerId,
    response_type: "crop_pickup",
    status: "pending",
    notes: "Have leafy greens",
  }).select("id").single();
  responseId = rr!.id;
});

afterAll(async () => {
  await supabase.from("route_responses").delete().eq("id", responseId);
  await supabase.from("routes").delete().eq("id", routeId);
  await supabase.from("farmers").delete().eq("id", farmerId);
});

describe("GET /api/routes/[id]/responses", () => {
  it("returns responses joined with farmer info", async () => {
    const res = await GET(new Request(`http://localhost/api/routes/${routeId}/responses`), {
      params: Promise.resolve({ id: routeId }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    const match = json.find((r: { id: string }) => r.id === responseId);
    expect(match).toBeDefined();
    expect(match.farmer_id).toBe(farmerId);
    expect(match.farmer_name).toContain(TAG);
    expect(match.phone).toBe("+15059990300");
    expect(match.address_text).toBe("300 Route Resp Way");
    expect(match.response_type).toBe("crop_pickup");
    expect(match.status).toBe("pending");
    expect(match.notes).toBe("Have leafy greens");
    expect(typeof match.created_at).toBe("string");
  });

  it("returns empty array for a route with no responses", async () => {
    const { data: r2 } = await supabase.from("routes").insert({
      hub_id: HUB_ID,
      title: `${TAG} Empty`,
      route_polyline: "x",
      start_lat: 35.086, start_lng: -106.652,
      end_lat: 35.09, end_lng: -106.65,
      start_time: "2026-07-03T09:00:00Z",
      end_time: "2026-07-03T11:00:00Z",
      published: true,
    }).select("id").single();
    const emptyRouteId = r2!.id;

    try {
      const res = await GET(new Request(`http://localhost/api/routes/${emptyRouteId}/responses`), {
        params: Promise.resolve({ id: emptyRouteId }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual([]);
    } finally {
      await supabase.from("routes").delete().eq("id", emptyRouteId);
    }
  });

  it("400 on invalid route id", async () => {
    const res = await GET(new Request("http://localhost/api/routes/nope/responses"), {
      params: Promise.resolve({ id: "nope" }),
    });
    expect(res.status).toBe(400);
  });
});
