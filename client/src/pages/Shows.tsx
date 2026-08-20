import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../services/movies";
import { getShowsByMovieId } from "../services/shows";
import Loader from "../components/Loader";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface Show {
    id: number;
    start_time: string;
    end_time: string;
    screen_number: string;
}

interface Theater {
    id: number;
    name: string;
    city: string;
    address: string;
    screens: {
        screen_number: string;
        shows: Show[];
    }[];
}

/* ──────────────────────────────────────────────
   City list
   ────────────────────────────────────────────── */

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"];

/* ──────────────────────────────────────────────
   Dummy data (will be replaced by API later)
   ────────────────────────────────────────────── */



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

function generateDates(): { label: string; dateStr: string; fullDate: string }[] {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const day = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateNum = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "short" });
        dates.push({
            label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : day,
            dateStr: `${dateNum} ${month}`,
            fullDate: d.toISOString().split("T")[0],
        });
    }
    return dates;
}

function getScreenType(screenNumber: string): { label: string; color: string } {
    const lower = screenNumber.toLowerCase();
    if (lower.includes("imax")) return { label: "IMAX", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (lower.includes("gold") || lower.includes("luxe")) return { label: "GOLD", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
    if (lower.includes("4dx")) return { label: "4DX", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" };
    return { label: "2D", color: "text-gray-400 bg-gray-500/10 border-gray-500/20" };
}

/* ──────────────────────────────────────────────
   Shows Page Component
   ────────────────────────────────────────────── */

export default function Shows() {
    const { movie_id } = useParams<{ movie_id: string }>();
    const dates = useMemo(() => generateDates(), []);

    const [selectedCity, setSelectedCity] = useState("Mumbai");
    const [selectedDate, setSelectedDate] = useState(0);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

    /* ── Fetch movie details ── */
    const {
        data: movie,
        isLoading: movieLoading,
        isError: movieError,
    } = useQuery({
        queryKey: ["movie", movie_id],
        queryFn: () => getMovieById(Number(movie_id)),
        enabled: !!movie_id,
    });

    /* ── Fetch shows by movie ID and location ── */
    const { data: shows, isLoading } = useQuery({
        queryKey: ["shows", movie_id, selectedCity],
        queryFn: () => getShowsByMovieId(Number(movie_id), selectedCity),
        enabled: !!movie_id && !!selectedCity,
    });

    /* ── Group shows by theater and screen ── */
    const groupedTheaters = useMemo(() => {
        if (!shows) return [];

        console.log(shows);
        const selectedDateStr = dates[selectedDate]?.fullDate;
        const map: Record<number, any> = {};

        shows.forEach((s: any) => {
            // Check if show date matches selected date
            const showDate = new Date(s.start_time).toISOString().split("T")[0];
            // if (showDate !== selectedDateStr) return;

            const theaterId = s.theater_id;
            if (!map[theaterId]) {
                map[theaterId] = {
                    id: theaterId,
                    name: s.theater_name,
                    city: s.city,
                    address: s.address,
                    screens: [],
                };
            }

            const theater = map[theaterId];
            let screen = theater.screens.find((sc: any) => sc.screen_number === s.screen_number);
            if (!screen) {
                screen = {
                    screen_number: s.screen_number,
                    shows: [],
                };
                theater.screens.push(screen);
            }

            screen.shows.push({
                id: s.id,
                start_time: s.start_time,
                end_time: s.end_time,
                screen_number: s.screen_number,
            });
        });

        return Object.values(map);
    }, [shows, selectedDate, dates]);

    /* ── Loading ── */
    if (movieLoading || isLoading) return <Loader />;

    /* ── Not Found ── */
    if (movieError || !movie) {
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
                MOVIE HEADER — Compact info bar with city selector
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
                        <span className="text-gray-400">Shows</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                        {/* Movie info */}
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

                        {/* ── City Selector ── */}
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900/60 border border-white/[0.08] hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="text-sm font-medium text-white">{selectedCity}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${cityDropdownOpen ? "rotate-180" : ""}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {cityDropdownOpen && (
                                <>
                                    {/* Backdrop to close on click outside */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setCityDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-gray-900 border border-white/[0.08] shadow-2xl shadow-black/60 z-50 overflow-hidden">
                                        <div className="py-2 max-h-64 overflow-y-auto">
                                            {CITIES.map((city) => (
                                                <button
                                                    key={city}
                                                    onClick={() => {
                                                        setSelectedCity(city);
                                                        setCityDropdownOpen(false);
                                                    }}
                                                    className={`
                                                        w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all duration-150 cursor-pointer
                                                        ${selectedCity === city
                                                            ? "text-amber-400 bg-amber-500/10"
                                                            : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                                                        }
                                                    `}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 flex-shrink-0 ${selectedCity === city ? "text-amber-400" : "text-gray-600"}`}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                    </svg>
                                                    <span className="font-medium">{city}</span>
                                                    {selectedCity === city && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-auto text-amber-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
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
                THEATER LISTING — Grouped by theater, shows per screen
               ══════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8 space-y-5">
                {groupedTheaters.length === 0 ? (
                    /* ── Empty State ── */
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-900/60 border border-white/[0.06] flex items-center justify-center mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No shows available</h3>
                        <p className="text-sm text-gray-500 mb-1">
                            No theaters in <span className="text-amber-400 font-medium">{selectedCity}</span> are screening this movie right now.
                        </p>
                        <p className="text-xs text-gray-600">Try selecting a different city or date.</p>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            {["Mumbai", "Delhi", "Bangalore"].filter(c => c !== selectedCity).map(city => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className="px-4 py-2 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all duration-200 cursor-pointer"
                                >
                                    Try {city}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    groupedTheaters.map((theater) => (
                        <div
                            key={theater.id}
                            className="group relative rounded-2xl bg-gray-900/30 border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden shadow-2xl backdrop-blur-md"
                        >
                            {/* Theater Header */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="min-w-0 flex items-start gap-4">
                                        {/* Theater icon */}
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m12-3.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5m1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                                                {theater.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                </svg>
                                                {theater.address}
                                            </p>

                                            {/* Amenities Badges */}
                                            <div className="flex flex-wrap gap-2 mt-3.5">
                                                <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-semibold text-gray-400 tracking-wider flex items-center gap-1">
                                                    🔊 Dolby Atmos
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-semibold text-gray-400 tracking-wider flex items-center gap-1">
                                                    🛋️ Recliner
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-semibold text-gray-400 tracking-wider flex items-center gap-1">
                                                    🍿 F&B
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Distance / City badge */}
                                    <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-gray-300 bg-white/[0.05] border border-white/[0.08] flex items-center gap-1.5 shadow-inner">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            {theater.city}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Screens & Shows */}
                            {theater.screens.map((screen) => {
                                const screenType = getScreenType(screen.screen_number);
                                return (
                                    <div key={screen.screen_number} className="border-t border-white/[0.04] bg-white/[0.01]">
                                        <div className="px-6 py-5">
                                            {/* Screen Type & Label */}
                                            <div className="flex items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase border ${screenType.color}`}>
                                                        {screenType.label}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-300 tracking-tight">
                                                        {screen.screen_number}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-gray-500 font-medium">
                                                    {screen.shows.length} {screen.shows.length === 1 ? 'Show' : 'Shows'}
                                                </span>
                                            </div>

                                            {/* Showtimes grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                                {screen.shows.map((show) => (
                                                    <Link
                                                        key={show.id}
                                                        to={`/movies/${movie.id}/shows/${show.id}/seats`}
                                                        className="
                                                            group/show relative flex flex-col items-center justify-center p-3.5 rounded-xl
                                                            bg-gray-900/40 border border-white/[0.05] hover:border-amber-500/50 hover:bg-amber-500
                                                            hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer
                                                        "
                                                    >
                                                        {/* Time */}
                                                        <span className="text-sm font-bold text-white group-hover/show:text-amber-400 transition-colors">
                                                            {formatTime(show.start_time)}
                                                        </span>

                                                        {/* End time */}
                                                        <span className="text-[10px] text-gray-500 mt-0.5">
                                                            ends {formatTime(show.end_time)}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                    <button
                        onClick={() => setCityDropdownOpen(true)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {selectedCity}
                    </button>
                </div>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="sm:hidden h-20" />
        </div>
    );
}
