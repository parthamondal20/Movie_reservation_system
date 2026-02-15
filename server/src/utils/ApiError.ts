class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors: unknown[] = [],
    public success: boolean = false,
    stack?: string
  ) {
    super(message);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;