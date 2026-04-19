import { sendSms, formatRouteSmsMessage } from "@backend/services/sms";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export type RoutePoint = { lat: number; lng: number };

export type PublishNotification = {
  farmer_id: string;
  farmer_name: string;
  status: "sent" | "failed";
};

export type PublishSuccess = {
  ok: true;
  route: Record<string, unknown>;
  farmers_notified: number;
  notifications: PublishNotification[];
};

export type PublishFailure = {
  ok: false;
  status: number;
  error: string;
};

export type PublishResult = PublishSuccess | PublishFailure;

export async function publishRoute(
  routeId: string,
  opts?: { routePoints?: RoutePoint[] },
): Promise<PublishResult> {
  if (!routeId) {
    return { ok: false, status: 400, error: "Route id is required." };
  }

  const supabase = createAdminSupabaseClient();

  const { data: route, error: routeError } = await supabase
    .from("routes")
    .select("*, hubs ( id, name, phone, email )")
    .eq("id", routeId)
    .single();

  if (routeError || !route) {
    return { ok: false, status: 404, error: "Route not found." };
  }

  if (route.published) {
    return { ok: false, status: 409, error: "Route already published." };
  }

  console.log(`[publish] Publishing route ${routeId}: "${route.title}"`);

  const routePoints: RoutePoint[] = opts?.routePoints?.length
    ? opts.routePoints
    : [
        { lat: route.start_lat, lng: route.start_lng },
        { lat: route.end_lat, lng: route.end_lng },
      ];

  const { data: matchedFarmers, error: matchError } = await supabase.rpc(
    "find_farmers_near_route_points",
    { route_points: routePoints, radius_miles: 10 },
  );

  if (matchError) {
    console.error(`[publish] Proximity matching failed:`, matchError);
    return { ok: false, status: 500, error: "Proximity matching failed." };
  }

  console.log(`[publish] Matched ${matchedFarmers?.length ?? 0} farmers`);

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const hub = route.hubs as { name: string; phone: string; email: string };
  const routeDate = new Date(route.start_time).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const notifications: PublishNotification[] = [];

  for (const farmer of matchedFarmers ?? []) {
    const responseUrl = `${baseUrl}/respond?route=${routeId}&farmer=${farmer.farmer_id}`;
    const message = formatRouteSmsMessage({
      hubName: hub.name,
      routeDate,
      responseUrl,
      hubPhone: hub.phone,
      hubEmail: hub.email,
    });

    const smsResult = await sendSms(farmer.phone, message);
    const status: "sent" | "failed" = smsResult.status === "sent" ? "sent" : "failed";

    await supabase.from("notification_log").insert({
      route_id: routeId,
      farmer_id: farmer.farmer_id,
      status,
      twilio_sid: smsResult.sid || null,
      error_message: smsResult.error || null,
    });

    notifications.push({
      farmer_id: farmer.farmer_id,
      farmer_name: farmer.farmer_name,
      status,
    });
  }

  const { data: publishedRoute, error: updateError } = await supabase
    .from("routes")
    .update({ published: true })
    .eq("id", routeId)
    .select("*, hubs ( id, name, phone, email )")
    .single();

  if (updateError) {
    return { ok: false, status: 500, error: updateError.message };
  }

  const sentCount = notifications.filter((n) => n.status === "sent").length;
  const failedCount = notifications.filter((n) => n.status === "failed").length;
  console.log(`[publish] Route ${routeId} published: ${sentCount} sent, ${failedCount} failed`);

  return {
    ok: true,
    route: publishedRoute as Record<string, unknown>,
    farmers_notified: sentCount,
    notifications,
  };
}
