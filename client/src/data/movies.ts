export interface Movie {
    id: number;
    title: string;
    genre: string;
    rating: number;
    duration: string;
    poster: string;
    showtimes: string[];
}

export const movies: Movie[] = [
    {
        id: 1,
        title: "Interstellar Odyssey",
        genre: "Sci-Fi · Adventure",
        rating: 8.9,
        duration: "2h 49m",
        poster:
            "https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=600&fit=crop",
        showtimes: ["10:30 AM", "1:45 PM", "5:00 PM", "8:30 PM", "11:00 PM"],
    },
    {
        id: 2,
        title: "The Last Heist",
        genre: "Action · Thriller",
        rating: 8.4,
        duration: "2h 12m",
        poster:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        showtimes: ["11:00 AM", "2:15 PM", "6:00 PM", "9:30 PM"],
    },
    {
        id: 3,
        title: "Midnight Whispers",
        genre: "Horror · Mystery",
        rating: 7.8,
        duration: "1h 58m",
        poster:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        showtimes: ["12:00 PM", "3:30 PM", "7:00 PM", "10:30 PM"],
    },
    {
        id: 4,
        title: "Love in Paris",
        genre: "Romance · Drama",
        rating: 8.1,
        duration: "2h 05m",
        poster:
            "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400&h=600&fit=crop",
        showtimes: ["10:00 AM", "1:00 PM", "4:30 PM", "7:45 PM"],
    },
];
