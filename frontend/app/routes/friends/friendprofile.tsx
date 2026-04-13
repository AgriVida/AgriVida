import { useState } from "react";
import { redirect, useLoaderData, Link } from "react-router";
import type { Route } from "./+types/friendprofile";
import { getSession } from "~/utils/session.server";

export async function loader({ request, params }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    if (!session.has("user")) {
        throw redirect("/sign-in")
    }

    const response = await fetch(`${process.env.REST_API_URL}/user/${params.userId}`)
    const result = await response.json()

    if (result.status !== 200 || !result.data) {
        throw new Response("Friend not found", { status: 404 })
    }

    return { friend: result.data }
}

// ── Avatar helpers (same pattern as allfriends) ───────────────
const AVATAR_COLORS = [
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-teal-100 text-teal-700",
]
function avatarColor(id: string) {
    const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}
function initials(username: string) {
    return username.slice(0, 2).toUpperCase()
}

export default function FriendProfile() {
    const { friend } = useLoaderData<typeof loader>()
    const [activeTab, setActiveTab] = useState<"recipes" | "activity" | "mutual">("recipes")
    const [avatarError, setAvatarError] = useState(false)

    const joinedDate = friend.createdAt
        ? new Date(friend.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
        : null

    const joinedYear = friend.createdAt
        ? new Date(friend.createdAt).getFullYear()
        : "—"

    const tabs = [
        { key: "recipes",  label: "Recipes" },
        { key: "activity", label: "Activity" },
        { key: "mutual",   label: "Mutual friends" },
    ] as const

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* ── Back button ── */}
            <Link
                to="/allfriends"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors mb-8"
            >
                ← Back to friends
            </Link>

            {/* ── Profile header ── */}
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="shrink-0">
                    {avatarError ? (
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl ${avatarColor(friend.id)}`}>
                            {initials(friend.username)}
                        </div>
                    ) : (
                        <img
                            src={`/api/avatar/${friend.id}`}
                            alt={friend.username}
                            className="w-20 h-20 rounded-full object-cover"
                            onError={() => setAvatarError(true)}
                        />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{friend.username}</h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                @{friend.username.toLowerCase().replace(/\s+/g, "")}
                                {joinedDate && <> · Member since {joinedDate}</>}
                            </p>
                            {friend.bio && (
                                <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-md">{friend.bio}</p>
                            )}
                            {/* Static tag pill */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full border border-gray-300 text-xs text-gray-600">
                                    Home cook
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 shrink-0">
                            <button
                                type="button"
                                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                ✓ Friends
                            </button>
                            <button
                                type="button"
                                className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {[
                    { label: "Meals cooked",   value: "—" },
                    { label: "Recipes saved",  value: "—" },
                    { label: "Mutual friends", value: "—" },
                    { label: "Member since",   value: joinedYear },
                ].map(stat => (
                    <div key={stat.label} className="border border-gray-200 rounded-xl px-4 py-4 bg-white text-center">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Tab bar ── */}
            <div className="flex gap-2 mt-8 border-b border-gray-200 pb-0">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={[
                            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                            activeTab === tab.key
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-400 hover:text-gray-600",
                        ].join(" ")}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            <div className="mt-8">
                <p className="text-sm text-center text-gray-400 py-12">
                    No {activeTab === "recipes" ? "recipes" : activeTab === "activity" ? "activity" : "mutual friends"} to show yet.
                </p>
            </div>

        </div>
    )
}
