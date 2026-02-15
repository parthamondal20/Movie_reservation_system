import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { movies } from "../data/movies";

const featuredMovies = movies;

const steps = [
  {
    num: "01",
    title: "Pick a Movie",
    desc: "Browse the latest releases and timeless classics.",
  },
  {
    num: "02",
    title: "Choose Your Seats",
    desc: "Select your showtime, cinema, and the perfect seats.",
  },
  {
    num: "03",
    title: "Pay & Enjoy",
    desc: "Secure checkout and you're all set for the show.",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ───── Hero ───── */}
      <section className="flex flex-col items-center justify-center text-center min-h-[85vh] px-5 pt-20">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Your Cinema,{" "}
          <span className="text-amber-400">Simplified</span>
        </h1>
        <p className="mt-5 text-lg text-gray-400 max-w-md leading-relaxed">
          Browse movies, pick your seats, and book tickets — all in seconds.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            to="/movies"
            className="px-7 py-3 rounded-lg bg-amber-500 text-gray-950 font-semibold text-sm hover:bg-amber-400 transition-colors duration-200"
          >
            Browse Movies
          </Link>
          <Link
            to="/showtimes"
            className="px-7 py-3 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            Showtimes
          </Link>
        </div>
      </section>

      {/* ───── Now Showing ───── */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-bold">Now Showing</h2>
            <Link
              to="/movies"
              className="text-sm text-gray-500 hover:text-amber-400 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="group rounded-xl overflow-hidden bg-gray-900/50 border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  {/* Rating */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-xs font-medium text-amber-400">
                    ★ {movie.rating}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{movie.genre}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="py-20 px-5 sm:px-8 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-xl bg-gray-900/40 border border-white/[0.04]"
              >
                <span className="text-xs font-semibold text-amber-400/70 tracking-widest">
                  {item.num}
                </span>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Ready for your next{" "}
            <span className="text-amber-400">movie night?</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Sign up free and never miss a show.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 px-8 py-3 rounded-lg bg-amber-500 text-gray-950 font-semibold text-sm hover:bg-amber-400 transition-colors duration-200"
          >
            Get Started — Free
          </Link>
        </div>
      </section>
    </div>
  );
}