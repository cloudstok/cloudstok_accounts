 const route = require('express').Router();
const { getAllCustomer, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer-controller');
const { getAllSupport, addSupport, updateSupport, deleteSupport } = require('../controllers/support-controller');
const { register, login } = require('../controllers/user-controller');
const { verifyToken} = require('../utilities/auth');


route.post('/register', verifyToken, register);
route.post('/login', login)
route.get('/get/all/support', verifyToken, getAllSupport)
route.post('/add/support', verifyToken, addSupport)
route.put('/update/support/:support_id', verifyToken, updateSupport)
route.put('/delete/support/:support_id', verifyToken, deleteSupport)

//Customer

route.get('/get/all/customer', verifyToken, getAllCustomer);
route.post('/add/customer', verifyToken, addCustomer);
route.put('/update/customer/:customer_id', verifyToken, updateCustomer)
route.put('/delete/customer/:customer_id', verifyToken, deleteCustomer)


module.exports = { route};