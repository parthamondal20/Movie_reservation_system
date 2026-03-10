import { Pool } from "pg"

console.log(process.env.DB_USER)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_NAME)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})
export default pool;

