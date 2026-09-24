import { useState, useMemo, Fragment } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getShowById } from "../services/shows";
import { getSeatsByShowId, type Seat } from "../services/seats";
import { getBookedSeats } from "../services/booked_seats";
import { bookSeats } from "../services/booking";
import { useAppSelector } from "../app/hook/hook";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import "../styles/SeatSelection.css";
/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface ShowDetails {
    show_id: number;
    start_time: string;
    end_time: string;
    movie_id: number;
    movie_title: string;
    movie_poster: string;
    movie_genre: string;
    movie_duration: string;
    movie_rating: string;
    theater_id: number;
    theater_name: string;
    theater_address: string;
    theater_city: string;
    screen_number: string;
    seat_rows: number;
    seat_cols: number;
}

interface SelectedSeatInfo {
    key: string;
    seatId: number;
    label: string;
    tier: string;
    price: number;
    row: number;
    col: number;
    tierColor: string;
}

/* ──────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────── */

const MAX_SEATS = 10;

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getTierStyle(
    seatType: string
): { label: string; color: string; bgColor: string } {
    switch (seatType) {
        case "premium":
            return { label: "Premium", color: "text-amber-400", bgColor: "bg-amber-500/8" };
        case "economy":
            return { label: "Economy", color: "text-emerald-400", bgColor: "bg-emerald-500/8" };
        default:
            return { label: "Standard", color: "text-blue-400", bgColor: "bg-blue-500/8" };
    }
}

function getTierColor(seatType: string): string {
    switch (seatType) {
        case "premium": return "text-amber-400";
        case "economy": return "text-emerald-400";
        default: return "text-blue-400";
    }
}

function getScreenType(screenNumber: string): { label: string; color: string } {
    const lower = screenNumber.toLowerCase();
    if (lower.includes("imax")) return { label: "IMAX", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (lower.includes("gold") || lower.includes("luxe")) return { label: "GOLD", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
    if (lower.includes("4dx")) return { label: "4DX", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" };
    return { label: "2D", color: "text-gray-400 bg-gray-500/10 border-gray-500/20" };
}

/* ──────────────────────────────────────────────
   Seat Selection Page
   ────────────────────────────────────────────── */

export default function SeatSelection() {
    const { movie_id, show_id } = useParams<{ movie_id: string; show_id: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

    /* ── Fetch show details ── */
    const {
        data: show,
        isLoading: showLoading,
        isError: showError,
    } = useQuery<ShowDetails>({
        queryKey: ["show-details", show_id],
        queryFn: () => getShowById(Number(show_id)),
        enabled: !!show_id,
    });

    /* ── Fetch seats from DB ── */
    const {
        data: seats = [],
        isLoading: seatsLoading,
    } = useQuery<Seat[]>({
        queryKey: ["seats", show_id],
        queryFn: () => getSeatsByShowId(Number(show_id)),
        enabled: !!show_id,
    });

    const {
        data: bookedSeatsData,
        isLoading: bookedSeatsLoading
    } = useQuery({
        queryKey: ["booked-seats", show_id],
        queryFn: () => getBookedSeats(Number(show_id)),
        enabled: !!show_id,
    });

    /* ── Build a Set of booked seat IDs for O(1) lookup ── */
    const bookedSeatIds = useMemo(() => {
        const ids = new Set<number>();
        const rows = bookedSeatsData?.data ?? [];
        for (const row of rows) {
            ids.add(row.seat_id);
        }
        return ids;
    }, [bookedSeatsData]);

    /* ── Organize seats into a grid (row → col → seat) ── */
    const seatGrid = useMemo(() => {
        const grid = new Map<number, Map<number, Seat>>();
        for (const seat of seats) {
            if (!grid.has(seat.row_number)) {
                grid.set(seat.row_number, new Map());
            }
            grid.get(seat.row_number)!.set(seat.col_number, seat);
        }
        return grid;
    }, [seats]);

    /* ── Compute unique tiers for the pricing badges ── */
    const tierInfo = useMemo(() => {
        const tiers = new Map<string, { price: number; minRow: number; maxRow: number }>();
        for (const seat of seats) {
            const existing = tiers.get(seat.seat_type);
            if (!existing) {
                tiers.set(seat.seat_type, { price: Number(seat.price), minRow: seat.row_number, maxRow: seat.row_number });
            } else {
                existing.minRow = Math.min(existing.minRow, seat.row_number);
                existing.maxRow = Math.max(existing.maxRow, seat.row_number);
            }
        }
        return tiers;
    }, [seats]);

    const isLoading = showLoading || seatsLoading || bookedSeatsLoading;
    const isError = showError;

    /* ── Seat toggle ── */
    const toggleSeat = (seatKey: string) => {
        // Check if seat is booked
        const [r, c] = seatKey.split("-").map(Number);
        const seat = seatGrid.get(r)?.get(c);
        if (seat && bookedSeatIds.has(seat.id)) {
            toast.error(`Seat ${seat.seat_number} is already booked`, {
                style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.08)" },
            });
            return;
        }

        setSelectedSeats((prev) => {
            const next = new Set(prev);
            if (next.has(seatKey)) {
                next.delete(seatKey);
            } else {
                if (next.size >= MAX_SEATS) {
                    toast.error(`Maximum ${MAX_SEATS} seats per booking`, {
                        style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.08)" },
                    });
                    return prev;
                }
                next.add(seatKey);
            }
            return next;
        });
    };

    /* ── Booking summary calculation ── */
    const bookingSummary = useMemo(() => {
        if (!show) return { seats: [] as SelectedSeatInfo[], total: 0, tierBreakdown: {} as Record<string, { count: number; price: number; color: string }> };

        const selectedSeatInfos: SelectedSeatInfo[] = Array.from(selectedSeats)
            .map((key) => {
                const [r, c] = key.split("-").map(Number);
                const dbSeat = seatGrid.get(r)?.get(c);
                const style = getTierStyle(dbSeat?.seat_type || "standard");
                return {
                    key,
                    seatId: dbSeat?.id ?? 0,
                    label: dbSeat?.seat_number ?? `${String.fromCharCode(65 + r)}${c + 1}`,
                    tier: style.label,
                    price: dbSeat ? Number(dbSeat.price) : 250,
                    row: r,
                    col: c,
                    tierColor: style.color,
                };
            })
            .sort((a, b) => a.row - b.row || a.col - b.col);

        const total = selectedSeatInfos.reduce((sum, s) => sum + s.price, 0);

        const tierBreakdown: Record<string, { count: number; price: number; color: string }> = {};
        selectedSeatInfos.forEach((s) => {
            if (!tierBreakdown[s.tier]) {
                tierBreakdown[s.tier] = { count: 0, price: s.price, color: s.tierColor };
            }
            tierBreakdown[s.tier].count++;
        });

        return { seats: selectedSeatInfos, total, tierBreakdown };
    }, [selectedSeats, show, seatGrid]);

    /* ── Middle column for aisle gap ── */
    const aisleCol = show ? Math.floor(show.seat_cols / 2) : 0;

    /* ── Booking mutation (hooks must be at top level) ── */
    const bookingMutation = useMutation({
        mutationKey: ["booking"],
        mutationFn: (params: { userId: number; showId: number; seats: typeof bookingSummary.seats }) =>
            bookSeats(params.userId, params.showId, params.seats),
        onSuccess: () => {
            toast.success(`Booking confirmed!`, {
                style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(245,158,11,0.3)" },
                icon: "🎬",
            });
        },
        onError: () => {
            toast.error("Failed to book seats", {
                style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(245,158,11,0.3)" },
            });
        },
    });

    /* ── Handle book ── */
    const handleBookNow = () => {
        console.log(bookingSummary.seats);
        if (!user) {
            toast.error("Please log in to book seats", {
                style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.08)" },
            });
            navigate("/login");
            return;
        }
        if (selectedSeats.size === 0) {
            toast.error("Please select at least one seat", {
                style: { background: "#1f2937", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.08)" },
            });
            return;
        }

        bookingMutation.mutate({
            userId: user.id,
            showId: Number(show_id),
            seats: bookingSummary.seats,
        });
    };

    /* ── Loading ── */
    if (isLoading) return <Loader />;

    /* ── Error / Not Found ── */
    if (isError || !show) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center pt-16 px-5 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-900/60 border border-white/[0.06] flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Show not found</h2>
                <p className="text-sm text-gray-500 mb-6">This show doesn't exist or has been removed.</p>
                <Link
                    to={`/movies/${movie_id}/shows`}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all duration-200"
                >
                    ← Back to Shows
                </Link>
            </div>
        );
    }

    const screenType = getScreenType(show.screen_number);

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* ══════════════════════════════════════════════
                HEADER — Movie + Show info with blurred backdrop
               ══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-b border-white/[0.04]">
                {/* Blurred BG */}
                <div className="absolute inset-0">
                    <img src={show.movie_poster} alt="" className="w-full h-full object-cover scale-110 blur-3xl opacity-15" />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 to-gray-950" />
                </div>

                <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                        <Link to="/movies" className="hover:text-amber-400 transition-colors">Movies</Link>
                        <span className="text-gray-700">›</span>
                        <Link to={`/movies/${show.movie_id}`} className="hover:text-amber-400 transition-colors truncate max-w-[120px]">{show.movie_title}</Link>
                        <span className="text-gray-700">›</span>
                        <Link to={`/movies/${show.movie_id}/shows`} className="hover:text-amber-400 transition-colors">Shows</Link>
                        <span className="text-gray-700">›</span>
                        <span className="text-gray-400">Seats</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                        {/* Poster */}
                        <img
                            src={show.movie_poster}
                            alt={show.movie_title}
                            className="w-20 h-28 sm:w-24 sm:h-34 object-cover rounded-xl border border-white/[0.08] shadow-xl shadow-black/40 flex-shrink-0 hidden sm:block"
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight truncate">
                                {show.movie_title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/25 uppercase tracking-wider">
                                    {show.movie_genre}
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-300 bg-white/[0.06] border border-white/[0.06]">
                                    🕐 {show.movie_duration}
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-300 bg-white/[0.06] border border-white/[0.06]">
                                    ★ {show.movie_rating}/10
                                </span>
                            </div>

                            {/* Show details */}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-white/[0.06]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m12-3.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5m1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-300">{show.theater_name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-white/[0.06]">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${screenType.color}`}>
                                        {screenType.label}
                                    </span>
                                    <span className="text-xs font-medium text-gray-300">{show.screen_number}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/60 border border-white/[0.06]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-300">
                                        {formatDate(show.start_time)} · {formatTime(show.start_time)} – {formatTime(show.end_time)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                MAIN CONTENT — Seat grid + Booking summary
               ══════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── LEFT: Seat Map ── */}
                    <div className="flex-1 min-w-0">
                        {/* Tier pricing badges */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                            {Array.from(tierInfo.entries()).map(([type, info]) => {
                                const style = getTierStyle(type);
                                const rowStart = String.fromCharCode(65 + info.minRow);
                                const rowEnd = String.fromCharCode(65 + info.maxRow);
                                const rowLabel = rowStart === rowEnd ? `Row ${rowStart}` : `Row ${rowStart}–${rowEnd}`;
                                return (
                                    <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] ${style.bgColor}`}>
                                        <span className={`text-xs font-bold ${style.color}`}>₹{info.price}</span>
                                        <span className="text-[10px] text-gray-500 font-medium">{style.label}</span>
                                        <span className="text-[10px] text-gray-600">({rowLabel})</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Seat map container */}
                        <div className="relative rounded-2xl bg-gray-900/30 border border-white/[0.05] p-6 sm:p-8 overflow-x-auto">
                            {/* Screen */}
                            <div className="screen-curve" />

                            {/* Seat Grid */}
                            <div className="seat-grid">
                                {Array.from(seatGrid.entries())
                                    .sort(([a], [b]) => a - b)
                                    .map(([rowIndex, cols]) => {
                                        const firstSeat = cols.values().next().value;
                                        const tierColor = getTierColor(firstSeat?.seat_type || "standard");
                                        const rowLabelColor = tierColor.includes("amber") ? "rgba(245,158,11,0.4)" : tierColor.includes("blue") ? "rgba(96,165,250,0.4)" : "rgba(52,211,153,0.4)";
                                        const rowLetter = String.fromCharCode(65 + rowIndex);

                                        return (
                                            <div key={rowIndex} className="seat-row">
                                                {/* Left row label */}
                                                <span className="seat-row-label" style={{ color: rowLabelColor }}>
                                                    {rowLetter}
                                                </span>

                                                {/* Seats */}
                                                {Array.from(cols.entries())
                                                    .sort(([a], [b]) => a - b)
                                                    .map(([colIndex, seat]) => (
                                                        <Fragment key={colIndex}>
                                                            {colIndex === aisleCol && <div className="seat-gap" />}
                                                            <button
                                                                className={`seat ${bookedSeatIds.has(seat.id) ? 'seat-booked' :
                                                                    selectedSeats.has(`${rowIndex}-${colIndex}`) ? 'seat-selected' : ''
                                                                    }`}
                                                                onClick={() => toggleSeat(`${rowIndex}-${colIndex}`)}
                                                                disabled={bookedSeatIds.has(seat.id)}
                                                                title={`${seat.seat_number}${bookedSeatIds.has(seat.id) ? ' (booked)' : ''}`}
                                                            >
                                                                {colIndex + 1}
                                                            </button>
                                                        </Fragment>
                                                    ))}

                                                {/* Right row label */}
                                                <span className="seat-row-label" style={{ color: rowLabelColor }}>
                                                    {rowLetter}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Legend */}
                            <div className="seat-legend">
                                <div className="legend-item">
                                    <div className="legend-dot available" />
                                    <span>Available</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot selected" />
                                    <span>Selected</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot taken" />
                                    <span>Booked</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot locked" />
                                    <span>Locked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Booking Summary (Desktop) ── */}
                    <div className="hidden lg:block w-[320px] flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="booking-summary">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Booking Summary</h3>
                                        <p className="text-[11px] text-gray-500">Select seats to continue</p>
                                    </div>
                                </div>

                                {/* Show info */}
                                <div className="space-y-2 mb-5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Movie</span>
                                        <span className="text-gray-300 font-medium truncate max-w-[160px]">{show.movie_title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Theater</span>
                                        <span className="text-gray-300 font-medium truncate max-w-[160px]">{show.theater_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Screen</span>
                                        <span className="text-gray-300 font-medium">{show.screen_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Show</span>
                                        <span className="text-gray-300 font-medium">{formatTime(show.start_time)}</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/[0.06] my-4" />

                                {/* Selected seats */}
                                {bookingSummary.seats.length === 0 ? (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 mx-auto rounded-xl bg-gray-800/60 border border-white/[0.06] flex items-center justify-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-gray-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-gray-500">Tap on seats to select</p>
                                        <p className="text-[10px] text-gray-600 mt-1">Max {MAX_SEATS} seats per booking</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Seat list */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2.5">
                                                <span className="text-xs font-semibold text-gray-400">
                                                    Selected Seats ({bookingSummary.seats.length})
                                                </span>
                                                <button
                                                    onClick={() => setSelectedSeats(new Set())}
                                                    className="text-[10px] text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {bookingSummary.seats.map((seat) => (
                                                    <button
                                                        key={seat.key}
                                                        onClick={() => toggleSeat(seat.key)}
                                                        className="group/seat flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-semibold hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400 transition-all duration-150 cursor-pointer"
                                                    >
                                                        {seat.label}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5 opacity-0 group-hover/seat:opacity-100 transition-opacity">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tier breakdown */}
                                        <div className="space-y-1.5">
                                            {Object.entries(bookingSummary.tierBreakdown).map(([tier, info]) => (
                                                <div key={tier} className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">
                                                        {tier} × {info.count}
                                                    </span>
                                                    <span className={`font-medium ${info.color}`}>
                                                        ₹{info.price * info.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-dashed border-white/[0.08]" />

                                        {/* Total */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-white">Total</span>
                                            <span className="text-lg font-extrabold text-amber-400">₹{bookingSummary.total}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Book Now button */}
                                <button
                                    onClick={handleBookNow}
                                    disabled={selectedSeats.size === 0}
                                    className={`
                                        w-full mt-5 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer
                                        ${selectedSeats.size > 0
                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98]"
                                            : "bg-gray-800/60 text-gray-600 border border-white/[0.06] cursor-not-allowed"
                                        }
                                    `}
                                >
                                    {selectedSeats.size > 0
                                        ? `Book ${selectedSeats.size} Seat${selectedSeats.size > 1 ? "s" : ""} · ₹${bookingSummary.total}`
                                        : "Select Seats to Continue"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                MOBILE STICKY BOTTOM BAR
               ══════════════════════════════════════════════ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-xl border-t border-white/[0.06]">
                {/* Selected seats ribbon */}
                {bookingSummary.seats.length > 0 && (
                    <div className="px-4 pt-3 pb-1">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] text-gray-500 font-semibold flex-shrink-0">SEATS:</span>
                            {bookingSummary.seats.map((seat) => (
                                <span key={seat.key} className="px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                                    {seat.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action bar */}
                <div className="flex items-center gap-4 p-4 pt-2">
                    <div className="flex-1 min-w-0">
                        {selectedSeats.size > 0 ? (
                            <>
                                <p className="text-lg font-extrabold text-amber-400">₹{bookingSummary.total}</p>
                                <p className="text-[10px] text-gray-500">{selectedSeats.size} seat{selectedSeats.size > 1 ? "s" : ""} selected</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-white truncate">{show.movie_title}</p>
                                <p className="text-[10px] text-gray-500">{formatTime(show.start_time)} · {show.screen_number}</p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleBookNow}
                        disabled={selectedSeats.size === 0}
                        className={`
                            flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer
                            ${selectedSeats.size > 0
                                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-lg shadow-amber-500/25 active:scale-[0.97]"
                                : "bg-gray-800/60 text-gray-600 border border-white/[0.06] cursor-not-allowed"
                            }
                        `}
                    >
                        {selectedSeats.size > 0 ? "Book Now" : "Select Seats"}
                    </button>
                </div>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="lg:hidden h-28" />
        </div>
    );
}
