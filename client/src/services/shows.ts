import api from "../configs/axios";


const getShowsByMovieId = async (movieId: number) => {
    try {
        const response = await api.get(`/shows/${movieId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching shows:", error);
        throw error;
    }
};


export {
    getShowsByMovieId
}