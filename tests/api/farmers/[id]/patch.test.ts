import { config } from "dotenv";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { PATCH } from "@/app/api/farmers/[id]/route";
import type { Database } from "@/lib/supabase/database.types";

config({ path: ".env.local" });

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const TAG = `itest-patch-${Date.now()}`;
let farmerId = "";

beforeAll(async () => {
  const phone = `+15059990100`;
  await supabase.from("farmers").delete().eq("phone", phone);
  const { data } = await supabase.from("farmers").insert({
    name: `${TAG} Farmer`, phone,
    address_text: "100 Patch St", latitude: 35.085, longitude: -106.651,
  }).select("id").single();
  farmerId = data!.id;
});

afterAll(async () => {
  await supabase.from("farmers").delete().eq("id", farmerId);
});

describe("PATCH /api/farmers/[id]", () => {
  it("updates opted_out", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/farmers/" + farmerId, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ opted_out: true }),
      }),
      { params: Promise.resolve({ id: farmerId }) },
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.opted_out).toBe(true);
  });

  it("updates name", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/farmers/" + farmerId, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: `${TAG} Updated` }),
      }),
      { params: Promise.resolve({ id: farmerId }) },
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe(`${TAG} Updated`);
  });

  it("400 on invalid UUID", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/farmers/nope", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "test" }),
      }),
      { params: Promise.resolve({ id: "nope" }) },
    );
    expect(res.status).toBe(400);
  });

  it("400 with no fields", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/farmers/" + farmerId, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: farmerId }) },
    );
    expect(res.status).toBe(400);
  });
});