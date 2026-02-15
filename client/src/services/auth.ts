import api from "../configs/axios";

interface signUpForm {
    name: string,
    email: string,
    password: string
}

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

interface loginForm {
    email: string,
    password: string
}

const signUp = async (form: signUpForm) => {
    try {
        const res = await api.post<ApiResponse<User>>("/auth/signUp", form);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

const login = async (form: loginForm) => {
    try {
        const res = await api.post<ApiResponse<User>>("/auth/login", form);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

const logout = async () => {
    try {
        const res=await api.post("/auth/logout");
        console.log(res);
    } catch (error) {
        throw error;
    }
}

export {
    signUp,
    login,
    logout
}