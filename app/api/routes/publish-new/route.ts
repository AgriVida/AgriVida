import { NextResponse } from "next/server";

import { geocodeAddress } from "@backend/services/geocoding";
import { publishRoute, type RoutePoint } from "@backend/services/publish-route";
import { asString, isRecord } from "@/lib/api/validation";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

type PickupGeocode = { address: string; lat: number; lng: number };

function defaultRouteWindow(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now);
  start.setHours(9, 0, 0, 0);
  const end = new Date(now);
  end.setHours(17, 0, 0, 0);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const title = asString(body.title);
  const origin = asString(body.origin);
  const destination = asString(body.destination);
  const notes = asString(body.notes);
  const rawPickups = Array.isArray(body.pickups) ? body.pickups : [];
  const pickups = rawPickups.map((p) => asString(p)).filter((p) => p.length > 0);

  if (!title || !origin || !destination) {
    return NextResponse.json(
      { error: "title, origin, and destination are required." },
      { status: 400 },
    );
  }

  const supabase = createAdminSupabaseClient();

  const { data: hub, error: hubError } = await supabase
    .from("hubs")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (hubError || !hub) {
    return NextResponse.json(
      { error: "No hub configured. Seed a hub before publishing." },
      { status: 404 },
    );
  }

  let originCoord: { lat: number; lng: number };
  let destinationCoord: { lat: number; lng: number };
  const pickupCoords: PickupGeocode[] = [];

  try {
    const [originResult, destinationResult, ...pickupResults] = await Promise.all([
      geocodeAddress(origin),
      geocodeAddress(destination),
      ...pickups.map((p) => geocodeAddress(p)),
    ]);

    originCoord = { lat: originResult.lat, lng: originResult.lng };
    destinationCoord = { lat: destinationResult.lat, lng: destinationResult.lng };
    pickups.forEach((address, i) => {
      const r = pickupResults[i];
      pickupCoords.push({ address, lat: r.lat, lng: r.lng });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Geocoding failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const routePoints: RoutePoint[] = [
    originCoord,
    ...pickupCoords.map(({ lat, lng }) => ({ lat, lng })),
    destinationCoord,
  ];

  const { start, end } = defaultRouteWindow();

  const { data: inserted, error: insertError } = await supabase
    .from("routes")
    .insert({
      hub_id: hub.id,
      title,
      route_polyline: "",
      start_lat: originCoord.lat,
      start_lng: originCoord.lng,
      end_lat: destinationCoord.lat,
      end_lng: destinationCoord.lng,
      start_time: start,
      end_time: end,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: insertError?.message || "Failed to create route." },
      { status: 500 },
    );
  }

  const result = await publishRoute(inserted.id, { routePoints });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(
    {
      route: result.route,
      farmers_notified: result.farmers_notified,
      notifications: result.notifications,
    },
    { status: 201 },
  );
}
