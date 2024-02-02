const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
      // return(res.locals.auth)
      next()
    } catch (err) {
      console.error(`[ERR] request failed with err:::`, err)
      res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
  }

  const hashing = async (user_password) => {
    return await bcrypt.hash(user_password, this.SALT)
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
        return res.status(401).send({ msg: "You are not authorized.", status: false })
      }
    } catch (err) {
        console.error(`[ERR] request failed with err:::`, err)
        res.status(500).send({status: "fail", msg: "Something went wrong"})
    }
  };


  module.exports = { generateToken, verifyToken, auth, hashCompare, hashing};