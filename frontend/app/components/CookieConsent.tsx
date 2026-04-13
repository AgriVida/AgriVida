import { useEffect, useState } from "react";
import { Link } from "react-router";

const STORAGE_KEY = "ogm-cookie-consent";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    // Only runs on the client — avoids SSR hydration mismatch
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) setVisible(true);
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, "accepted");
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(STORAGE_KEY, "declined");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className="max-w-3xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon + text */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-xl shrink-0" aria-hidden>🍪</span>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        We use cookies to keep you signed in and improve your experience. By continuing you agree to our{" "}
                        <Link to="/legal/privacy-policy" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={decline}
                        className="px-4 py-2 rounded-lg border border-gray-600 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        onClick={accept}
                        className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                        Accept all
                    </button>
                </div>
            </div>
        </div>
    );
}
