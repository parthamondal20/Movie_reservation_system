import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "../services/movies";
import Loader from "../components/Loader";
interface Movie {
    id: number,
    title: string;
    description: string;
    release_date: string;
    duration: string;
    genre: string;
    rating: number;
    poster: string;
}
export default function Movies() {
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [lastId, setLastId] = useState<number>(-1);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        fetchMovies();
    }, [])
    const limit: number = 10;
    const fetchMovies = async () => {
        try {
            setLoading(true);
            const movies = await getMovies({ lastId, limit });
            console.log(movies);
            setMovies(movies);
            const len = movies.length;
            setLastId(movies[len - 1].id);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const genres = ["All", "Sci-fi", "Comedy", "Drama", "Horror", "Romance"];
    const filteredMovies = useMemo(() => {
        return movies.filter((movie) => {
            const matchesSearch =
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.description.toLowerCase().includes(search.toLowerCase());
            const matchesGenre =
                selectedGenre === "All" || movie.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        });
    }, [search, selectedGenre, movies]);
    if (loading) {
        return <Loader />
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-5 sm:px-8">
            <div className="max-w-6xl mx-auto">
                {/* ── Header ── */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        All <span className="text-amber-400">Movies</span>
                    </h1>
                    <p className="mt-2 text-gray-500 text-sm">
                        Discover the latest blockbusters and timeless classics.
                    </p>
                </div>

                {/* ── Search & Filter Bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search movies by title or description…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/60 border border-white/[0.06] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Genre Filter */}
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        {genres.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all duration-200 cursor-pointer ${selectedGenre === genre
                                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                    : "bg-gray-900/40 text-gray-400 border-white/[0.06] hover:text-white hover:border-white/[0.12]"
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Results Count ── */}
                <div className="mb-5 text-xs text-gray-500">
                    {filteredMovies.length}{" "}
                    {filteredMovies.length === 1 ? "movie" : "movies"} found
                    {search && (
                        <span>
                            {" "}
                            for "<span className="text-gray-300">{search}</span>"
                        </span>
                    )}
                </div>

                {/* ── Movie Grid ── */}
                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredMovies.map((movie) => (
                            <Link
                                key={movie.id}
                                to={`/movies/${movie.id}`}
                                className="group rounded-xl overflow-hidden bg-gray-900/50 border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/[0.03]"
                            >
                                {/* Poster */}
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {/* Rating badge */}
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-xs font-medium text-amber-400">
                                        ★ {movie.rating}
                                    </div>
                                    {/* Duration badge */}
                                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        🕐 {movie.duration}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3.5">
                                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors duration-200">
                                        {movie.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                                            {movie.genre}
                                        </span>
                                        <span className="text-[11px] text-gray-600">
                                            {new Date(movie.release_date).toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                                        {movie.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-900/60 border border-white/[0.06] flex items-center justify-center mb-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                className="w-7 h-7 text-gray-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-300">
                            No movies found
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Try a different search term or filter.
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedGenre("All");
                            }}
                            className="mt-5 px-5 py-2 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all duration-200 cursor-pointer"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
