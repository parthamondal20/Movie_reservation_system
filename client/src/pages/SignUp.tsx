import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/auth";
import { useAppDispatch } from "../app/hook/hook";
import { loginUser } from "../app/features/authSlice";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
export default function SignUp() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const user = await signUp(form);
            dispatch(loginUser(user));
            toast.success("signup successful");
            console.log(user);
            navigate("/", {
                replace: true
            })
        } catch (error: any) {
            toast.error((error as any)?.response?.data?.message || "Signup failed")
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Loader />
    }
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-5 pt-16">
            <div className="w-full max-w-sm">
                <div className="block text-center mb-10">
                    <span className="text-2xl font-bold text-white tracking-tight">
                        Cine<span className="text-amber-400">Book</span>
                    </span>
                </div>

                {/* Page Title */}
                <h1 className="text-xl font-semibold text-white text-center mb-8">
                    Create your account
                </h1>

                {/* Google Button */}
                <button
                    onClick={() => console.log("TODO: Google OAuth")}
                    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-gray-300 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-xs text-gray-600">or</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-900/60 border border-white/[0.06] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-900/60 border border-white/[0.06] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-900/60 border border-white/[0.06] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-amber-500 text-gray-950 font-semibold text-sm hover:bg-amber-400 transition-colors duration-200 mt-2 cursor-pointer"
                    >
                        Create Account
                    </button>
                </form>

                {/* Bottom text */}
                <p className="mt-8 text-center text-xs text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-amber-400/80 hover:text-amber-400 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
