import api from "../configs/axios";

export interface Seat {
    id: number;
    seat_number: string;
    row_number: number;
    col_number: number;
    price: number;
    seat_type: string;
}

const getSeatsByShowId = async (showId: number): Promise<Seat[]> => {
    try {
        const response = await api.get(`/seats/show/${showId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching seats:", error);
        throw error;
    }
};

export {
    getSeatsByShowId,
};
