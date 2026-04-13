import { Link } from "react-router";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-amber-500 mt-24">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

                    {/* Brand */}
                    <div>
                        <p className="font-bold text-white text-sm">
                            Our Great Meals
                        </p>
                        <p className="text-xs text-black mt-1 max-w-xs">
                            Snap your fridge. Cook something great.
                        </p>
                    </div>

                    {/* Legal links */}
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-white uppercase mb-3">Legal</p>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/legal/privacy-policy" className="text-sm text-black hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal/terms-of-service" className="text-sm text-black hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal/accessibility" className="text-sm text-black hover:text-white transition-colors">
                                    Accessibility
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal/copyright" className="text-sm text-black hover:text-white transition-colors">
                                    Copyright Notice
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company links */}
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-white uppercase mb-3">Product</p>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/meals" className="text-sm text-black hover:text-white transition-colors">
                                    Meals
                                </Link>
                            </li>
                            <li>
                                <Link to="/#upload" className="text-sm text-black hover:text-white transition-colors">
                                    Upload a photo
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm text-black hover:text-white transition-colors">
                                    Sign in
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="border-t border-orange-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-black">
                        © {year} Our Great Meals. All rights reserved.
                    </p>
                    <p className="text-xs text-black">
                        www.our-great-meals.com
                    </p>
                </div>
            </div>
        </footer>
    );
}
