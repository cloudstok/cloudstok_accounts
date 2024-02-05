const { read, write } = require('../db/db-config')
const SQL_ALL_CUSTOMER_USER = `select * from customer where is_deleted = 0 `
const SQL_INSERT_CUSTOMER = `insert into customer (user_id,customer_name, customer_address, customer_email, customer_phone, customer_gstin) values (?,?,?,?,?,?);`
const SQL_UPDATE_CUSTOMER = `update customer set user_id = ?,customer_name = ?, customer_address = ?, customer_email = ?, customer_phone = ?, customer_gstin = ? where customer_id = ? `
const SQL_DELETE_CUSTOMER = `update customer set is_deleted = 1 where customer_id = ? `
const authorizedRoles = ["admin", "support"]




const getAllCustomer = async (req, res) => {
    try {
        const { user_type } = res.locals.auth.user;
        if (authorizedRoles.includes(user_type)) {
            let [getCustomer] = await write.query(SQL_ALL_CUSTOMER_USER);
            if (getCustomer.length > 0) {
                return res.status(200).send({ status: "success", getCustomer });
            } else {
                return res.status(200).send({ status: "false", msg: "No data found" })
            }
        } else {
            return res.status(401).send({ status: "false", msg: "Unauthorized.! Only admin and support can get support users list" });
        }
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addCustomer = async (req, res) => {
    try {
        const { user_type, user_id } = res.locals.auth.user;
        if (authorizedRoles.includes(user_type)) {
            const { email, mobile, name, address, gstin } = req.body;
            let insertCustomer = await write.query(SQL_INSERT_CUSTOMER, [user_id, name, address, email, mobile, gstin]);
            return res.status(200).send({ status: "success", msg: `Customer inserted successfully`, insertCustomer });
        }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthorized.! Only admin and support can get support users list" });

        }

    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const updateCustomer = async (req, res) => {
    try {
        const { user_type, user_id } = res.locals.auth.user;
        if (authorizedRoles.includes(user_type)) {
            const { email, mobile, name, address, gstin } = req.body;
            const updateCustomer = await write.query(SQL_UPDATE_CUSTOMER, [user_id, name, address, email, mobile, gstin, req.params.customer_id]);
            return res.status(200).send({ status: "success", msg: `Customer Updated successfully`, updateCustomer });

        }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthorized.! Only admin and support can get support users list" });

        }

    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const { user_type } = res.locals.auth.user;
        if (authorizedRoles.includes(user_type)) {
            const deleteCustomer = await write.query(SQL_DELETE_CUSTOMER, [req.params.customer_id])
            return res.status(200).send({ status: "success", msg: `Customer Delete successfully`, deleteCustomer });

        }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthorized.! Only admin and support can get support users list" });

        }


    }
    catch (err) {

        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })

    }
}

module.exports = {
    getAllCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer
}