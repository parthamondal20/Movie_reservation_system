import { JwtPayload } from "../middleweres/authenticate.middleware";
declare global {
    namespace Express {
        interface User {
            id: number;
        }
        interface Request {
            user?: JwtPayload;
        }
    }
}