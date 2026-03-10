import {
    signUp,
    login,
    logout,
    generateAccessToken
} from "../controllers/auth.controller";
import authenticateMiddleware from "../middleweres/authenticate.middleware";
import passport from "passport";
import { Router } from "express";
import generateAccessAndRefreshTokens from "../utils/generateJwtTokens";
const router = Router();
router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh_token", generateAccessToken);
router.get(
    "/google",
    (req, res, next) => {
        const redirect = req.query.redirect as string || "/";
        passport.authenticate("google", {
            scope: ["profile", "email"],
            state: redirect,
            session: false,
        })(req, res, next);
    });

router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    async (req, res) => {
        const redirectPath =
            typeof req.query.state === "string" &&
                req.query.state.startsWith("/")
                ? req.query.state
                : "/";

        const client_url = process.env.CLIENT_URL;

        if (!req.user) {
            return res.redirect(`${client_url}/login`);
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(req.user.id);
        const payload = {
            httpOnly: true,
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production"
        }
        res.status(200)
            .cookie("accessToken", accessToken, payload)
            .cookie("refreshToken", refreshToken, payload)

        const separator = redirectPath.includes("?") ? "&" : "?";
        res.redirect(`${client_url}${redirectPath}${separator}google_auth=true`);
    })
router.use(authenticateMiddleware);
router.post("/logout", logout);
export default router;