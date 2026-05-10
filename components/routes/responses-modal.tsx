"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { api, type RouteResponseRow, type ResponseType } from "@/lib/api/client";

type Props = {
  routeId: string | null;
  open: boolean;
  onClose: () => void;
};

const TYPE_LABEL: Record<ResponseType, string> = {
  crop_pickup: "Crop Pickup",
  compost_pickup: "Compost Pickup",
  both: "Both",
  decline: "Not This Time",
};

const TYPE_BADGE: Record<ResponseType, string> = {
  crop_pickup: "bg-emerald-100 text-emerald-800",
  compost_pickup: "bg-amber-100 text-amber-800",
  both: "bg-sky-100 text-sky-800",
  decline: "bg-stone-200 text-stone-700",
};

function formatRespondedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function matchesQuery(row: RouteResponseRow, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  const haystack = [
    row.farmer_name,
    row.phone,
    TYPE_LABEL[row.response_type],
    row.status,
    row.notes ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function ResponsesModal({ routeId, open, onClose }: Props) {
  const [query, setQuery] = useState("");

  const responsesQ = useQuery({
    queryKey: ["route-responses", routeId],
    queryFn: () => api.listRouteResponses(routeId!),
    enabled: open && !!routeId,
  });

  const filtered = useMemo(() => {
    const rows = responsesQ.data ?? [];
    return rows.filter((r) => matchesQuery(r, query));
  }, [responsesQ.data, query]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setQuery(""); onClose(); } }}>
      <DialogContent>
        <div className="mb-4 flex items-center justify-between gap-4">
          <DialogTitle>
            Farmer Responses
            {responsesQ.data && (
              <span className="ml-2 text-sm font-normal text-stone-500">
                ({responsesQ.data.length})
              </span>
            )}
          </DialogTitle>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search farmers, notes, type…"
            className="w-64 rounded border border-stone-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto rounded border border-stone-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-600">
              <tr>
                <th className="px-3 py-2">Farmer</th>
                <th className="px-3 py-2">Request</th>
                <th className="px-3 py-2">Notes</th>
                <th className="px-3 py-2">Responded</th>
                <th className="px-3 py-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {responsesQ.isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      <td className="px-3 py-3"><div className="h-4 w-32 animate-pulse rounded bg-stone-200" /></td>
                      <td className="px-3 py-3"><div className="h-4 w-20 animate-pulse rounded bg-stone-200" /></td>
                      <td className="px-3 py-3"><div className="h-4 w-40 animate-pulse rounded bg-stone-200" /></td>
                      <td className="px-3 py-3"><div className="h-4 w-24 animate-pulse rounded bg-stone-200" /></td>
                      <td className="px-3 py-3"><div className="h-4 w-16 animate-pulse rounded bg-stone-200" /></td>
                    </tr>
                  ))}
                </>
              )}

              {responsesQ.isError && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-sm text-red-700">
                    Failed to load responses.{" "}
                    <button
                      type="button"
                      onClick={() => responsesQ.refetch()}
                      className="underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}

              {!responsesQ.isLoading &&
                !responsesQ.isError &&
                (responsesQ.data?.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-stone-500">
                      No farmer responses yet. They&apos;ll appear here as farmers reply via SMS.
                    </td>
                  </tr>
                )}

              {!responsesQ.isLoading &&
                !responsesQ.isError &&
                (responsesQ.data?.length ?? 0) > 0 &&
                filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-stone-500">
                      No farmers match &ldquo;{query}&rdquo;.
                    </td>
                  </tr>
                )}

              {!responsesQ.isLoading &&
                filtered.map((row) => (
                  <tr key={row.id} className="border-t border-stone-100">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700">
                          {row.farmer_name.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900">{row.farmer_name}</div>
                          <div className="text-xs text-stone-500">{row.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${TYPE_BADGE[row.response_type]}`}
                      >
                        {TYPE_LABEL[row.response_type]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-stone-700">{row.notes ?? ""}</td>
                    <td className="px-3 py-3 text-stone-600">{formatRespondedAt(row.created_at)}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <a
                          href={`tel:${row.phone}`}
                          className="rounded border border-stone-300 px-2 py-1 text-xs text-stone-700 hover:bg-stone-50"
                          aria-label={`Call ${row.farmer_name}`}
                        >
                          ☎
                        </a>
                        <a
                          href={`sms:${row.phone}`}
                          className="rounded border border-stone-300 px-2 py-1 text-xs text-stone-700 hover:bg-stone-50"
                          aria-label={`Text ${row.farmer_name}`}
                        >
                          ✉
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <button
              type="button"
              className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700"
            >
              Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
