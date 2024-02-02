const { createPool } = require("mysql2/promise")
const dbUrl = process.env.DB_URL || "" 
const read = createPool(dbUrl);
const write = createPool(dbUrl);

module.exports = { read, write}
