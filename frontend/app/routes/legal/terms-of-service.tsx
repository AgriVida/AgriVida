export function meta() {
    return [
        { title: "Terms of Service — Our Great Meals" },
        { name: "description", content: "Terms of Service for Our Great Meals" },
    ];
}

export default function TermsOfService() {
    const lastUpdated = "April 12, 2026";

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-400 mb-10">Last updated: {lastUpdated}</p>

            <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing or using Our Great Meals ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access the Service.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                    <p>Our Great Meals is a recipe-matching platform that allows users to upload photos of fridge contents, discover recipes based on available ingredients, save and review recipes, and connect with friends to share cooking activity. Features are subject to change at our discretion.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                    <p>To access certain features, you must create an account. You agree to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Provide accurate, current, and complete registration information.</li>
                        <li>Maintain the security of your password and accept responsibility for all activity under your account.</li>
                        <li>Notify us immediately of any unauthorised use of your account.</li>
                        <li>Not create an account using a false identity or on behalf of someone else without authorisation.</li>
                    </ul>
                    <p className="mt-2">We reserve the right to terminate accounts that violate these Terms.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">4. User Content</h2>
                    <p>You retain ownership of content you submit to the Service, including photos, recipes, reviews, and profile information ("User Content"). By submitting User Content, you grant us a non-exclusive, royalty-free, worldwide licence to use, store, display, and distribute that content solely for the purpose of operating and improving the Service.</p>
                    <p className="mt-2">You represent and warrant that you own or have the necessary rights to the User Content you submit, and that it does not violate any third-party rights or applicable law.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Prohibited Conduct</h2>
                    <p>You agree not to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Use the Service for any unlawful purpose or in violation of any regulations.</li>
                        <li>Upload content that is harmful, offensive, defamatory, obscene, or infringes intellectual property rights.</li>
                        <li>Attempt to gain unauthorised access to any part of the Service or its related systems.</li>
                        <li>Use automated tools (bots, scrapers) to access the Service without prior written consent.</li>
                        <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                        <li>Impersonate any person or entity.</li>
                        <li>Collect or harvest user data without consent.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
                    <p>All content, design, graphics, logos, and software comprising the Service (excluding User Content) are the property of Our Great Meals or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Recipe Information Disclaimer</h2>
                    <p>Recipes and nutritional information provided on the Service are for informational purposes only. We make no representations or warranties as to the accuracy, completeness, or suitability of any recipe for your dietary needs, allergies, or health conditions. Always consult a qualified professional for dietary or medical advice.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
                    <p>The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
                    <p>To the fullest extent permitted by law, Our Great Meals shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from these Terms shall not exceed the amount you paid us in the twelve months prior to the claim.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Termination</h2>
                    <p>We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will immediately cease.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Governing Law</h2>
                    <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Our Great Meals operates, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of that jurisdiction.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
                    <p>We reserve the right to modify these Terms at any time. We will update the "Last updated" date and, for material changes, provide notice through the Service. Your continued use of the Service following any changes constitutes your acceptance of the revised Terms.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Contact Us</h2>
                    <p>For questions about these Terms, please contact:</p>
                    <address className="not-italic mt-2">
                        <p>Our Great Meals</p>
                        <p>Email: <a href="mailto:legal@our-great-meals.com" className="text-amber-600 hover:underline">legal@our-great-meals.com</a></p>
                        <p>Website: <a href="https://www.our-great-meals.com" className="text-amber-600 hover:underline">www.our-great-meals.com</a></p>
                    </address>
                </section>

            </div>
        </div>
    );
}
