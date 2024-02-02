const {read, write} = require('../db/db-config')
const SQL_ALL_SUPPORT_USER = `select * from support where is_deleted = 0`

