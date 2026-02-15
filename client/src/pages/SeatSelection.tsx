import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { movies } from "../data/movies";
import "../styles/SeatSelection.css";

/* ── Seat layout config ── */
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 12;
const AISLE_AFTER = 3; // gap after seat 3 and seat 9

// Generate some "taken" seats randomly per movie+showtime combo
function generateTakenSeats(movieId: number, showtime: string): Set<string> {
    const taken = new Set<string>();
    const seed = movieId * 1000 + showtime.charCodeAt(0) * 100 + showtime.length;
    let val = seed;
    for (let i = 0; i < 25; i++) {
        val = (val * 16807 + 7) % 2147483647;
        const row = ROWS[val % ROWS.length];
        val = (val * 16807 + 13) % 2147483647;
        const seat = (val % SEATS_PER_ROW) + 1;
        taken.add(`${row}${seat}`);
    }
    return taken;
}

/* ── Price tiers ── */
function getSeatPrice(row: string): number {
    if (["A", "B"].includes(row)) return 120;       // Front
    if (["C", "D", "E", "F"].includes(row)) return 200; // Middle (premium)
    return 150; // Back
}

function getSeatTier(row: string): string {
    if (["A", "B"].includes(row)) return "Front";
    if (["C", "D", "E", "F"].includes(row)) return "Premium";
    return "Back";
}

export default function SeatSelection() {
    const { id } = useParams<{ id: string }>();
    const movie = movies.find((m) => m.id === Number(id));

    const [selectedShowtime, setSelectedShowtime] = useState<string>(movie?.showtimes[0] || "");
    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

    const takenSeats = useMemo(() => {
        if (!movie || !selectedShowtime) return new Set<string>();
        return generateTakenSeats(movie.id, selectedShowtime);
    }, [movie, selectedShowtime]);

    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center pt-16 px-5">
                <h2 className="text-xl font-semibold text-white mb-3">Movie not found</h2>
                <Link to="/" className="text-sm text-amber-400 hover:underline">← Back to Home</Link>
            </div>
        );
    }

    const toggleSeat = (seatId: string) => {
        if (takenSeats.has(seatId)) return;
        setSelectedSeats((prev) => {
            const next = new Set(prev);
            if (next.has(seatId)) next.delete(seatId);
            else if (next.size < 10) next.add(seatId);
            return next;
        });
    };

    const totalPrice = Array.from(selectedSeats).reduce((sum, s) => {
        const row = s.charAt(0);
        return sum + getSeatPrice(row);
    }, 0);

    return (
        <div className="min-h-screen bg-gray-950 text-white pt-20 pb-12 px-5">
            <div className="max-w-5xl mx-auto">
                {/* ── Movie Info Bar ── */}
                <div className="flex flex-col sm:flex-row gap-5 mb-10">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-28 h-40 object-cover rounded-xl border border-white/[0.06] flex-shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                        <Link to="/" className="text-xs text-gray-500 hover:text-amber-400 transition-colors mb-2">
                            ← Back to Movies
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold">{movie.title}</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                            <span>{movie.genre}</span>
                            <span className="text-white/10">|</span>
                            <span>{movie.duration}</span>
                            <span className="text-white/10">|</span>
                            <span className="text-amber-400">★ {movie.rating}</span>
                        </div>
                    </div>
                </div>

                {/* ── Step 1: Showtime ── */}
                <div className="mb-10">
                    <h2 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
                        1 · Select Showtime
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {movie.showtimes.map((time) => (
                            <button
                                key={time}
                                className={`showtime-pill ${selectedShowtime === time ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedShowtime(time);
                                    setSelectedSeats(new Set());
                                }}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Step 2: Seats ── */}
                {selectedShowtime && (
                    <div className="mb-10">
                        <h2 className="text-sm font-semibold text-gray-400 mb-6 tracking-wide uppercase">
                            2 · Choose Your Seats
                        </h2>

                        {/* Screen */}
                        <div className="screen-curve" />

                        {/* Seat Grid */}
                        <div className="seat-grid">
                            {ROWS.map((row) => (
                                <div key={row} className="seat-row">
                                    <span className="seat-row-label">{row}</span>
                                    {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                                        const seatNum = i + 1;
                                        const seatId = `${row}${seatNum}`;
                                        const isTaken = takenSeats.has(seatId);
                                        const isSelected = selectedSeats.has(seatId);
                                        return (
                                            <span key={seatId}>
                                                {(seatNum === AISLE_AFTER + 1 || seatNum === SEATS_PER_ROW - AISLE_AFTER + 1) && (
                                                    <span className="seat-gap" />
                                                )}
                                                <button
                                                    className={`seat ${isTaken ? "seat-taken" : ""} ${isSelected ? "seat-selected" : ""}`}
                                                    onClick={() => toggleSeat(seatId)}
                                                    disabled={isTaken}
                                                    title={isTaken ? "Taken" : `${seatId} — ₹${getSeatPrice(row)} (${getSeatTier(row)})`}
                                                >
                                                    {seatNum}
                                                </button>
                                            </span>
                                        );
                                    })}
                                    <span className="seat-row-label">{row}</span>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="seat-legend">
                            <div className="legend-item">
                                <div className="legend-dot available" />
                                Available
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot selected" />
                                Selected
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot taken" />
                                Taken
                            </div>
                        </div>

                        {/* Price Tiers */}
                        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                            <span>Front (A-B): ₹120</span>
                            <span className="text-amber-400/70">Premium (C-F): ₹200</span>
                            <span>Back (G-H): ₹150</span>
                        </div>
                    </div>
                )}

                {/* ── Booking Summary ── */}
                {selectedSeats.size > 0 && (
                    <div className="booking-summary max-w-md mx-auto">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                            Booking Summary
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Movie</span>
                                <span className="text-white font-medium">{movie.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Showtime</span>
                                <span className="text-white font-medium">{selectedShowtime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Seats ({selectedSeats.size})</span>
                                <span className="text-white font-medium">
                                    {Array.from(selectedSeats).sort().join(", ")}
                                </span>
                            </div>
                            <div className="border-t border-white/[0.06] pt-2 mt-2 flex justify-between">
                                <span className="text-gray-400 font-medium">Total</span>
                                <span className="text-amber-400 font-bold text-lg">₹{totalPrice}</span>
                            </div>
                        </div>
                        <button className="w-full mt-5 py-2.5 rounded-lg bg-amber-500 text-gray-950 font-semibold text-sm hover:bg-amber-400 transition-colors duration-200">
                            Proceed to Pay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
