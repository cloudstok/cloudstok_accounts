 const route = require('express').Router();
const { register, login } = require('../controllers/user-controller');
const { verifyToken} = require('../utilities/auth');


route.post('/register', verifyToken, register);
route.post('/login', login)


module.exports = { route};