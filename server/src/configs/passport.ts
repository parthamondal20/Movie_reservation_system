import pool from "./db";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import generateAccessAndRefreshTokens from "../utils/generateJwtTokens";
import { hashPassword } from "../utils/hashPassword";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile: Profile, done) => {
            try {

                const email = profile.emails?.[0].value;
                const existingUser = await pool.query(
                    `
                    SELECT * FROM users WHERE email=$1
                    `, [email]
                );

                let user;
                if (existingUser.rows.length > 0) {
                    user = existingUser.rows[0];
                } else {
                    const hashedPassword = await hashPassword("i love you disha");
                    const newUser = await pool.query(
                        `
                        INSERT INTO users (name,email,google_id,password) VALUES($1,$2,$3,$4) RETURNING *
                        `, [profile.displayName, profile.emails?.[0].value, profile.id, hashedPassword]
                    );
                    user = newUser.rows[0];
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

export default passport;