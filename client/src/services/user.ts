import api from "../configs/axios"

interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    success: boolean;
}
interface User {
    id: number,
    email: string,
    name: string,
}

const getMe = async () => {
    try {
        const res = await api.get<ApiResponse<User>>("/user/me");
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export { getMe }