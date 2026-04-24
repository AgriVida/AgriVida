"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { api } from "@/lib/api/client";
import type { FarmerDetail, FarmerResponseItem } from "@/lib/api/client";

const RESPONSE_TYPES = [
  { value: "crop_pickup", label: "Crop Pickup" },
  { value: "compost_pickup", label: "Compost Pickup" },
  { value: "both", label: "Both" },
] as const;

function ProfileHeader({ farmer }: { farmer: FarmerDetail }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(farmer.name);
  const [phone, setPhone] = useState(farmer.phone);
  const [address, setAddress] = useState(farmer.address_text);

  const updateMutation = useMutation({
    mutationFn: (payload: { name?: string; phone?: string; address_text?: string; opted_out?: boolean }) =>
      api.updateFarmer(farmer.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["farmer", farmer.id] });
      setEditing(false);
    },
  });

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Farmer Profile
          </p>
          {!editing ? (
            <>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">{farmer.name}</h1>
              <p className="mt-1 text-sm text-slate-600">{farmer.phone}</p>
              <p className="text-sm text-slate-500">{farmer.address_text}</p>
            </>
          ) : (
            <div className="mt-2 space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-400"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-400"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {farmer.opted_out && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              Opted out
            </span>
          )}
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => updateMutation.mutate({ name, phone, address_text: address })}
                disabled={updateMutation.isPending}
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
      {updateMutation.isError && (
        <p className="mt-2 text-sm text-red-600">{updateMutation.error.message}</p>
      )}
    </section>
  );
}

function OptOutToggle({ farmer }: { farmer: FarmerDetail }) {
  const qc = useQueryClient();
  const newValue = !farmer.opted_out;

  const mutation = useMutation({
    mutationFn: () => api.updateFarmer(farmer.id, { opted_out: newValue }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farmer", farmer.id] }),
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`rounded-full px-4 py-2 text-xs font-medium ${
        farmer.opted_out
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      } disabled:opacity-50`}
    >
      {mutation.isPending
        ? "Updating…"
        : farmer.opted_out
          ? "Re-enable SMS"
          : "Opt out of SMS"}
    </button>
  );
}

function RespondOnBehalf({ farmerId, routeId, routeTitle }: { farmerId: string; routeId: string; routeTitle: string }) {
  const qc = useQueryClient();
  const [responseType, setResponseType] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      fetch("/api/responses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          farmer_id: farmerId,
          route_id: routeId,
          response_type: responseType,
          notes: notes || null,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to submit response.");
        }
        return res.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["responses", farmerId] });
      qc.invalidateQueries({ queryKey: ["opportunities", farmerId] });
      setOpen(false);
      setResponseType("");
      setNotes("");
    },
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
      >
        Respond on behalf
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-900">Respond to: {routeTitle}</p>
      <div className="mt-3 space-y-2">
        {RESPONSE_TYPES.map((t) => (
          <label key={t.value} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 cursor-pointer">
            <input
              type="radio"
              name={`response-${routeId}`}
              value={t.value}
              checked={responseType === t.value}
              onChange={() => setResponseType(t.value)}
              className="h-4 w-4 text-emerald-600"
            />
            <span className="text-sm text-slate-700">{t.label}</span>
          </label>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-400"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={!responseType || mutation.isPending}
          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Submitting…" : "Submit"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setResponseType(""); setNotes(""); }}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500"
        >
          Cancel
        </button>
      </div>
      {mutation.isError && (
        <p className="mt-2 text-sm text-red-600">{mutation.error.message}</p>
      )}
    </div>
  );
}

function ResponseHistory({ responses }: { responses: FarmerResponseItem[] }) {
  if (responses.length === 0) {
    return <p className="text-sm text-slate-500">No responses yet.</p>;
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-2">
      {responses.map((r) => (
        <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-slate-900">{r.route_title}</p>
              <p className="text-sm text-slate-500">
                {r.response_type.replace("_", " ")} · {new Date(r.created_at).toLocaleDateString()}
              </p>
              {r.notes && <p className="mt-1 text-sm text-slate-600">{r.notes}</p>}
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[r.status] || "bg-slate-100 text-slate-700"}`}>
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FarmerDetailClient({ farmer }: { farmer: FarmerDetail }) {
  const opportunitiesQ = useQuery({
    queryKey: ["opportunities", farmer.id],
    queryFn: () => api.listOpportunities(farmer.id),
  });

  const responsesQ = useQuery({
    queryKey: ["responses", farmer.id],
    queryFn: () => api.listFarmerResponses(farmer.id),
  });

  const notificationsQ = useQuery({
    queryKey: ["notifications", farmer.id],
    queryFn: () => api.listNotifications(farmer.id),
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
            <ProfileHeader farmer={farmer} />
            <OptOutToggle farmer={farmer} />

            {/* Open Opportunities */}
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                Open Opportunities
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Nearby routes this farmer can join
              </h2>
              <div className="mt-4 grid gap-3">
                {opportunitiesQ.isLoading && <p className="text-sm text-slate-600">Loading…</p>}
                {opportunitiesQ.isError && (
                  <button
                    type="button"
                    onClick={() => opportunitiesQ.refetch()}
                    className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                  >
                    Failed to load. Tap to retry.
                  </button>
                )}
                {opportunitiesQ.data?.length === 0 && (
                  <p className="text-sm text-slate-600">No open routes near this farmer.</p>
                )}
                {opportunitiesQ.data?.map((o) => (
                  <div key={o.routeId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{o.routeTitle}</p>
                        <p className="text-sm text-slate-600">{o.hubName} · {o.routeDate}</p>
                        <p className="text-sm text-slate-500">{o.pickupWindow} · {o.distanceMiles} mi away</p>
                      </div>
                    </div>
                    <RespondOnBehalf
                      farmerId={farmer.id}
                      routeId={o.routeId}
                      routeTitle={o.routeTitle}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Response History */}
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Response History
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Past responses</h2>
              <div className="mt-4">
                {responsesQ.isLoading && <p className="text-sm text-slate-600">Loading…</p>}
                {responsesQ.isError && (
                  <button
                    type="button"
                    onClick={() => responsesQ.refetch()}
                    className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                  >
                    Failed to load. Tap to retry.
                  </button>
                )}
                {responsesQ.data && <ResponseHistory responses={responsesQ.data} />}
              </div>
            </section>

            {/* Notification History */}
            <section className="rounded-[2rem] border border-stone-950 bg-stone-950 p-6 text-stone-50 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">SMS History</p>
              <h2 className="mt-2 text-xl font-semibold">Message feed</h2>
              <div className="mt-5 grid gap-3">
                {notificationsQ.isLoading && <p className="text-sm text-stone-300">Loading…</p>}
                {notificationsQ.isError && (
                  <button
                    type="button"
                    onClick={() => notificationsQ.refetch()}
                    className="rounded-[1.25rem] border border-red-300 bg-red-950 p-4 text-sm text-red-100"
                  >
                    Failed to load. Tap to retry.
                  </button>
                )}
                {notificationsQ.data?.length === 0 && (
                  <p className="text-sm text-stone-300">No messages yet.</p>
                )}
                {notificationsQ.data?.map((n) => (
                  <div key={n.id} className="rounded-[1.25rem] border border-stone-700 bg-stone-900 p-4">
                    <p className="text-xs text-stone-400">{n.sender} · {n.timestamp}</p>
                    <p className="mt-1 text-sm text-stone-200">{n.message}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}