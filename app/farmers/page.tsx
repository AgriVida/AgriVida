"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { api } from "@/lib/api/client";
import type { FarmerSummary } from "@/lib/api/client";

function FarmerCard({ farmer }: { farmer: FarmerSummary }) {
  return (
    <Link
      href={`/farmer/${farmer.id}`}
      className="block rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm hover:border-emerald-300 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{farmer.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{farmer.phone}</p>
          <p className="text-sm text-slate-500">{farmer.address_text}</p>
        </div>
        {farmer.opted_out && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Opted out
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Registered {new Date(farmer.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}

export default function FarmersListPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = search.trim();

  const farmersQ = useQuery({
    queryKey: ["farmers", debouncedSearch],
    queryFn: () => api.listFarmers(debouncedSearch || undefined),
  });

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <SidebarNav
            title="Support rep"
            subtitle="Manage farmers and routes"
            items={[
              { href: "/farmers", label: "Farmers" },
              { href: "/routes", label: "Route planning" },
              { href: "/auth/sign-in", label: "Sign in" },
            ]}
          />

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-semibold text-slate-900">Farmers</h1>
              <p className="mt-1 text-sm text-slate-600">
                Search by name or phone number
              </p>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search farmers…"
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </section>

            <section className="grid gap-4">
              {farmersQ.isLoading && (
                <p className="text-sm text-slate-600">Loading farmers…</p>
              )}
              {farmersQ.isError && (
                <button
                  type="button"
                  onClick={() => farmersQ.refetch()}
                  className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  Failed to load farmers. Tap to retry.
                </button>
              )}
              {farmersQ.data?.length === 0 && (
                <p className="text-sm text-slate-600">
                  {debouncedSearch ? "No farmers match your search." : "No farmers registered yet."}
                </p>
              )}
              {farmersQ.data?.map((farmer) => (
                <FarmerCard key={farmer.id} farmer={farmer} />
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}