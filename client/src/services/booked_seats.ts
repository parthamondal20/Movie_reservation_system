import api from "../configs/axios";

const getBookedSeats = async (showId: number) => {
    try {
        const response = await api.get(`/booked_seats/show/booked_seats/${showId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export {
    getBookedSeats
};