import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.06] bg-gray-950">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo + Copyright */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-sm font-semibold text-white tracking-tight">
                            Cine<span className="text-amber-400">Book</span>
                        </Link>
                        <span className="text-gray-600">·</span>
                        <p className="text-xs text-gray-500">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                        <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
                        <Link to="/help" className="hover:text-gray-300 transition-colors">Help</Link>
                        <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
