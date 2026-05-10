import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Route id must be a UUID." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("route_responses")
    .select(`
      id, route_id, farmer_id, response_type, status, notes, created_at,
      farmers ( name, phone, address_text )
    `)
    .eq("route_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const shaped = (data ?? []).map((row: any) => ({
    id: row.id,
    route_id: row.route_id,
    farmer_id: row.farmer_id,
    farmer_name: row.farmers?.name ?? "Unknown farmer",
    phone: row.farmers?.phone ?? "",
    address_text: row.farmers?.address_text ?? "",
    response_type: row.response_type,
    status: row.status,
    notes: row.notes,
    created_at: row.created_at,
  }));

  return NextResponse.json(shaped);
}
