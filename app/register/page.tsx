"use client";

import { useState } from "react";

type RegState = "idle" | "submitting" | "success" | "error";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState<RegState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/farmers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address_text: address.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Registration failed. Please try again.");
      }

      setState("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
        <div className="w-full max-w-md rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">You&apos;re registered!</p>
          <h1 className="mt-2 text-2xl font-semibold text-emerald-900">
            We&apos;ll text you when a delivery route is planned near your farm.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Register</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Sign up for delivery notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ll text you when a food rescue route is planned near your farm. No login required.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Phone number
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Address or zip code
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Farm address or zip code"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          {state === "error" && errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === "submitting"}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {state === "submitting" ? "Registering…" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}