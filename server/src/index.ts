import app from "./app";
import pool from "./configs/db";

const PORT = process.env.PORT;
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Failed to connect to DB', err);
        process.exit(1); // exit if DB fails
    } else {
        console.log('Connected to DB at', res.rows[0].now);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});