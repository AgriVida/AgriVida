// app/driver/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DriverDashboard } from "@/components/driver-dashboard";
import { Navbar } from "@/components/navbar";
import { api } from "@/lib/api/client";

function DriverPageInner() {
  const driverId = useSearchParams().get("id") ?? "";

  const driversQ = useQuery({
    queryKey: ["drivers"],
    queryFn: () => api.listDrivers(),
  });
  const assignmentsQ = useQuery({
    queryKey: ["assignments", driverId],
    queryFn: () => api.listAssignments(driverId),
    enabled: !!driverId,
  });

  if (!driverId) {
    return <p className="text-sm text-slate-700">Add <code>?id=&lt;driver-uuid&gt;</code> to the URL.</p>;
  }

  const driver = driversQ.data?.find((d) => d.id === driverId);
  if (driversQ.isLoading || assignmentsQ.isLoading) return <p className="text-sm">Loading…</p>;
  if (driversQ.isError || assignmentsQ.isError) {
    return (
      <button
        type="button"
        onClick={() => { driversQ.refetch(); assignmentsQ.refetch(); }}
        className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800"
      >
        Failed to load. Tap to retry.
      </button>
    );
  }
  if (!driver) return <p className="text-sm">Driver not found.</p>;

  return (
    <DriverDashboard
      driver={{
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        avatarUrl: driver.avatarUrl ?? "",
        vehicle: driver.vehicle ?? "",
        phone: driver.phone,
        zone: driver.zone ?? "",
      }}
      assignments={assignmentsQ.data ?? []}
    />
  );
}

export default function DriverPage() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="text-sm">Loading…</p>}>
          <DriverPageInner />
        </Suspense>
      </main>
    </div>
  );
}
