const { read, write } = require('../db/db-config')

const SQL_GET_BILLING_DATA =  `select * from billing where is_deleted = 0`
const SQL_INSERT_BILLING_DATA = `insert into billing(billing_invoice-no, billing_date, billing_delivery_note, billing_terms_of_payment, billing_other_reference, billing_buyer_order_number, billing_dispatch_doc_no, billing_delivery_note_date, billing_dispatched_throught, billing_destination, billing_terms_of_delivery, order, total_amount, amount_in_words ) values (?,?,?,?,?,?,?,?,?,?,?,?,?) `
const SQL_UPDATE_BILLING_DATA = `update billing set `
const SQL_DELETE_BILLING_DATA = `delete billing set is_deleted = 1`


const getBillingData = async (req, res) => {
    try {
        const { user_type, user_id } = res.locals.auth.user;
        if (authorizedRoles.includes(user_type)) {
            let getBilling = await write.query(SQL_GET_BILLING_DATA)
            if (metaData.length > 0) {
                return res.status(200).send({ status: "success", getBilling });

            }
            else {
                return res.status(200).send({ status: "false", msg: "No data found" })
            }

        }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthoized.! Only admin and support can get support users list" });

        }
    }
    catch {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addBilling = async (req, res) => {
    try {
        const {user_type, user_id  } = res.locals.auth.user;
       if(user_type === "admin"){
        const { invoice_no, invoice_date, delivery_note, mode_payment, other_reference, dis_throught, buyer_order_no, dispatched_no, dated,  delivery_note_date, designation, terms_of_del, total_amount, amount_in_words} = req.body;
        await write.query(SQL_INSERT_BILLING_DATA, [billing_invoice-no, billing_date, billing_delivery_note, billing_terms_of_payment, billing_other_reference, billing_dispatched_throught, billing_buyer_order_number, billing_dispatch_doc_no, billing_date,  billing_delivery_note, billing_destination, billing_terms_of_delivery, JSON.stringify(order), total_amount, amount_in_words  ]);
        return res.status(200).send({ status: "success", msg: `Billing insert successfully`});
       }
        else {
            return res.status(401).send({ status: "false", msg: "Unauthoized.! Only admin can get support users list"});

        }

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
}