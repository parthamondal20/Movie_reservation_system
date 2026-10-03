import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { movies, type Movie } from "../data/movies";

const steps = [
  {
    num: "01",
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
      </svg>
    ),
    title: "Select Your Movie",
    desc: "Browse current blockbusters, premiere shows, and upcoming releases with ratings and trailers.",
  },
  {
    num: "02",
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Pick Perfect Seats",
    desc: "Interactive 3D screen layout lets you choose exact seats with live pricing and seat views.",
  },
  {
    num: "03",
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Instant E-Ticket",
    desc: "Seamless one-click checkout. Recieve instant digital QR tickets straight to your phone.",
  },
];

const features = [
  {
    title: "IMAX® 4K Laser & Atmos",
    desc: "Immerse in multi-dimensional soundscapes and ultra-vivid 4K projection.",
    icon: "🎬",
    badge: "Next-Gen Audio/Visual",
  },
  {
    title: "Real-Time Seat View",
    desc: "No surprises. View the exact angle from your seat before confirming your booking.",
    icon: "💺",
    badge: "Interactive Map",
  },
  {
    title: "Gourmet Snack Pre-orders",
    desc: "Order hot popcorn, craft beverages & snacks straight to your seat number.",
    icon: "🍿",
    badge: "Skip the Line",
  },
  {
    title: "Zero Cancellation Fees",
    desc: "Flexibility at its finest. Cancel or reschedule tickets up to 1 hour before showtime.",
    icon: "⚡",
    badge: "100% Refundable",
  },
];

const testimonials = [
  {
    name: "Alexander R.",
    role: "Movie Enthusiast",
    text: "CineBook is by far the slickest ticketing app I've used. Seat selection is lightning fast!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    name: "Sophia L.",
    role: "Verified Cinephile",
    text: "The IMAX filtering and pre-order concessions saved us so much time on opening night.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    name: "Marcus V.",
    role: "Weekend Viewer",
    text: "Super smooth UI, instant QR passes, and zero fuss. 10/10 experience every weekend!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeSlide, setActiveSlide] = useState(0);

  // Top 3 featured spotlight movies
  const spotlightMovies = movies.slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Spotlight rotation effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % spotlightMovies.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [spotlightMovies.length]);

  const genres = ["All", ...Array.from(new Set(movies.map((m) => m.genre)))];

  const filteredMovies = movies.filter((movie: Movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (isLoading) return <Loader />;

  const heroMovie = spotlightMovies[activeSlide];

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-amber-500 selection:text-gray-950 overflow-hidden">

      {/* ───── Hero Spotlight Banner ───── */}
      <section className="relative min-h-[90vh] flex flex-col justify-end pb-16 px-5 sm:px-8 lg:px-12 pt-24">
        {/* Background Backdrop Image & Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroMovie.poster}
            alt={heroMovie.title}
            className="w-full h-full object-cover object-center scale-105 filter blur-sm brightness-[0.35] transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent" />

          {/* Glowing ambient radial lights */}
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-amber-400/30 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Featured Release • IMAX 3D
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
              {heroMovie.title.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                {heroMovie.title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                ★ {heroMovie.rating}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.08] text-gray-300 font-medium">
                {heroMovie.genre}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {heroMovie.duration}
              </span>
              <span className="text-gray-400">• {heroMovie.release_date}</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal line-clamp-2">
              {heroMovie.description}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                to={`/movies/${heroMovie.id}`}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-base shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Book Tickets Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/movies"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-base backdrop-blur-md transition-all duration-200"
              >
                Explore Cinema List
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Cards Rotator */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Now Trending (0{activeSlide + 1}/0{spotlightMovies.length})
                </span>
                <div className="flex gap-1.5">
                  {spotlightMovies.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === index ? "w-6 bg-amber-400" : "w-2 bg-white/20"
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Spotlight Poster Preview Card */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
                <img
                  src={heroMovie.poster}
                  alt={heroMovie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-xs font-bold text-amber-400">{heroMovie.genre}</span>
                  <h4 className="text-lg font-bold text-white leading-tight">{heroMovie.title}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stats Counter Bar ───── */}
      <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-5">
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl">
          <div className="space-y-1 border-r border-white/5 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">12+</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Blockbusters Showing</div>
          </div>
          <div className="space-y-1 border-r border-white/5 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-white">100K+</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tickets Booked</div>
          </div>
          <div className="space-y-1 border-r border-white/5 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">4.9 ★</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User Satisfaction</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">4K Laser</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">IMAX® & Dolby Sound</div>
          </div>
        </div>
      </section>

      {/* ───── Now Showing & Interactive Search Section ───── */}
      <section className="py-24 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Curated Movies
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Now Showing in <span className="text-amber-400">Theaters</span>
            </h2>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search movie title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-900/80 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/60 transition-colors backdrop-blur-md"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedGenre === genre
                  ? "bg-amber-400 text-gray-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]"
                  : "bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-800/80 border border-white/5"
                }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border border-white/5">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-lg font-semibold text-white">No movies match your criteria</h3>
            <p className="text-sm text-gray-500 mt-1">Try searching for a different title or resetting genre filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="mt-5 px-5 py-2 rounded-lg bg-amber-400 text-gray-950 text-xs font-bold hover:bg-amber-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden glass-card glass-card-hover border border-white/5 hover:border-amber-400/40"
              >
                {/* Poster Box */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/30 text-xs font-bold text-amber-400 shadow-md">
                    <span>★</span>
                    <span>{movie.rating}</span>
                  </div>

                  {/* Format Pill */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-extrabold text-gray-200 border border-white/10 tracking-widest uppercase">
                    IMAX
                  </div>

                  {/* Quick Action Hover Button */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-1.5">
                      <span>Book Seats</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                      <span className="font-medium text-amber-400/80">{movie.genre}</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gray-900 border border-white/10 text-gray-200 font-semibold text-sm hover:text-amber-400 hover:border-amber-400/40 transition-all shadow-lg"
          >
            <span>Explore All Movies & Schedule</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ───── Cinema Technology & Premium Features ───── */}
      <section className="py-20 px-5 sm:px-8 border-t border-b border-white/5 bg-gray-900/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Unmatched Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why Book With <span className="text-amber-400">CineBook?</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Engineered for true film lovers. Experience cinema comfort and tech like never before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-white/5 hover:border-amber-400/30 transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="py-24 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            3 Easy Steps
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            How It <span className="text-amber-400">Works</span>
          </h2>
          <p className="text-gray-400 text-sm">
            From picking a movie to taking your seat, booking takes less than 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => (
            <div
              key={item.num}
              className="glass-card p-8 rounded-2xl border border-white/5 relative group hover:border-amber-400/30 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
                  {item.icon}
                </div>
                <span className="text-3xl font-black text-amber-400/30 group-hover:text-amber-400 transition-colors">
                  {item.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Social Proof / User Reviews ───── */}
      <section className="py-20 px-5 sm:px-8 bg-gray-900/20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Loved by <span className="text-amber-400">Thousands</span> of Viewers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-sm text-gray-300 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <span className="text-xs text-gray-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Call To Action (CTA) ───── */}
      <section className="py-24 px-5 sm:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass-card border border-amber-400/30 p-10 sm:p-16 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)]">
          {/* Radial ambient light */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
              Exclusive Member Perks
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready For Your Next <br />
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Movie Night?
              </span>
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Create a free account to unlock $0 convenience fees on Tuesdays, instant QR boarding passes, and early premiere tickets.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-base shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105"
              >
                Create Account — It's Free
              </Link>
              <Link
                to="/movies"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/10 transition-colors"
              >
                Browse Now Showing
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}