import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white text-center px-4">
            <h1 className="text-9xl font-extrabold text-amber-500 drop-shadow-lg">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Page Not Found</h2>
            <p className="text-gray-400 text-lg max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link
                to="/"
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/20"
            >
                Go Back Home
            </Link>

            <div className="absolute overflow-hidden -z-10 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[128px]"></div>
            </div>
        </div>
    );
}
