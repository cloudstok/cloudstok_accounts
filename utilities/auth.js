const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT = 12;

const generateToken = async(storeData, res) => {
    try {
      return await jwt.sign({ user: storeData }, process.env.jwtSecretKey)
    } catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
      res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
  }
  const verifyToken = async(req, res, next) => {
    try {
      const tokenHeader = req.headers.authorization;
      if (!tokenHeader)
        return res.status(401).json({ "message": "Token not found" });
      const token = tokenHeader.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.jwtSecretKey);
      if (!verifiedToken)
        return res.status(401).json({ "message": "invalid token" })
      res.locals.auth = verifiedToken;
      req.logger_user_type = res.locals.auth.user?.user_type || null
      // return(res.locals.auth)
      next()
    } catch (err) {
      console.error(`[ERR] request failed with err:::`, err)
      res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
  }

  const validateRole = (permittedRole) => {
    try{
      return (req, res, next) => {
        const userRole = req.logger_user_type;
        if(!permittedRole.includes(userRole))
          return res.status(401).send({ status: "fail", msg: `User with role : ${role} is not authorized to access this API, Only ${[...permittedRole]} can access this API`});
        console.log(`[SUCCESS] user role authenticated`);
        next()
      }
    }catch(err){
      console.error(`[ERR] while validating user role is:::`, err);
      res.status(500).send({ status: "fail", msg: "Something went wrong"})
    }
  }

  const hashing = async (user_password) => {
    return await bcrypt.hash(user_password, SALT)
}



const  hashCompare = async(Password , hashPassword) =>{
    return await bcrypt.compare(Password, hashPassword)
}



 const  auth = async (req, res, next) => {
    try {
      const tokenHeader = req.headers.authorization;
      if (!tokenHeader)
        return res.status(401).json({ "message": "Token not found" });
      const token = tokenHeader.split(" ")[1];
      const verifiedToken = jwt.verify(token, appConfig.jwt.jwtSecretKey);
      if (!verifiedToken) {
        return res.status(401).json({ "message": "invalid token" })
      }
      if (auth.includes(verifiedToken.user.role)) {
        res.locals.auth = verifiedToken;
        next()
      } else {
        return res.status(401).send({ msg: "You are not authorized.", status: "fail" })
      }
    } catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
  };


  module.exports = { generateToken, verifyToken, auth, hashCompare, hashing, validateRole};