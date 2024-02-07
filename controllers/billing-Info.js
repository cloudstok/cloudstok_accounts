const { json } = require('express')
const { read, write } = require('../db/db-config')
const SQL_GET_BILLING_INFO = `select * from billing_info where is_deleted = 0`
const SQL_INSERT_BILLING_INFO = `insert into billing_info(billing_info_meta_data, created_by) values (?,?) `
const authorizedRoles = ["admin", "support"]

const getMetaData = async (req, res) => {
    try {
            let [metaData] = await write.query(SQL_GET_BILLING_INFO)
            if (metaData.length > 0) {
                metaData[0].billing_info_meta_data = typeof metaData[0].billing_info_meta_data === 'string' ? JSON.parse(metaData[0].billing_info_meta_data) : metaData[0].billing_info_meta_data;
                return res.status(200).send({ status: "success", data: metaData[0] });
            }
            else {
                return res.status(200).send({ status: "false", msg: "No data found" })
            }       
    }
    catch(err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addMetaData = async (req, res) => {
    try {
        const { user_type, user_id } = res.locals.auth.user;
            const { metaData } = req.body;
            await write.query(SQL_INSERT_BILLING_INFO, [JSON.stringify(metaData), user_id]);
            return res.status(200).send({ status: "success", msg: `Metadata insert successfully` });
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}


module.exports = {
    getMetaData,
    addMetaData
}