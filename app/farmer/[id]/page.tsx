import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FarmerDetailClient } from "./farmer-detail-client";

export const dynamic = "force-dynamic";

interface FarmerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FarmerDetailPage({ params }: FarmerDetailPageProps) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, name, phone, address_text, opted_out, latitude, longitude, created_at, updated_at")
    .eq("id", id)
    .single();

  if (!farmer) {
    notFound();
  }

  return <FarmerDetailClient farmer={farmer} />;
}