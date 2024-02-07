const { read, write } = require('../db/db-config')

const SQL_GET_BILLING_DATA =  `select * from billing where is_deleted = 0`
const SQL_INSERT_BILLING_DATA = `insert into billing(created_by, customer_id, billing_invoice_no, billing_date, billing_delivery_note, billing_terms_of_payment, billing_other_reference, billing_buyer_order_number, billing_dispatch_doc_no, billing_delivery_note_date, billing_dispatched_throught, billing_destination, billing_terms_of_delivery, receiver_details, buyer_order_date,  order_details, total_amount, amount_in_words ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
const SQL_UPDATE_BILLING_DATA = `update billing set `
const SQL_DELETE_BILLING_DATA = `delete billing set is_deleted = 1`
const SQL_GET_BILL_BY_CUSTOMER = `select * from billing where customer_id = ? and is_deleted = 0`
const SQL_GET_BILLING_INFO = `select * from billing_info where is_deleted = 0`

const authorizedRoles = ["admin", "support"]


const getBillingData = async (req, res) => {
    try {
            let getBilling = await write.query(SQL_GET_BILLING_DATA)
            if (metaData.length > 0) {
                return res.status(200).send({ status: "success", getBilling });
            }
            else {
                return res.status(200).send({ status: "false", msg: "No data found" })
            }
    }
    catch {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addBilling = async (req, res) => {
    try {
        const {user_id  } = res.locals.auth.user;
        const {  name, email, city, pin_code, gst_in, place_of_supply, invoice_no, invoice_date, delivery_note, mode_payment, other_reference, buyer_order_no, dispatched_no, delivary_note_date, dis_through, destination, terms_of_del, productDetails, total_amount, buyer_order_date, amount_in_words } = req.body;
        let receiverAddress = {
            name : name,
            email: email,
            city: city,
            pin_code: pin_code,
            gst_in: gst_in,
            place_of_supply: place_of_supply

        }
        await write.query(SQL_INSERT_BILLING_DATA, [user_id, req.params.customer_id, invoice_no, invoice_date, delivery_note, mode_payment, other_reference, buyer_order_no, dispatched_no, delivary_note_date, dis_through, destination, terms_of_del, JSON.stringify(receiverAddress),buyer_order_date,  JSON.stringify(productDetails),  total_amount, amount_in_words  ]);
        return res.status(200).send({ status: "success", msg: `Billing insert successfully`});
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const updateBilling = async(req, res) => {
    try{
        const {user_type, user_id} = res.locals.auth.user;
        if(user_type === "admin"){
            const { email, mobile, name} = req.body;
            const updateBilling = await write.query(SQL_UPDATE_BILLING_DATA, [user_id, name, email, mobile,req.params.support_id]);
            return res.status(200).send({ status: "success", msg: `Billing Update successfully`, updateBilling});

        }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthoized.! Only admin can get support users list"});

        }

    }
    catch(err){
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const getBillByCustomer = async (req, res) => {
    try {
            let [getBillByCustomer] = await write.query(SQL_GET_BILL_BY_CUSTOMER, [req.params.customer_id])
            let [metaData] = await write.query(SQL_GET_BILLING_INFO)
            if (metaData.length > 0) {
                metaData[0].billing_info_meta_data = typeof metaData[0].billing_info_meta_data === 'string' ? JSON.parse(metaData[0].billing_info_meta_data) : metaData[0].billing_info_meta_data;
            }else{
                console.log(`No meta data found`)
            }
            if (getBillByCustomer.length > 0) {
             for(let x of getBillByCustomer){
                x.receiver_details = typeof x.receiver_details === 'string' ? JSON.parse(x.receiver_details) : x.receiver_details;
                x.order_details = typeof x.order_details === 'string' ? JSON.parse(x.order_details) : x.order_details;
                x.metaData = metaData[0]
             }
                return res.status(200).send({ status: "success", data : getBillByCustomer });

            }
            else {
                return res.status(200).send({ status: "false", msg: "No data found" })
            }
    }
    catch {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const deleteBilling = async(req, res) => {
    try{
        const {user_type} = res.locals.auth.user;
        if(user_type === "admin"){
            await write.query(SQL_DELETE_SUPPORT, [req.params.support_id])
            return res.status(200).send({ status: "success", msg: `BILLING Delete successfully`});
        }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthoized.! Only admin can get support users list"});

        } 


    }
    catch(err){
        
            console.error(`[ERR] request failed with err:::`, err)
            res.status(500).send({ status: "fail", msg: "Something went wrong" })
        
    }
}

module.exports = {
    getBillingData,
    addBilling,
    updateBilling,
    getBillByCustomer
}