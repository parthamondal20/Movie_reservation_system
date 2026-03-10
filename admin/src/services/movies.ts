import api from "../configs/axios";

interface Movie {
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
const addMovie = async (movie: Movie) => {
    try {
        const response = await api.post<ApiResponse<Movie>>('/movie/add', movie);
        return response.data.data;
    } catch (error) {
        console.log(error)
    }
}

export {
    addMovie
}