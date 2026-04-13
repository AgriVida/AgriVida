export function meta() {
    return [
        { title: "Copyright Notice — Our Great Meals" },
        { name: "description", content: "Copyright Notice for Our Great Meals" },
    ];
}

export default function Copyright() {
    const year = new Date().getFullYear();

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Copyright Notice</h1>
            <p className="text-sm text-gray-400 mb-10">Effective date: January 1, 2025</p>

            <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Copyright Ownership</h2>
                    <p>© {year} Our Great Meals. All rights reserved.</p>
                    <p className="mt-2">All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Our Great Meals and is protected by applicable copyright laws, both domestically and internationally.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Permitted Use</h2>
                    <p>You may access and use the content on this website for your personal, non-commercial use only. The following are permitted without prior written consent:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Viewing and printing individual pages for personal reference.</li>
                        <li>Sharing links to pages on this website.</li>
                        <li>Saving recipes to your account for personal use.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Use</h2>
                    <p>Without express written permission from Our Great Meals, you may not:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Reproduce, distribute, or publicly display any content from this website.</li>
                        <li>Modify or create derivative works from our content.</li>
                        <li>Use our content for commercial purposes.</li>
                        <li>Scrape, crawl, or systematically download content from this website.</li>
                        <li>Remove or alter any copyright, trademark, or other proprietary notices.</li>
                        <li>Frame or mirror any part of this website without prior written consent.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">User-Generated Content</h2>
                    <p>Content submitted by users — including profile photos, recipe reviews, and bio information — remains the intellectual property of the respective user. By submitting content to Our Great Meals, you grant us a non-exclusive, royalty-free licence to use that content for the purpose of operating the platform, as described in our <a href="/legal/privacy-policy" className="text-amber-600 hover:underline">Privacy Policy</a> and <a href="/legal/terms-of-service" className="text-amber-600 hover:underline">Terms of Service</a>.</p>
                    <p className="mt-2">You represent that you own or have the necessary rights to any content you submit, and that such content does not infringe the intellectual property rights of any third party.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Trademarks</h2>
                    <p>The Our Great Meals name, logo, and all related marks, names, and slogans are trademarks or registered trademarks of Our Great Meals. You may not use these marks without our prior written permission. All other trademarks referenced on this website are the property of their respective owners.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">DMCA — Digital Millennium Copyright Act</h2>
                    <p>If you believe that any content on our website infringes upon your copyright, please send a written notification to our designated agent with the following information:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>A physical or electronic signature of the copyright owner or authorised agent.</li>
                        <li>Identification of the copyrighted work claimed to have been infringed.</li>
                        <li>The URL or location of the infringing material on our website.</li>
                        <li>Your contact information (name, address, phone number, and email).</li>
                        <li>A statement that you have a good-faith belief that the use is not authorised by the copyright owner, its agent, or the law.</li>
                        <li>A statement that the information in the notification is accurate and, under penalty of perjury, that you are the copyright owner or authorised to act on their behalf.</li>
                    </ul>
                    <p className="mt-3">Send DMCA notices to: <a href="mailto:dmca@our-great-meals.com" className="text-amber-600 hover:underline">dmca@our-great-meals.com</a></p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Content</h2>
                    <p>Some content on this website may be sourced from third parties. Such content remains the property of the respective third-party owners and is used in accordance with applicable licences or permissions. We make no claim of ownership over third-party content.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
                    <p>For copyright-related enquiries, licensing requests, or permissions, please contact:</p>
                    <address className="not-italic mt-2 space-y-1">
                        <p>Our Great Meals</p>
                        <p>Email: <a href="mailto:copyright@our-great-meals.com" className="text-amber-600 hover:underline">copyright@our-great-meals.com</a></p>
                        <p>Website: <a href="https://www.our-great-meals.com" className="text-amber-600 hover:underline">www.our-great-meals.com</a></p>
                    </address>
                </section>

            </div>
        </div>
    );
}
