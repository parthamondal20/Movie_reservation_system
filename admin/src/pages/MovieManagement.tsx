import { useState } from "react";
import { addMovie } from "../services/movies";
interface Movie {
    id?: number;
    title: string;
    description: string;
    release_date: string;
    duration: string;
    genre: string;
    poster: string;
    rating: number;
}

const emptyMovie: Movie = {
    title: "",
    description: "",
    release_date: "",
    duration: "",
    genre: "",
    poster: "",
    rating: 0,
};

const sampleMovies: Movie[] = [
    {
        id: 1,
        title: "Interstellar Odyssey",
        description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        release_date: "2024-11-07",
        duration: "2h 49m",
        genre: "Sci-Fi",
        poster: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=600&fit=crop",
        rating: 8.9,
    },
    {
        id: 2,
        title: "The Last Heist",
        description:
            "A master thief plans one final daring robbery before retiring from crime.",
        release_date: "2025-03-21",
        duration: "2h 12m",
        genre: "Action",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        rating: 8.4,
    },
    {
        id: 3,
        title: "Midnight Whispers",
        description:
            "Strange occurrences in a small town lead a journalist to uncover dark secrets.",
        release_date: "2025-06-13",
        duration: "1h 58m",
        genre: "Horror",
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        rating: 7.8,
    },
];

const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
];

export default function MovieManagement() {
    const [movies, setMovies] = useState<Movie[]>(sampleMovies);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [form, setForm] = useState<Movie>(emptyMovie);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMovies = movies.filter(
        (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAddModal = () => {
        setEditingMovie(null);
        setForm(emptyMovie);
        setIsModalOpen(true);
    };

    const openEditModal = (movie: Movie) => {
        setEditingMovie(movie);
        setForm({
            title: movie.title,
            description: movie.description,
            release_date: movie.release_date,
            duration: movie.duration,
            genre: movie.genre,
            poster: movie.poster,
            rating: movie.rating,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMovie(null);
        setForm(emptyMovie);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newMovie = await addMovie(form);
            if (newMovie) {
                setMovies((prev) => [newMovie, ...prev]);
            }
        } catch (error) {
            console.error(error);
        }

        // closeModal();
    };

    const handleDelete = (id: number) => {
        setMovies((prev) => prev.filter((m) => m.id !== id));
        setDeleteConfirm(null);
    };



    const getRatingColor = (rating: number) => {
        if (rating >= 8) return "text-emerald-400";
        if (rating >= 6) return "text-amber-400";
        return "text-red-400";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-30 backdrop-blur-xl bg-gray-950/70 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            Movie Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {movies.length} movie{movies.length !== 1 && "s"} in catalog
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Movie
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <svg
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by title or genre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Movies Grid */}
                {filteredMovies.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800/50 mb-4">
                            <svg
                                className="w-8 h-8 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-400">
                            No movies found
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {searchQuery
                                ? "Try a different search term"
                                : "Click 'Add Movie' to get started"}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-[auto_1.5fr_2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <span className="w-12">Poster</span>
                            <span>Title</span>
                            <span>Description</span>
                            <span>Genre</span>
                            <span>Release Date</span>
                            <span>Duration</span>
                            <span>Rating</span>
                            <span>Actions</span>
                        </div>

                        {/* Movie Rows */}
                        {filteredMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className="group relative bg-gray-800/30 hover:bg-gray-800/60 border border-gray-800/50 hover:border-gray-700/50 rounded-2xl px-6 py-4 transition-all duration-200"
                            >
                                {/* Delete Confirmation Overlay */}
                                {deleteConfirm === movie.id && (
                                    <div className="absolute inset-0 z-10 bg-gray-900/95 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-4">
                                        <p className="text-sm text-gray-300">
                                            Delete "
                                            <span className="font-semibold text-white">
                                                {movie.title}
                                            </span>
                                            "?
                                        </p>
                                        <button
                                            onClick={() => handleDelete(movie.id!)}
                                            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {/* Desktop layout */}
                                <div className="hidden md:grid grid-cols-[auto_1.5fr_2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
                                        {movie.poster ? (
                                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-semibold text-white truncate">
                                        {movie.title}
                                    </div>
                                    <div className="text-sm text-gray-400 truncate">
                                        {movie.description}
                                    </div>
                                    <div>
                                        <span className="inline-block px-2.5 py-0.5 bg-violet-500/10 text-violet-400 text-xs font-medium rounded-full border border-violet-500/20">
                                            {movie.genre}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(movie.release_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {movie.duration}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg
                                            className={`w-4 h-4 ${getRatingColor(movie.rating)}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span
                                            className={`text-sm font-semibold ${getRatingColor(
                                                movie.rating
                                            )}`}
                                        >
                                            {movie.rating}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(movie)}
                                            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <svg
                                                className="w-4 h-4 text-gray-400 hover:text-violet-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(movie.id!)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <svg
                                                className="w-4 h-4 text-gray-400 hover:text-red-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile layout */}
                                <div className="md:hidden space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {movie.title}
                                            </h3>
                                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-violet-500/10 text-violet-400 text-xs font-medium rounded-full border border-violet-500/20">
                                                {movie.genre}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => openEditModal(movie)}
                                                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(movie.id!)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {movie.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>
                                            {new Date(movie.release_date).toLocaleDateString(
                                                "en-US",
                                                { year: "numeric", month: "short", day: "numeric" }
                                            )}
                                        </span>
                                        <span>·</span>
                                        <span>{movie.duration}</span>
                                        <span>·</span>
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className={`w-3.5 h-3.5 ${getRatingColor(
                                                    movie.rating
                                                )}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span
                                                className={`font-semibold ${getRatingColor(
                                                    movie.rating
                                                )}`}
                                            >
                                                {movie.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 animate-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-semibold text-white">
                                {editingMovie ? "Edit Movie" : "Add New Movie"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, title: e.target.value }))
                                    }
                                    placeholder="e.g. Interstellar Odyssey"
                                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, description: e.target.value }))
                                    }
                                    placeholder="Brief synopsis of the movie..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                                />
                            </div>

                            {/* Genre & Rating row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                        Genre
                                    </label>
                                    <select
                                        value={form.genre}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, genre: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select genre</option>
                                        {genres.map((g) => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                        Rating{" "}
                                        <span className="text-gray-600 font-normal">(0–10)</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        value={form.rating || ""}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                rating: parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        placeholder="8.5"
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Release Date & Duration row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                        Release Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.release_date}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, release_date: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={form.duration}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, duration: e.target.value }))
                                        }
                                        placeholder="e.g. 2h 05m"
                                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Poster URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Poster URL
                                </label>
                                <input
                                    type="url"
                                    value={form.poster}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, poster: e.target.value }))
                                    }
                                    placeholder="https://example.com/poster.jpg"
                                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                />
                                {form.poster && (
                                    <div className="mt-2 w-16 h-22 rounded-lg overflow-hidden border border-gray-700/50">
                                        <img src={form.poster} alt="Poster preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-violet-500/40 cursor-pointer"
                                >
                                    {editingMovie ? "Save Changes" : "Add Movie"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
