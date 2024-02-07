const { generateToken, verifyToken, auth, hashCompare, hashing } = require("../utilities/auth");
const FIND_USER_SQL = `SELECT * FROM user where is_deleted = 0 and user_email = ?`;
const SQL_INSERT_USER = `INSERT INTO user (user_email, user_password, user_type) Values (?, ?, ?); `
const { read, write } = require("../db/db-config");
const authorizedRoles = ["admin", "support"]




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
        token = await generateToken(user[0], res) 
        return res.status(200).send({status: "success", msg: "Login Successfully", token: token, userData: user[0] })
    }
    catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
}


module.exports = { register, login}