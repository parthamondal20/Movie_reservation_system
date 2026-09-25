import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../services/booking";
import { useAppSelector } from "../app/hook/hook";
import Loader from "../components/Loader";
import "../styles/Bookings.css";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Booking {
    booking_id: number;
    movie_title: string;
    theater_name: string;
    screen_name: string;
    start_time: string;
    end_time: string;
    ticket_number: string;
    qrcode: string;
    booked_at: string;
    total_amount: number;
    seats: string[];
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(d: string) {
    return new Date(d).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function timeAgo(d: string) {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return "Just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const dy = Math.floor(h / 24);
    if (dy < 30) return `${dy}d ago`;
    return `${Math.floor(dy / 30)}mo ago`;
}

function isUpcoming(t: string) {
    return new Date(t).getTime() > Date.now();
}

/* ──────────────────────────────────────────────
   QR Modal
   ────────────────────────────────────────────── */

function QRModal({
    booking,
    onClose,
}: {
    booking: Booking;
    onClose: () => void;
}) {
    return (
        <div
            className="qr-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="qr-card bg-gray-900 border border-white/[0.08] rounded-2xl p-8 max-w-[280px] w-full text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-xl p-3 mb-5 mx-auto w-fit">
                    <img
                        src={booking.qrcode}
                        alt={`QR ${booking.ticket_number}`}
                        className="w-40 h-40 object-contain"
                    />
                </div>
                <p className="text-white font-medium text-sm mb-0.5">
                    {booking.movie_title}
                </p>
                <p className="font-mono text-xs text-gray-500 tracking-wider mb-1">
                    {booking.ticket_number}
                </p>
                <p className="text-[11px] text-gray-600">
                    {formatDate(booking.start_time)} · {formatTime(booking.start_time)}
                </p>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Booking Card
   ────────────────────────────────────────────── */

function BookingCard({
    booking,
    index,
    onShowQR,
}: {
    booking: Booking;
    index: number;
    onShowQR: (b: Booking) => void;
}) {
    const upcoming = isUpcoming(booking.start_time);

    return (
        <div
            className="booking-card rounded-2xl bg-gray-900/50 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* ── Top ── */}
            <div className="p-5">
                {/* Row 1 — Title + Status */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                    <h3 className="text-[15px] font-semibold text-white truncate">
                        {booking.movie_title}
                    </h3>
                    {upcoming ? (
                        <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Upcoming
                        </span>
                    ) : (
                        <span className="flex-shrink-0 text-[11px] font-medium text-gray-600">
                            Completed
                        </span>
                    )}
                </div>

                {/* Row 2 — Details */}
                <div className="space-y-2 text-[13px]">
                    {/* Theater + Screen */}
                    <div className="flex items-center gap-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                        <span>
                            {booking.theater_name}
                            <span className="text-gray-700 mx-1.5">·</span>
                            <span className="text-gray-500">{booking.screen_name}</span>
                        </span>
                    </div>

                    {/* Date + Time */}
                    <div className="flex items-center gap-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <span>
                            {formatDate(booking.start_time)}
                            <span className="text-gray-700 mx-1.5">·</span>
                            <span className="text-gray-500">
                                {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                            </span>
                        </span>
                    </div>

                    {/* Seats */}
                    <div className="flex items-center gap-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                        </svg>
                        <span>
                            {booking.seats.join(", ")}
                            <span className="text-gray-600 ml-1.5 text-xs">
                                ({booking.seats.length} {booking.seats.length === 1 ? "seat" : "seats"})
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Tear line ── */}
            <div className="ticket-notch">
                <div className="ticket-divider mx-5" />
            </div>

            {/* ── Bottom ── */}
            <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-gray-600 tracking-wider">
                        {booking.ticket_number}
                    </span>
                    <span className="text-[11px] text-gray-700">
                        {timeAgo(booking.booked_at)}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                        ₹{Number(booking.total_amount).toLocaleString("en-IN")}
                    </span>
                    <button
                        onClick={() => onShowQR(booking)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                        title="View QR Code"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Empty / Auth States
   ────────────────────────────────────────────── */

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="w-16 h-16 text-gray-800 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
            <p className="text-gray-400 text-sm mb-1">No bookings yet</p>
            <p className="text-gray-600 text-xs mb-5">Your tickets will show up here after booking.</p>
            <Link to="/movies" className="px-4 py-2 text-xs font-medium text-gray-950 bg-white rounded-lg hover:bg-gray-200 transition-colors">
                Browse Movies
            </Link>
        </div>
    );
}

function LoginPrompt() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="w-16 h-16 text-gray-800 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className="text-gray-400 text-sm mb-1">Sign in to view bookings</p>
            <p className="text-gray-600 text-xs mb-5">Log in to see your history and upcoming shows.</p>
            <Link to="/login" className="px-4 py-2 text-xs font-medium text-gray-950 bg-white rounded-lg hover:bg-gray-200 transition-colors">
                Sign In
            </Link>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */

type Tab = "all" | "upcoming" | "past";

export default function Bookings() {
    const { user } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("all");
    const [qrBooking, setQrBooking] = useState<Booking | null>(null);

    const { data, isLoading, isError } = useQuery<Booking[]>({
        queryKey: ["bookings", user?.id],
        queryFn: () => getBookings(user!.id),
        enabled: !!user,
    });

    const bookings = data ?? [];

    const upcomingCount = useMemo(
        () => bookings.filter((b) => isUpcoming(b.start_time)).length,
        [bookings]
    );

    const filtered = useMemo(() => {
        if (tab === "upcoming") return bookings.filter((b) => isUpcoming(b.start_time));
        if (tab === "past") return bookings.filter((b) => !isUpcoming(b.start_time));
        return bookings;
    }, [bookings, tab]);

    /* Guards */
    if (!user)
        return (
            <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto"><LoginPrompt /></div>
            </div>
        );

    if (isLoading) return <Loader />;

    if (isError)
        return (
            <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto flex flex-col items-center py-24 text-center">
                    <p className="text-gray-500 text-sm mb-3">Couldn't load bookings.</p>
                    <button onClick={() => navigate(0)} className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] transition-all">
                        Retry
                    </button>
                </div>
            </div>
        );

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: "all", label: "All", count: bookings.length },
        { key: "upcoming", label: "Upcoming", count: upcomingCount },
        { key: "past", label: "Past", count: bookings.length - upcomingCount },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-5 sm:px-8">
            <div className="max-w-3xl mx-auto">
                {/* ── Header ── */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            My <span className="text-amber-400">Bookings</span>
                        </h1>
                        <p className="mt-1 text-gray-600 text-sm">
                            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
                            {bookings.length > 0 && (
                                <span className="text-gray-700 mx-1.5">·</span>
                            )}
                            {bookings.length > 0 && (
                                <span>
                                    ₹{bookings.reduce((s, b) => s + Number(b.total_amount), 0).toLocaleString("en-IN")} spent
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Tabs — right-aligned */}
                    {bookings.length > 0 && (
                        <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                            {tabs.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 ${tab === t.key
                                        ? "bg-white/[0.08] text-white"
                                        : "text-gray-600 hover:text-gray-400"
                                        }`}
                                >
                                    {t.label}
                                    <span className="ml-1 opacity-50">{t.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Cards ── */}
                {bookings.length === 0 ? (
                    <EmptyState />
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-600 text-sm">No {tab} bookings.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((b, i) => (
                            <BookingCard
                                key={b.booking_id}
                                booking={b}
                                index={i}
                                onShowQR={setQrBooking}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── QR Modal ── */}
            {qrBooking && (
                <QRModal booking={qrBooking} onClose={() => setQrBooking(null)} />
            )}
        </div>
    );
}
