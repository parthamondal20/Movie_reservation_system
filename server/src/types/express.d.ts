import { JwtPayload } from "../middleweres/authenticate.middleware";
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}