const { read, write } = require('../db/db-config')
const { hashing } = require('../utilities/auth')
const SQL_ALL_CUSTOMER_USER = `select * from customer  where is_deleted = 0`;
const SQL_CONTACT_BY_CUSTOMER_ID = `SELECT * FROM contact where customer_id = ? and is_deleted= 0`
const SQL_INSERT_CUSTOMER = `insert into customer (user_id,customer_name, customer_address, customer_email, customer_phone, customer_gstin, city, pincode) values (?,?,?,?,?,?,?,?);`
const SQL_UPDATE_CUSTOMER = `update customer set user_id = ?,customer_name = ?, customer_address = ?, customer_email = ?, customer_phone = ?, customer_gstin = ? where customer_id = ? `
const SQL_DELETE_CUSTOMER = `update customer set is_deleted = 1 where customer_id = ? `
const SQL_INSERT_USER = `INSERT INTO user (user_email, user_password, user_type) Values (?, ?, ?); `
const SQL_FIND_USER = `select * from customer where customer_id = ? `
const SQL_UPDATE_USER = `update user set is_deleted = 1 where user_email= ?`
const SQL_UPDATE_CONTACT = `update contact set is_deleted = 1 where customer_id= ?`
const SQL_GET_CUSTOMER_BY_ID = `SELECT * FROM customer as cu inner join contact as co on co.customer_id = cu.customer_id where cu.customer_id = ?`
const SQL_GET_BILLING_INFO = `select * from billing_info where is_deleted = 0`;
const SQL_GET_CUSTOMER_BY_EMAIL = 'SELECT customer_id from customer where customer_email = ? and is_deleted = 0'
const SQL_INSERT_CONTACTS = 'INSERT into contact (contact_name, contact_email, contact_phone, customer_id) values (?,?,?,?)'
const SQL_CUSTOMER_BY_ID = `select * from customer where customer_id = ? and is_deleted = 0`
const SQL_UPDATE_CONTACT_BY_ID = `UPDATE contact set ? where contact_id = ?`;
const SQL_GET_LATEST_BILL_CUSTOMER = `SELECT * FROM billing WHERE customer_id = ? and is_deleted = 0 order by created_at desc limit 1`




const getAllCustomer = async (req, res) => {
    try {
            let [getCustomer] = await write.query(SQL_ALL_CUSTOMER_USER);
            if (getCustomer.length > 0) {
                for(let x of getCustomer){
                    const [getContact]  = await write.query(SQL_CONTACT_BY_CUSTOMER_ID, [x.customer_id])
                    x.contactDetails = getContact
                }
                return res.status(200).send({ status: "success", getCustomer });
            } else {
                return res.status(200).send({ status: "success", msg: "No data found" })
            }
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const getCustomerById = async (req, res) => {
    try {
            let [getCustomer] = await write.query(SQL_GET_CUSTOMER_BY_ID, [req.params.customer_id]);
            let [metaData] = await write.query(SQL_GET_BILLING_INFO)
            let [getLastBill] = await write.query(SQL_GET_LATEST_BILL_CUSTOMER, [req.params.customer_id])
            if (metaData.length > 0) {
                metaData[0].billing_info_meta_data = typeof metaData[0].billing_info_meta_data === 'string' ? JSON.parse(metaData[0].billing_info_meta_data) : metaData[0].billing_info_meta_data;
            }else{
                console.log(`No meta data found`)
            }
            if (getLastBill.length > 0) {
                getLastBill[0].receiver_details = typeof getLastBill[0].receiver_details === 'string' ? JSON.parse(getLastBill[0].receiver_details) : getLastBill[0].receiver_details;
                getLastBill[0].order_details = typeof getLastBill[0].order_details === 'string' ? JSON.parse(getLastBill[0].order_details) : getLastBill[0].order_details;
                getCustomer[0].lastBill = getLastBill[0]
            }else{
                console.log(`No bill found for the customer`)
            }
            if (getCustomer.length > 0) {
                const [getContact]  = await write.query(SQL_CONTACT_BY_CUSTOMER_ID, [getCustomer[0].customer_id])
                getCustomer[0].contactDetails = getContact
                return res.status(200).send({ status: "success", data: getCustomer[0], metaData: metaData[0] });
            } else {
                return res.status(200).send({ status: "success", msg: "No data found" })
            }

    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addCustomer = async (req, res) => {
    try {
        const { user_id } = res.locals.auth.user;
            const { email, mobile, name, address, gstin, password, city, pin_code, contactDetails } = req.body;
            await write.query(SQL_INSERT_CUSTOMER, [user_id, name, address, email, mobile, gstin, city, pin_code]);
            const hash = await hashing(password)
            await write.query(SQL_INSERT_USER, [email, hash, 'customer']);
            let [getCustomer] = await write.query(SQL_GET_CUSTOMER_BY_EMAIL, [email])
            if(Array.isArray(contactDetails) && contactDetails.length > 0){
                for(let x of contactDetails){
                    let customer_id = getCustomer[0]?.customer_id
                    await write.query(SQL_INSERT_CONTACTS, [x.contact_name, x.contact_email, x.contact_phone, customer_id]);
                }
            }else{
                console.log('No contact associated with the customer');
            }
            return res.status(200).send({ status: "success", msg: `Customer inserted successfully` });

    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const updateCustomer = async (req, res) => {
    try {
            const { user_id } = res.locals.auth.user;
            const { email, mobile, name, address, gstin, contactDetails } = req.body;
            const updateCustomer = await write.query(SQL_UPDATE_CUSTOMER, [user_id, name, address, email, mobile, gstin, req.params.customer_id]);
            if(Array.isArray(contactDetails) && contactDetails.length > 0){
                for(let x of contactDetails){
                    if(!x.contact_id){
                        await write.query(SQL_INSERT_CONTACTS, [x.contact_name, x.contact_email, x.contact_phone, req.params.customer_id])
                    }
                    let contactId = x.contact_id;
                    delete x.contact_id
                    await write.query(SQL_UPDATE_CONTACT_BY_ID, [x, contactId]);
                }
            }else{
                console.log(`[INFO] NO contacts provided for updation`)
            }
            return res.status(200).send({ status: "success", msg: `Customer Updated successfully`, updateCustomer });
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const deleteCustomer = async (req, res) => {
    try {
            const [findCustomer] = await write.query(SQL_FIND_USER, [req.params.customer_id])
            await write.query(SQL_DELETE_CUSTOMER, [req.params.customer_id])
            await write.query(SQL_UPDATE_USER, [findCustomer[0].customer_email])
            await write.query(SQL_UPDATE_CONTACT, [req.params.customer_id])
            return res.status(200).send({ status: "success", msg: `Customer Delete successfully` });

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
    deleteCustomer,
    getCustomerById
}