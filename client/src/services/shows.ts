import api from "../configs/axios";

const getShowsByMovieId = async (movieId: number, location: String) => {
    try {
        const response = await api.get(`/shows/${movieId}/${location}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching shows:", error);
        throw error;
    }
};


export {
    getShowsByMovieId
}