const { read, write } = require('../db/db-config')
const { hashing } = require('../utilities/auth')
const SQL_ALL_SUPPORT_USER = `select * from support where is_deleted = 0 `
const SQL_INSERT_SUPPORT = `insert into support (user_id,support_name, support_email, support_mobile_number) values (?,?,?,?);`
const SQL_UPDATE_SUPPORT = `update support set user_id= ?,support_name = ?, support_email = ?, support_mobile_number = ? where support_id = ? `
const SQL_DELETE_SUPPORT = `update support set is_deleted = 1 where support_id = ? ` 
const SQL_INSERT_USER = `INSERT INTO user (user_email, user_password, user_type) Values (?, ?, ?)`;
const SQL_FIND_USER = `select * from support where support_id = ? `
const SQL_UPDATE_USER = `update user set is_deleted = 1 where user_email= ?`
const authorizedRoles = ["admin", "support"]




const getAllSupport = async (req, res) => {
    try {
        const {user_type } = res.locals.auth.user;
        if(authorizedRoles.includes(user_type)){
        let [getSupport] = await write.query(SQL_ALL_SUPPORT_USER);
        if (getSupport.length > 0) {
            return res.status(200).send({ status: "success", getSupport});
        }else{
            return res.status(200).send({status:"false", msg:"No data found"})
        }
    }
    else{
        return res.status(401).send({ status: "false", msg: "Unauthoized.! Only admin and support can get support users list"});
    }
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({ status: "fail", msg: "Something went wrong" })
    }
}

const addSupport = async (req, res) => {
    try {
        const {user_type, user_id  } = res.locals.auth.user;
       if(user_type === "admin"){
        const { email, mobile, name, password, role} = req.body;
        await write.query(SQL_INSERT_SUPPORT, [user_id, name, email, mobile]);
        const hash = await hashing(password)
        await write.query(SQL_INSERT_USER, [email, hash, (role? role: 'support')]);
        return res.status(200).send({ status: "success", msg: `Support insert successfully`});
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

const updateSupport = async(req, res) => {
    try{
        const {user_type, user_id} = res.locals.auth.user;
        if(user_type === "admin"){
            const { email, mobile, name} = req.body;
            const updateSupport = await write.query(SQL_UPDATE_SUPPORT, [user_id, name, email, mobile,req.params.support_id]);
            return res.status(200).send({ status: "success", msg: `Support Update successfully`, updateSupport});

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

const deleteSupport = async(req, res) => {
    try{
        const {user_type} = res.locals.auth.user;
        if(user_type === "admin"){
            const [findSupport] = await write.query(SQL_FIND_USER, [req.params.support_id])
            await write.query(SQL_DELETE_SUPPORT, [req.params.support_id])
            await write.query(SQL_UPDATE_USER, [findSupport[0].support_email])
            return res.status(200).send({ status: "success", msg: `Support Delete successfully`});
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
    getAllSupport,
    addSupport,
    updateSupport,
    deleteSupport
}