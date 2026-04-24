import { NextResponse } from "next/server";

import { geocodeAddress } from "@backend/services/geocoding";
import { asBoolean, asString, isRecord } from "@/lib/api/validation";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Farmer id must be a UUID." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const name = asString(body.name) || undefined;
  const phone = asString(body.phone) || undefined;
  const addressText = asString(body.address_text) || undefined;
  const optedOut = asBoolean(body.opted_out);

  // At least one field must be provided
  if (name === undefined && phone === undefined && addressText === undefined && optedOut === undefined) {
    return NextResponse.json(
      { error: "At least one of name, phone, address_text, or opted_out is required." },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabaseClient();

  // If address changed, re-geocode
  let latitude: number | undefined;
  let longitude: number | undefined;

  if (addressText !== undefined) {
    try {
      const geo = await geocodeAddress(addressText);
      latitude = geo.lat;
      longitude = geo.lng;
    } catch (geoError: any) {
      return NextResponse.json(
        { error: `Could not geocode address: ${geoError.message}` },
        { status: 400 },
      );
    }
  }

  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (phone !== undefined) update.phone = phone;
  if (addressText !== undefined) {
    update.address_text = addressText;
    update.latitude = latitude;
    update.longitude = longitude;
  }
  if (optedOut !== undefined) update.opted_out = optedOut;

  const { data, error } = await supabase
    .from("farmers")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Farmer not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}