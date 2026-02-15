import {
    signUp,
    login,
    logout,
    generateAccessToken
} from "../controllers/auth.controller";
import authenticateMiddleware from "../middleweres/authenticate.middleware";
import { Router } from "express";
const router = Router();
router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh_token", generateAccessToken);
router.use(authenticateMiddleware);
router.post("/logout", logout);
export default router;