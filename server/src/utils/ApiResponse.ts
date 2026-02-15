class apiResponse<T> {
    public success: boolean;
    constructor(
        public statusCode: number,
        public message: string,
        public data: T | null = null
    ) {
        this.success = statusCode < 400;
    }
}

export default apiResponse;