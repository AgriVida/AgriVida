export function meta() {
    return [
        { title: "Privacy Policy — Our Great Meals" },
        { name: "description", content: "Privacy Policy for Our Great Meals" },
    ];
}

export default function PrivacyPolicy() {
    const lastUpdated = "April 12, 2026";

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mb-10">Last updated: {lastUpdated}</p>

            <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Introduction</h2>
                    <p>Welcome to Our Great Meals ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
                    <p className="mt-2">Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                    <p>We collect information you provide directly to us, including:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Account information:</strong> username, email address, and password when you register.</li>
                        <li><strong>Profile information:</strong> bio, profile photo, and any other information you add to your profile.</li>
                        <li><strong>Photos:</strong> images of your fridge or ingredients that you upload to use our recipe-matching feature.</li>
                        <li><strong>Usage data:</strong> recipes you save, cook, or interact with on our platform.</li>
                        <li><strong>Communications:</strong> messages or friend requests you send through the platform.</li>
                    </ul>
                    <p className="mt-3">We also automatically collect certain technical data, including IP address, browser type, device information, and pages visited, through standard server logs and cookies.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Create and manage your account.</li>
                        <li>Provide AI-powered ingredient recognition and recipe matching.</li>
                        <li>Personalize your experience and surface relevant recipes.</li>
                        <li>Enable social features such as friends, shared recipes, and activity feeds.</li>
                        <li>Send you service-related communications (e.g., password resets).</li>
                        <li>Improve, maintain, and protect our platform.</li>
                        <li>Comply with legal obligations.</li>
                    </ul>
                    <p className="mt-3">We do not sell your personal information to third parties.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Cookies</h2>
                    <p>We use session cookies to keep you logged in and maintain your preferences. We do not use third-party advertising cookies. You may disable cookies in your browser settings, though some features of the site may not function correctly without them.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Storage and Security</h2>
                    <p>Your data is stored on secure servers. Passwords are hashed and never stored in plain text. Uploaded photos are stored in a private file system and are not publicly accessible without authentication.</p>
                    <p className="mt-2">While we implement reasonable security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Sharing of Information</h2>
                    <p>We do not sell, trade, or rent your personal information. We may share your information only in the following limited circumstances:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>With your consent:</strong> when you choose to make profile information visible to friends.</li>
                        <li><strong>Service providers:</strong> trusted third parties who assist in operating our platform (e.g., hosting providers), subject to confidentiality agreements.</li>
                        <li><strong>Legal requirements:</strong> if required by law, court order, or governmental authority.</li>
                        <li><strong>Business transfers:</strong> in the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Your Rights</h2>
                    <p>Depending on your location, you may have the following rights:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your account and associated data.</li>
                        <li>Object to or restrict certain processing of your data.</li>
                        <li>Data portability (receive a copy of your data in a structured format).</li>
                    </ul>
                    <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:privacy@our-great-meals.com" className="text-amber-600 hover:underline">privacy@our-great-meals.com</a>.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
                    <p>Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the service after changes constitutes acceptance of the revised policy.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact Us</h2>
                    <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
                    <address className="not-italic mt-2">
                        <p>Our Great Meals</p>
                        <p>Email: <a href="mailto:privacy@our-great-meals.com" className="text-amber-600 hover:underline">privacy@our-great-meals.com</a></p>
                        <p>Website: <a href="https://www.our-great-meals.com" className="text-amber-600 hover:underline">www.our-great-meals.com</a></p>
                    </address>
                </section>

            </div>
        </div>
    );
}
