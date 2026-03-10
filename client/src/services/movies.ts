import api from "../configs/axios";
interface query {
    lastId: number,
    limit: number,
}

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
interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    success: boolean;
}

const getMovies = async (payload: query) => {
    try {
        const res = await api.get<ApiResponse<Movie[]>>(`/movies/get/${payload.lastId}/${payload.limit}`);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

const getMovieById = async (movie_id: number) => {
    try {
        const res = await api.get<ApiResponse<Movie>>(`/movies/${movie_id}`);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export {
    getMovies,
    getMovieById
}