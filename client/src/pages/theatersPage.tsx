import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { movies } from "../data/movies";

/* ──────────────────────────────────────────────
   Dummy theater & show data
   ────────────────────────────────────────────── */

interface Show {
    id: number;
    time: string;
    format: string;     // "2D" | "3D" | "IMAX"
    language: string;
    price: number;
    seatsAvailable: number;
    totalSeats: number;
}

interface Theater {
    id: number;
    name: string;
    location: string;
    distance: string;
    facilities: string[];
    shows: Show[];
}

const DUMMY_THEATERS: Theater[] = [
    {
        id: 1,
        name: "CineMax Multiplex",
        location: "Phoenix Mall, Sector 21, Gurugram",
        distance: "2.3 km",
        facilities: ["Dolby Atmos", "Recliner", "F&B", "Parking"],
        shows: [
            { id: 101, time: "09:30 AM", format: "2D", language: "English", price: 180, seatsAvailable: 42, totalSeats: 120 },
            { id: 102, time: "12:45 PM", format: "IMAX", language: "English", price: 350, seatsAvailable: 18, totalSeats: 80 },
            { id: 103, time: "04:00 PM", format: "2D", language: "Hindi", price: 180, seatsAvailable: 65, totalSeats: 120 },
            { id: 104, time: "07:15 PM", format: "3D", language: "English", price: 280, seatsAvailable: 5, totalSeats: 100 },
            { id: 105, time: "10:30 PM", format: "IMAX", language: "English", price: 350, seatsAvailable: 30, totalSeats: 80 },
        ],
    },
    {
        id: 2,
        name: "PVR Icons",
        location: "DLF Cyber Hub, Phase 2, Gurugram",
        distance: "4.1 km",
        facilities: ["4DX", "Dolby Atmos", "Luxury Lounge", "Parking"],
        shows: [
            { id: 201, time: "10:00 AM", format: "2D", language: "Hindi", price: 200, seatsAvailable: 55, totalSeats: 150 },
            { id: 202, time: "01:15 PM", format: "4DX", language: "English", price: 450, seatsAvailable: 12, totalSeats: 60 },
            { id: 203, time: "04:30 PM", format: "2D", language: "English", price: 200, seatsAvailable: 0, totalSeats: 150 },
            { id: 204, time: "08:00 PM", format: "3D", language: "English", price: 300, seatsAvailable: 28, totalSeats: 100 },
        ],
    },
    {
        id: 3,
        name: "INOX Leisure",
        location: "South City Mall, MG Road, Gurugram",
        distance: "5.8 km",
        facilities: ["Dolby 7.1", "F&B", "Wheelchair Access"],
        shows: [
            { id: 301, time: "11:00 AM", format: "2D", language: "English", price: 150, seatsAvailable: 80, totalSeats: 200 },
            { id: 302, time: "02:30 PM", format: "2D", language: "Hindi", price: 150, seatsAvailable: 35, totalSeats: 200 },
            { id: 303, time: "06:00 PM", format: "3D", language: "English", price: 250, seatsAvailable: 10, totalSeats: 100 },
            { id: 304, time: "09:30 PM", format: "2D", language: "English", price: 150, seatsAvailable: 90, totalSeats: 200 },
        ],
    },
    {
        id: 4,
        name: "Cinepolis",
        location: "Ambience Mall, NH-8, Gurugram",
        distance: "7.2 km",
        facilities: ["IMAX", "Dolby Atmos", "Recliner", "VIP Lounge", "Parking"],
        shows: [
            { id: 401, time: "09:00 AM", format: "IMAX", language: "English", price: 380, seatsAvailable: 22, totalSeats: 80 },
            { id: 402, time: "12:30 PM", format: "2D", language: "Hindi", price: 220, seatsAvailable: 60, totalSeats: 140 },
            { id: 403, time: "03:45 PM", format: "2D", language: "English", price: 220, seatsAvailable: 45, totalSeats: 140 },
            { id: 404, time: "07:00 PM", format: "IMAX", language: "English", price: 380, seatsAvailable: 3, totalSeats: 80 },
            { id: 405, time: "10:15 PM", format: "3D", language: "English", price: 300, seatsAvailable: 50, totalSeats: 100 },
        ],
    },
    {
        id: 5,
        name: "Rajhans Cineplex",
        location: "Sohna Road, near IFFCO Chowk, Gurugram",
        distance: "3.5 km",
        facilities: ["Dolby 7.1", "F&B", "Parking"],
        shows: [
            { id: 501, time: "10:30 AM", format: "2D", language: "Hindi", price: 120, seatsAvailable: 100, totalSeats: 180 },
            { id: 502, time: "01:45 PM", format: "2D", language: "English", price: 120, seatsAvailable: 70, totalSeats: 180 },
            { id: 503, time: "05:00 PM", format: "2D", language: "Hindi", price: 120, seatsAvailable: 40, totalSeats: 180 },
            { id: 504, time: "08:30 PM", format: "2D", language: "English", price: 120, seatsAvailable: 15, totalSeats: 180 },
        ],
    },
];

/* ── Generate dates for the next 7 days ── */
function generateDates(): { label: string; dateStr: string; day: string }[] {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const day = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateNum = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "short" });
        dates.push({
            label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${day}`,
            dateStr: `${dateNum} ${month}`,
            day,
        });
    }
    return dates;
}

/* ── Availability badge helpers ── */
function getAvailabilityColor(available: number, total: number): string {
    if (available === 0) return "text-red-400 bg-red-500/10 border-red-500/20";
    const ratio = available / total;
    if (ratio < 0.1) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
}

function getAvailabilityText(available: number): string {
    if (available === 0) return "Sold Out";
    if (available <= 10) return `${available} left`;
    return "Available";
}

/* ── Facility icon mapping ── */
function facilityIcon(name: string): string {
    const map: Record<string, string> = {
        "Dolby Atmos": "🔊",
        "Dolby 7.1": "🔊",
        "IMAX": "🎬",
        "4DX": "🌀",
        "Recliner": "🛋️",
        "F&B": "🍿",
        "Parking": "🅿️",
        "Luxury Lounge": "✨",
        "VIP Lounge": "👑",
        "Wheelchair Access": "♿",
    };
    return map[name] || "•";
}

/* ──────────────────────────────────────────────
   TheatersPage Component
   ────────────────────────────────────────────── */

export default function TheatersPage() {
    const { movie_id } = useParams<{ movie_id: string }>();
    const movie = movies.find((m) => m.id === Number(movie_id));
    const dates = useMemo(() => generateDates(), []);

    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedFormat, setSelectedFormat] = useState<string>("All");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("All");

    /* ── Filters ── */
    const formats = ["All", "2D", "3D", "IMAX", "4DX"];
    const languages = ["All", "English", "Hindi"];

    const filteredTheaters = useMemo(() => {
        return DUMMY_THEATERS.map((theater) => {
            const filteredShows = theater.shows.filter((show) => {
                const matchFormat = selectedFormat === "All" || show.format === selectedFormat;
                const matchLang = selectedLanguage === "All" || show.language === selectedLanguage;
                return matchFormat && matchLang;
            });
            return { ...theater, shows: filteredShows };
        }).filter((theater) => theater.shows.length > 0);
    }, [selectedFormat, selectedLanguage]);

    /* ── Not Found State ── */
    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center pt-16 px-5 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-900/60 border border-white/[0.06] flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Movie not found</h2>
                <p className="text-sm text-gray-500 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
                <Link to="/movies" className="px-5 py-2.5 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all duration-200">
                    ← Browse Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* ══════════════════════════════════════════════
                MOVIE HEADER — Compact info bar
               ══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden border-b border-white/[0.04]">
                {/* Blurred BG */}
                <div className="absolute inset-0">
                    <img src={movie.poster} alt="" className="w-full h-full object-cover scale-110 blur-3xl opacity-15" />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 to-gray-950" />
                </div>

                <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                        <Link to="/movies" className="hover:text-amber-400 transition-colors">Movies</Link>
                        <span className="text-gray-700">›</span>
                        <Link to={`/movies/${movie.id}`} className="hover:text-amber-400 transition-colors truncate max-w-[140px]">{movie.title}</Link>
                        <span className="text-gray-700">›</span>
                        <span className="text-gray-400">Theaters</span>
                    </nav>

                    <div className="flex items-start gap-5">
                        {/* Poster thumbnail */}
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-20 h-28 sm:w-24 sm:h-34 object-cover rounded-xl border border-white/[0.08] shadow-xl shadow-black/40 flex-shrink-0 hidden sm:block"
                        />

                        <div className="flex flex-col justify-center min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight truncate">
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2.5 mt-3">
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/25 uppercase tracking-wider">
                                    {movie.genre}
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-300 bg-white/[0.06] border border-white/[0.06]">
                                    🕐 {movie.duration}
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-300 bg-white/[0.06] border border-white/[0.06]">
                                    ★ {movie.rating}/10
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                DATE SELECTOR — Horizontal scroll
               ══════════════════════════════════════════════ */}
            <section className="sticky top-16 z-30 bg-gray-950/95 backdrop-blur-xl border-b border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {dates.map((date, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(index)}
                                className={`
                                    flex flex-col items-center px-4 py-2.5 rounded-xl text-center min-w-[72px]
                                    transition-all duration-200 flex-shrink-0 cursor-pointer
                                    ${selectedDate === index
                                        ? "bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/25"
                                        : "bg-gray-900/50 text-gray-400 border border-white/[0.06] hover:bg-gray-800/60 hover:text-white"
                                    }
                                `}
                            >
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedDate === index ? "text-gray-950/70" : "text-gray-500"}`}>
                                    {date.label}
                                </span>
                                <span className="text-sm font-bold mt-0.5">{date.dateStr}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                FILTERS — Format & Language
               ══════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-2">
                <div className="flex flex-wrap items-center gap-6">
                    {/* Format filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Format:</span>
                        <div className="flex gap-1.5">
                            {formats.map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setSelectedFormat(fmt)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer
                                        ${selectedFormat === fmt
                                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                            : "bg-gray-900/40 text-gray-400 border border-white/[0.06] hover:bg-gray-800/50 hover:text-gray-300"
                                        }
                                    `}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Language:</span>
                        <div className="flex gap-1.5">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer
                                        ${selectedLanguage === lang
                                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                            : "bg-gray-900/40 text-gray-400 border border-white/[0.06] hover:bg-gray-800/50 hover:text-gray-300"
                                        }
                                    `}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                THEATER LISTING
               ══════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8 space-y-5">
                {filteredTheaters.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-900/60 border border-white/[0.06] flex items-center justify-center mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No shows found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your format or language filters.</p>
                    </div>
                ) : (
                    filteredTheaters.map((theater) => (
                        <div
                            key={theater.id}
                            className="group rounded-2xl bg-gray-900/40 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
                        >
                            {/* Theater Header */}
                            <div className="px-5 sm:px-6 pt-5 pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2.5">
                                            {/* Theater icon */}
                                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5 text-amber-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m12-3.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5m1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-bold text-white truncate">{theater.name}</h3>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{theater.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Distance + Facilities */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            {theater.distance}
                                        </div>
                                    </div>
                                </div>

                                {/* Facility tags */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {theater.facilities.map((fac) => (
                                        <span
                                            key={fac}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-400 bg-white/[0.04] border border-white/[0.06]"
                                        >
                                            <span className="text-[10px]">{facilityIcon(fac)}</span>
                                            {fac}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mx-5 sm:mx-6 border-t border-white/[0.04]" />

                            {/* Show Times Grid */}
                            <div className="px-5 sm:px-6 py-4">
                                <div className="flex flex-wrap gap-2.5">
                                    {theater.shows.map((show) => {
                                        const isSoldOut = show.seatsAvailable === 0;
                                        return (
                                            <Link
                                                key={show.id}
                                                to={isSoldOut ? "#" : `/movies/${movie.id}/shows`}
                                                onClick={(e) => isSoldOut && e.preventDefault()}
                                                className={`
                                                    relative flex flex-col items-center px-4 py-3 rounded-xl border transition-all duration-200 min-w-[100px]
                                                    ${isSoldOut
                                                        ? "bg-gray-900/30 border-white/[0.04] cursor-not-allowed opacity-50"
                                                        : "bg-gray-800/30 border-white/[0.06] hover:border-amber-500/30 hover:bg-amber-500/5 cursor-pointer group/show"
                                                    }
                                                `}
                                            >
                                                {/* Time */}
                                                <span className={`text-sm font-bold ${isSoldOut ? "text-gray-500" : "text-white group-hover/show:text-amber-400"} transition-colors`}>
                                                    {show.time}
                                                </span>

                                                {/* Format badge */}
                                                <span className={`
                                                    mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                                    ${show.format === "IMAX"
                                                        ? "text-blue-400 bg-blue-500/10"
                                                        : show.format === "3D"
                                                            ? "text-purple-400 bg-purple-500/10"
                                                            : show.format === "4DX"
                                                                ? "text-pink-400 bg-pink-500/10"
                                                                : "text-gray-400 bg-gray-500/10"
                                                    }
                                                `}>
                                                    {show.format}
                                                </span>

                                                {/* Language */}
                                                <span className="mt-1 text-[10px] text-gray-500">{show.language}</span>

                                                {/* Price */}
                                                <span className="mt-1.5 text-xs font-semibold text-gray-300">₹{show.price}</span>

                                                {/* Availability indicator */}
                                                <span className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getAvailabilityColor(show.seatsAvailable, show.totalSeats)}`}>
                                                    {getAvailabilityText(show.seatsAvailable)}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* ══════════════════════════════════════════════
                STICKY MOBILE BOTTOM BAR
               ══════════════════════════════════════════════ */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-md border-t border-white/[0.06] p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{movie.title}</p>
                        <p className="text-xs text-gray-500">{movie.genre} · {movie.duration}</p>
                    </div>
                    <Link
                        to={`/movies/${movie.id}`}
                        className="flex-shrink-0 px-5 py-2 rounded-xl bg-white/[0.06] border border-white/[0.06] text-gray-300 text-xs font-medium hover:bg-white/[0.1] transition-all"
                    >
                        Movie Details
                    </Link>
                </div>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="sm:hidden h-20" />
        </div>
    );
}
