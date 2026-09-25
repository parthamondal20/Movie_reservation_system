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

const getBookings = async (userId: number) => {
    try {
        const response = await api.get(`/booking/getBookings/${userId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export {
    bookSeats,
    getBookings
};