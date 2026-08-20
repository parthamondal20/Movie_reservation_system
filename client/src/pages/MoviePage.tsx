import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/movies";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";

interface Movie {
    id: number;
    title: string;
    description: string;
    release_date: string;
    duration: string;
    genre: string;
    rating: number;
    poster: string;
}

export default function MoviePage() {
    const { movie_id } = useParams();
    const {
        data: movie,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["movie", movie_id],
        queryFn: () => getMovieById(Number(movie_id)),
        enabled: !!movie_id
    })
    /* ── Loading State ── */
    if (isLoading) return <Loader />;

    /* ── Error / Not Found State ── */
    if (isError || !movie) {
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

    const releaseDate = new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* ══════════════════════════════════════════════
                HERO SECTION — Blurred backdrop + movie info
               ══════════════════════════════════════════════ */}
            <section className="relative overflow-hidden">
                {/* Blurred background poster */}
                <div className="absolute inset-0">
                    <img
                        src={movie.poster}
                        alt=""
                        className="w-full h-full object-cover scale-110 blur-2xl opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/80 to-gray-950" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/40 to-gray-950/90" />
                </div>

                <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-12 sm:pb-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
                        <Link to="/movies" className="hover:text-amber-400 transition-colors">Movies</Link>
                        <span className="text-gray-700">›</span>
                        <span className="text-gray-400 truncate max-w-[200px]">{movie.title}</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">
                        {/* Poster */}
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                            <div className="relative group">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-56 sm:w-64 h-auto aspect-[2/3] object-cover rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 group-hover:shadow-amber-500/10 transition-shadow duration-500"
                                />
                                {/* Rating overlay */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-sm font-semibold text-amber-400">
                                    ★ {movie.rating}
                                </div>
                            </div>
                        </div>

                        {/* Movie Details */}
                        <div className="flex flex-col justify-center text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                {movie.title}
                            </h1>

                            {/* Meta pills */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/25 uppercase tracking-wider">
                                    {movie.genre}
                                </span>
                                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.06] border border-white/[0.06]">
                                    🕐 {movie.duration}
                                </span>
                                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.06] border border-white/[0.06]">
                                    ★ {movie.rating}/10
                                </span>
                            </div>

                            {/* Release date */}
                            <p className="mt-4 text-sm text-gray-500">
                                <span className="text-gray-600">Release Date:</span>{" "}
                                <span className="text-gray-300">{releaseDate}</span>
                            </p>

                            {/* Description */}
                            <p className="mt-5 text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl">
                                {movie.description}
                            </p>

                            {/* Book Tickets Button (Desktop) */}
                            <div className="hidden sm:flex mt-8 gap-3">
                                <Link
                                    to={`/movies/${movie_id}/shows`}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 text-gray-950 text-sm font-bold hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                    </svg>
                                    Book Tickets
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                DETAILS SECTION — About, Cast & Crew
               ══════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column — About */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* About the Movie */}
                        <div>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-amber-400 rounded-full"></span>
                                About the Movie
                            </h2>
                            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                                {movie.description}
                            </p>
                        </div>

                        {/* Cast & Crew Placeholder */}
                        <div>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-amber-400 rounded-full"></span>
                                Cast & Crew
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="text-center">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-800/60 border border-white/[0.06] flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="w-7 h-7 text-gray-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Coming Soon</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Quick Info Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl bg-gray-900/50 border border-white/[0.06] p-6 space-y-5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                Quick Info
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Genre</span>
                                    <span className="text-sm text-white font-medium">{movie.genre}</span>
                                </div>
                                <div className="border-t border-white/[0.04]" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Duration</span>
                                    <span className="text-sm text-white font-medium">{movie.duration}</span>
                                </div>
                                <div className="border-t border-white/[0.04]" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Rating</span>
                                    <span className="text-sm text-amber-400 font-bold">★ {movie.rating}/10</span>
                                </div>
                                <div className="border-t border-white/[0.04]" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Release</span>
                                    <span className="text-sm text-white font-medium">{releaseDate}</span>
                                </div>
                            </div>

                            {/* Book Tickets CTA in sidebar */}
                            <Link
                                to={`/movies/${movie.id}/shows`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-gray-950 text-sm font-bold hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                </svg>
                                Book Tickets
                            </Link>
                        </div>
                    </div>
                </div>
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
                        to={`/movies/${movie.id}/shows`}
                        className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-amber-500 text-gray-950 text-sm font-bold hover:bg-amber-400 transition-all duration-200"
                    >
                        Book Tickets
                    </Link>
                </div>
            </div>

            {/* Spacer for mobile sticky bar */}
            <div className="sm:hidden h-20" />
        </div>
    );
}