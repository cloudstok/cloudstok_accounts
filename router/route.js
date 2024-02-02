 const route = require('express').Router();
const { getAllSupport, addSupport, updateSupport, deleteSupport } = require('../controllers/support-controller');
const { register, login } = require('../controllers/user-controller');
const { verifyToken} = require('../utilities/auth');


route.post('/register', verifyToken, register);
route.post('/login', login)
route.get('/getAllSupport', verifyToken, getAllSupport)
route.post('/addSupport', verifyToken, addSupport)
route.put('/updateSupport/:support_id', verifyToken, updateSupport)
route.put('/deleteSupport/:support_id', verifyToken, deleteSupport)


module.exports = { route};