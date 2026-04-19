import { NextResponse } from "next/server";

import { publishRoute } from "@backend/services/publish-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const result = await publishRoute(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    route: result.route,
    farmers_notified: result.farmers_notified,
    notifications: result.notifications,
  });
}
