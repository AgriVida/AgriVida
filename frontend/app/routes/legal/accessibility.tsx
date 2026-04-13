export function meta() {
    return [
        { title: "Accessibility — Our Great Meals" },
        { name: "description", content: "ADA Website Accessibility Statement for Our Great Meals" },
    ];
}

export default function Accessibility() {
    const lastUpdated = "April 12, 2026";

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessibility Statement</h1>
            <p className="text-sm text-gray-400 mb-10">Last updated: {lastUpdated}</p>

            <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Our Commitment</h2>
                    <p>Our Great Meals is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards to ensure we provide equal access to all users.</p>
                    <p className="mt-2">We believe the internet should be available and accessible to everyone, and we are committed to providing a website that is accessible to the widest possible audience, regardless of ability or technology.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Conformance Status</h2>
                    <p>We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These guidelines explain how to make web content more accessible to people with disabilities. Conformance with these guidelines helps make the web more user-friendly for all people.</p>
                    <p className="mt-2">We are working toward full conformance and acknowledge that some areas of our website may still be in the process of being updated to meet these standards.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Measures We Take</h2>
                    <p>Our Great Meals takes the following measures to ensure accessibility:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Include accessibility as part of our development and design process.</li>
                        <li>Provide text alternatives for non-text content, including images and icons.</li>
                        <li>Ensure sufficient colour contrast between text and backgrounds.</li>
                        <li>Design interactive elements to be operable via keyboard navigation.</li>
                        <li>Use semantic HTML to support screen readers and assistive technologies.</li>
                        <li>Ensure form fields have visible labels and descriptive error messages.</li>
                        <li>Avoid content that flashes more than three times per second.</li>
                        <li>Support browser zoom up to 200% without loss of content or functionality.</li>
                        <li>Use ARIA landmarks and roles where appropriate to improve navigation.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Known Limitations</h2>
                    <p>While we strive for full accessibility, some areas may not yet fully conform to WCAG 2.1 AA standards. We are actively working to address these. Known limitations include:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Some third-party embedded components may not meet all accessibility requirements.</li>
                        <li>Certain interactive elements (drag-and-drop image upload) may have limited keyboard-only alternatives — a file picker button is always available as a fallback.</li>
                        <li>AI-generated ingredient recognition results may not always include fully descriptive text for screen readers.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Assistive Technologies Supported</h2>
                    <p>Our website is designed to be compatible with the following assistive technologies:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Screen readers (e.g., NVDA, JAWS, VoiceOver, TalkBack)</li>
                        <li>Keyboard-only navigation</li>
                        <li>Browser zoom and text resizing</li>
                        <li>High contrast display modes</li>
                        <li>Speech recognition software (e.g., Dragon NaturallySpeaking)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">ADA Compliance</h2>
                    <p>Our Great Meals is committed to complying with the Americans with Disabilities Act (ADA) and ensuring our digital services are accessible to individuals with disabilities. We regularly review our website and make improvements to remove barriers to access.</p>
                    <p className="mt-2">If you encounter barriers while using our website, please contact us so we can address the issue promptly.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Feedback and Contact</h2>
                    <p>We welcome your feedback on the accessibility of Our Great Meals. If you experience accessibility barriers or have suggestions for improvement, please contact us:</p>
                    <address className="not-italic mt-3 space-y-1">
                        <p><strong>Email:</strong> <a href="mailto:accessibility@our-great-meals.com" className="text-amber-600 hover:underline">accessibility@our-great-meals.com</a></p>
                        <p><strong>Website:</strong> <a href="https://www.our-great-meals.com" className="text-amber-600 hover:underline">www.our-great-meals.com</a></p>
                    </address>
                    <p className="mt-3">We aim to respond to accessibility feedback within <strong>2 business days</strong>.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Formal Complaints</h2>
                    <p>If you are not satisfied with our response, you may contact the relevant national or regional accessibility authority in your jurisdiction. In the United States, you may file a complaint with the U.S. Department of Justice Civil Rights Division.</p>
                </section>

            </div>
        </div>
    );
}
