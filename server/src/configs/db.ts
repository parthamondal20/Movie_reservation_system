import { Pool } from "pg"

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'partha@1234',
    database: 'movie_db',
    port: 5432
})
export default pool;

