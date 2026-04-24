import { config } from "dotenv";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { GET } from "@/app/api/farmers/route";
import type { Database } from "@/lib/supabase/database.types";

config({ path: ".env.local" });

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const TAG = `itest-list-${Date.now()}`;
const farmerIds: string[] = [];

beforeAll(async () => {
  const phone1 = `+15059990001`;
  const phone2 = `+15059990002`;

  // Clean up any prior test data with these phones
  await supabase.from("farmers").delete().in("phone", [phone1, phone2]);

  const { data: f1 } = await supabase.from("farmers").insert({
    name: `${TAG} Alice`, phone: phone1,
    address_text: "1 Main St", latitude: 35.085, longitude: -106.651,
  }).select("id").single();
  farmerIds.push(f1!.id);

  const { data: f2 } = await supabase.from("farmers").insert({
    name: `${TAG} Bob`, phone: phone2,
    address_text: "2 Oak Ave", latitude: 35.09, longitude: -106.66,
  }).select("id").single();
  farmerIds.push(f2!.id);
});

afterAll(async () => {
  await supabase.from("farmers").delete().in("id", farmerIds);
});

describe("GET /api/farmers", () => {
  it("returns farmers ordered by created_at desc", async () => {
    const res = await GET(new Request("http://localhost/api/farmers"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    const names = json.map((f: { name: string }) => f.name);
    expect(names.some((n: string) => n.includes(TAG))).toBe(true);
  });

  it("filters by search query (name)", async () => {
    const res = await GET(new Request(`http://localhost/api/farmers?search=${encodeURIComponent(TAG + " Alice")}`));
    expect(res.status).toBe(200);
    const json = await res.json();
    const names = json.map((f: { name: string }) => f.name);
    expect(names.some((n: string) => n.includes("Alice"))).toBe(true);
    expect(names.every((n: string) => !n.includes("Bob"))).toBe(true);
  });

  it("returns empty array when no match", async () => {
    const res = await GET(new Request("http://localhost/api/farmers?search=zzzznotexist12345"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });
});