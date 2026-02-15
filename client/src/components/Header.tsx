import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hook/hook";
import { logoutUser } from "../app/features/authSlice";
import { logout } from "../services/auth";
import toast from "react-hot-toast";
import Loader from "./Loader";
const navLinks = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Showtimes", to: "/showtimes" },
  { label: "My Bookings", to: "/bookings" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      dispatch(logoutUser());
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />
  }
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white tracking-tight">
            Cine<span className="text-amber-400">Book</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-300">
                  Hi, <span className="text-amber-400 font-medium">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-white/[0.08] hover:bg-red-500/20 hover:text-red-400 border border-white/[0.08] transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-medium text-white rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="px-5 pb-5 space-y-1 border-t border-white/[0.06]">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <div className="px-3 py-2.5 text-sm text-gray-300">
                Hi, <span className="text-amber-400 font-medium">{user.name}</span>
              </div>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full mt-2 px-4 py-2.5 text-center text-sm font-medium text-red-400 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-2 px-4 py-2.5 text-center text-sm font-medium text-white rounded-lg bg-white/[0.08] border border-white/[0.08]"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
