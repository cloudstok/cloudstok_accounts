 const route = require('express').Router();
const { getBillingData, addBilling, getBillByCustomer, updateBilling, deleteBilling } = require('../controllers/billing');
const { getMetaData, addMetaData } = require('../controllers/billing-Info');
const { getAllContact, addContact, updateContact, deleteContact } = require('../controllers/contact-controller');
const { getAllCustomer, addCustomer, updateCustomer, deleteCustomer, getCustomerById } = require('../controllers/customer-controller');
const { getAllSupport, addSupport, updateSupport, deleteSupport } = require('../controllers/support-controller');
const { register, login, changePassword } = require('../controllers/user-controller');
const { verifyToken, validateRole} = require('../utilities/auth');
const adminAccess = ["admin"];
const adminSupportAccess = ["admin", "support"]
const allAccess = ["admin", "support", "customer"]


route.post('/register', verifyToken, validateRole(adminAccess), register);
route.post('/login', login)
route.post('/change/password', verifyToken, changePassword)
route.get('/get/all/support', verifyToken, validateRole(adminAccess), getAllSupport)
route.post('/add/support', verifyToken, validateRole(adminAccess), addSupport)
route.put('/update/support/:support_id', validateRole(adminAccess), verifyToken, updateSupport)
route.put('/delete/support/:support_id', validateRole(adminAccess), verifyToken, deleteSupport)

//Customer

route.get('/get/all/customer', verifyToken, validateRole(adminSupportAccess), getAllCustomer);
route.post('/add/customer', verifyToken, validateRole(adminSupportAccess), addCustomer);
route.put('/update/customer/:customer_id', verifyToken, validateRole(adminSupportAccess), updateCustomer)
route.put('/delete/customer/:customer_id', verifyToken, validateRole(adminSupportAccess), deleteCustomer)
route.get('/get/customer/:customer_id', verifyToken, validateRole(adminSupportAccess), getCustomerById)

//MetaData

route.get('/get/all/metadata', verifyToken, validateRole(adminSupportAccess), getMetaData)
route.post('/add/metadata', verifyToken, validateRole(adminSupportAccess), addMetaData)

//billing

route.get('/get/all/billing', verifyToken, validateRole(adminSupportAccess), getBillingData)
route.post('/add/bill/:customer_id', verifyToken, validateRole(adminSupportAccess),  addBilling)
route.post('/update/bill/:customer_id', verifyToken, validateRole(adminSupportAccess),  updateBilling)
route.get('/get/bill/:customer_id', verifyToken, validateRole(adminSupportAccess), getBillByCustomer )
route.post('/delete/bill/:billing_id', verifyToken, validateRole(adminSupportAccess), deleteBilling)

//Contact
route.get('/get/contact/:customer_id', verifyToken, validateRole(allAccess), getAllContact);
route.post('/add/contact/:customer_id', verifyToken, validateRole(adminSupportAccess), addContact);
route.post('/update/contact/:contact_id', verifyToken, validateRole(adminSupportAccess), updateContact);
route.post('/delete/contact/:contact_id', verifyToken, validateRole(adminSupportAccess), deleteContact);


module.exports = { route};