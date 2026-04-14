import {useState} from "react";

export function ShareModal({onClose}: {onClose: () => void}) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== "undefined" ? window.location.href : ""

    function copy() {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Share recipe</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xs"
                    >
                        ✕
                    </button>
                </div>

                {/* URL row */}
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={url}
                        className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 truncate focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={copy}
                        className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            copied
                                ? "bg-green-500 text-white"
                                : "bg-amber-500 hover:bg-amber-600 text-white"
                        }`}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>
        </div>
    )
}
