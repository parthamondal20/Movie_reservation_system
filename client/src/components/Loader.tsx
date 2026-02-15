import "../styles/Loader.css"

interface LoaderProps {
    fullScreen?: boolean;
}

export default function Loader({ fullScreen = true }: LoaderProps) {
    const content = (
        <div className="loader-container">
            {/* Logo */}
            <div className="loader-logo">
                Cine<span>Book</span>
            </div>

            {/* Film reel spinner */}
            <div className="loader-reel">
                <div className="reel-ring"></div>
                <div className="reel-dot dot-1"></div>
                <div className="reel-dot dot-2"></div>
                <div className="reel-dot dot-3"></div>
                <div className="reel-dot dot-4"></div>
            </div>

            {/* Shimmer bar */}
            <div className="loader-bar">
                <div className="loader-bar-fill"></div>
            </div>
        </div>
    );

    if (fullScreen) {
        return <div className="loader-fullscreen">{content}</div>;
    }

    return <div className="loader-inline">{content}</div>;
}
