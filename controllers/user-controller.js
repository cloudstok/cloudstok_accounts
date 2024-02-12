const { generateToken, verifyToken, auth, hashCompare, hashing } = require("../utilities/auth");
const FIND_USER_SQL = `SELECT * FROM user where is_deleted = 0 and user_email = ?`;
const SQL_INSERT_USER = `INSERT INTO user (user_email, user_password, user_type) Values (?, ?, ?); `
const { read, write } = require("../db/db-config");
const authorizedRoles = ["admin", "support"]
const SQL_UPDATE_PASSWORD = `UPDATE user SET user_password = ? where user_email = ?`
const SQL_FIND_SUPPORT = `SELECT * FROM support where user_id = ? and is_deleted = 0`
const SQL_FIND_CUSTOMER = `SELECT * FROM customer where user_id = ? and is_deleted = 0`



 const register = async (req, res) => {
    try {
            const { email, password, role } = req.body;
            if(user_type === 'support' && authorizedRoles.includes(role)){
                return res.status(401).send({ status: "false", msg: "Unauthoized.! Only admin can register admin or support users"});
            }  
            let [checkUser] = await write.query(FIND_USER_SQL, [email]);
            if(checkUser.length > 0){
                console.log(`[INFO] User already exists with details:::`, checkUser[0])
                return res.status(400).send({ status: "fail", msg: `User with email : ${email} already exists, Please login..!!`});
            }
            const hash = await hashing(password)
            await write.query(SQL_INSERT_USER, [email, hash, role]);
            return res.status(200).send({ status: "success", msg: `User with role : ${role} created successfully`});
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
}


 const login = async(req, res)=> {
    try {
        const { email, password} = req.body
        let token = ''
        const [user] = await write.query(FIND_USER_SQL, [email]);
        if (user.length === 0) {
            return res.status(400).send({ status: "false", msg: `User with email : ${email} is not registered, Please register first..!!`});
        }
        const comparePassword = await hashCompare(password, user[0].user_password)
        if (!comparePassword) {
            return res.status(400).send({ status: "false", msg: `Invalid Password entered`});
        }
        let data;
        if(user[0].user_type === "support"){
            [data] = await write.query(SQL_FIND_SUPPORT, [user[0].user_id])
        }
        if(user[0].user_type === "customer"){
            [data] = await write.query(SQL_FIND_CUSTOMER, [user[0].user_id])
        }
        user[0].data = data[0]
        token = await generateToken(user[0], res) 
        return res.status(200).send({status: "success", msg: "Login Successfully", token: token, userData: user[0] })
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
}

const changePassword = async(req, res)=> {
    try{
        const {email, oldPassword, newPassword} = req.body;
        let userRole = req.logged_user_type;
        const [userData] = await write.query(FIND_USER_SQL, [email]);
        if(userData.length > 0){
            const comparePassword = await hashCompare(oldPassword, userData[0].user_password)
            if (!comparePassword) {
                return res.status(400).send({ status: "false", msg: `Invalid Old Password entered`});
            }
            const hash = await hashing(newPassword)
            if(userRole === "admin" || userRole === "support" && ["support", "customer"].includes(userData[0].user_type) || userRole === "customer" && userData[0].user_type === "customer"){
                await write.query(SQL_UPDATE_PASSWORD, [hash]);
                return res.status(200).send({ status: "success", msg: "User password changed successfully"});
            }else{
                return res.status(200).send({ status: "success", msg: `User with role: ${userRole} is not authorized to change password`})
            }
        }else{
            console.log(`User with email : ${email} not found`)
            res.status(400).send({status: "fail", msg: `Email does not exists in our systems`})
        }
    }  catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
}


module.exports = { register, login, changePassword}