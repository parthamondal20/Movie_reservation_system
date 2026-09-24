import api from "../configs/axios";

const bookSeats = async (userId: number, showId: number, seats: any[]) => {
    try {
        const response = await api.post(`/booking/bookSeats`, {
            userId,
            showId,
            seats
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    bookSeats
};