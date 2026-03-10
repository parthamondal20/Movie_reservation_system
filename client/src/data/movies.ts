export interface Movie {
    id: number;
    title: string;
    description: string;
    release_date: string;
    duration: string;
    genre: string;
    poster: string;
    rating: number;
    created_at: string;
    updated_at: string;
}

export const movies: Movie[] = [
    {
        id: 1,
        title: "Interstellar Odyssey",
        description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a dying Earth.",
        release_date: "2026-01-15",
        duration: "2h 49m",
        genre: "Sci-Fi",
        poster:
            "https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=600&fit=crop",
        rating: 8.9,
        created_at: "2026-01-10T10:00:00",
        updated_at: "2026-01-10T10:00:00",
    },
    {
        id: 2,
        title: "The Last Heist",
        description:
            "A retired thief is pulled back into the game for one final, impossible job that could change everything.",
        release_date: "2026-02-01",
        duration: "2h 12m",
        genre: "Action",
        poster:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        rating: 8.4,
        created_at: "2026-01-20T10:00:00",
        updated_at: "2026-01-20T10:00:00",
    },
    {
        id: 3,
        title: "Midnight Whispers",
        description:
            "Strange occurrences in a small town lead a journalist to uncover terrifying secrets hidden beneath its surface.",
        release_date: "2026-01-20",
        duration: "1h 58m",
        genre: "Horror",
        poster:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        rating: 7.8,
        created_at: "2026-01-05T10:00:00",
        updated_at: "2026-01-05T10:00:00",
    },
    {
        id: 4,
        title: "Love in Paris",
        description:
            "Two strangers meet on the streets of Paris and discover a connection that transcends time and distance.",
        release_date: "2026-02-14",
        duration: "2h 05m",
        genre: "Romance",
        poster:
            "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400&h=600&fit=crop",
        rating: 8.1,
        created_at: "2026-02-01T10:00:00",
        updated_at: "2026-02-01T10:00:00",
    },
    {
        id: 5,
        title: "The Silent Code",
        description:
            "A brilliant hacker discovers a government conspiracy and must race against time to expose the truth before it's too late.",
        release_date: "2026-01-28",
        duration: "2h 18m",
        genre: "Thriller",
        poster:
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        rating: 8.6,
        created_at: "2026-01-15T10:00:00",
        updated_at: "2026-01-15T10:00:00",
    },
    {
        id: 6,
        title: "Dragon's Legacy",
        description:
            "In a world where dragons once ruled, a young warrior embarks on a quest to restore the ancient bond between humans and mythical beasts.",
        release_date: "2025-12-25",
        duration: "2h 35m",
        genre: "Fantasy",
        poster:
            "https://images.unsplash.com/photo-1518676590747-1e3dcf5a86f4?w=400&h=600&fit=crop",
        rating: 8.2,
        created_at: "2025-12-20T10:00:00",
        updated_at: "2025-12-20T10:00:00",
    },
    {
        id: 7,
        title: "Beyond the Horizon",
        description:
            "A documentary crew ventures into uncharted territory, capturing breathtaking landscapes and the resilience of nature.",
        release_date: "2026-02-10",
        duration: "1h 45m",
        genre: "Adventure",
        poster:
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=600&fit=crop",
        rating: 7.5,
        created_at: "2026-02-05T10:00:00",
        updated_at: "2026-02-05T10:00:00",
    },
    {
        id: 8,
        title: "Laugh Track",
        description:
            "A struggling stand-up comedian lands the opportunity of a lifetime but must confront the ghosts of his past to make it big.",
        release_date: "2026-01-10",
        duration: "1h 52m",
        genre: "Comedy",
        poster:
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
        rating: 7.9,
        created_at: "2026-01-02T10:00:00",
        updated_at: "2026-01-02T10:00:00",
    },
    {
        id: 9,
        title: "Echoes of War",
        description:
            "A gripping tale of two brothers on opposite sides of a civil war, bound by blood but divided by ideology.",
        release_date: "2025-11-15",
        duration: "2h 40m",
        genre: "Drama",
        poster:
            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
        rating: 9.0,
        created_at: "2025-11-10T10:00:00",
        updated_at: "2025-11-10T10:00:00",
    },
    {
        id: 10,
        title: "Neon Nights",
        description:
            "In a rain-soaked cyberpunk city, a detective with a mysterious past hunts a serial killer who leaves cryptic neon messages.",
        release_date: "2026-02-05",
        duration: "2h 10m",
        genre: "Sci-Fi",
        poster:
            "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&h=600&fit=crop",
        rating: 8.3,
        created_at: "2026-01-28T10:00:00",
        updated_at: "2026-01-28T10:00:00",
    },
    {
        id: 11,
        title: "The Forgotten Kingdom",
        description:
            "An archaeologist discovers the ruins of a lost civilization and must protect its secrets from falling into the wrong hands.",
        release_date: "2026-01-05",
        duration: "2h 22m",
        genre: "Adventure",
        poster:
            "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=600&fit=crop",
        rating: 7.6,
        created_at: "2025-12-30T10:00:00",
        updated_at: "2025-12-30T10:00:00",
    },
    {
        id: 12,
        title: "Shadows Within",
        description:
            "A psychological thriller about a therapist who begins to question her own sanity after a new patient reveals disturbing truths.",
        release_date: "2026-02-12",
        duration: "1h 55m",
        genre: "Thriller",
        poster:
            "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
        rating: 8.7,
        created_at: "2026-02-08T10:00:00",
        updated_at: "2026-02-08T10:00:00",
    },
];
