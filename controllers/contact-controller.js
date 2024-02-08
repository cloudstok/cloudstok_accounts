const { read, write } = require('../db/db-config')
const SQL_ALL_CONTACT_BY_CUSTOMER_ID = `select * from contact where customer_id = ? and is_deleted = 0 `
const SQL_INSERT_CONTACT = `insert into contact (customer_id,contact_name, contact_email, contact_phone) values (?,?,?,?);`
const SQL_UPDATE_CONTACT = `update contact set ? where contact_id = ? `
const SQL_DELETE_CONTACT = `update contact set is_deleted = 1 where contact_id = ? `





const getAllContact = async (req, res) => {
    try {
            let [getContact] = await write.query(SQL_ALL_CONTACT_BY_CUSTOMER_ID, [req.params.customer_id]);
            if (getContact.length > 0) {
                return res.status(200).send({ status: "success", getContact });
            } else {
                return res.status(200).send({ status: "false", msg: "No data found" })
            }
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addContact = async (req, res) => {
    try {
            const { contact_name, contact_email, contact_phone} = req.body;
            await write.query(SQL_INSERT_CONTACT, [req.params.customer_id,  contact_name, contact_email, contact_phone]);
            return res.status(200).send({ status: "success", msg: `Contact added successfully` });
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const updateContact = async (req, res) => {
    try {
            const updateSupport = await write.query(SQL_UPDATE_CONTACT, [req.body, req.params.contact_id]);
            return res.status(200).send({ status: "success", msg: `Contact Updated successfully`, updateSupport });
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const deleteContact = async (req, res) => {
    try {
            await write.query(SQL_DELETE_CONTACT, [req.params.contact_id])
            return res.status(200).send({ status: "success", msg: `Contact Deleted successfully` });
    }
    catch (err) {

        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })

    }
}

module.exports = {
    getAllContact,
    addContact,
    updateContact,
    deleteContact
}