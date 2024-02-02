import { createPool } from "mysql2/promise"
const dbUrl = process.env.DB_URL || "" 
export const read = createPool(dbUrl);
export const write = createPool(dbUrl);
