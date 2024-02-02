export const route = require('express').Router();
import { register, login } from '../controllers/user-controller';


route.post('/register', register);
route.post('/login', login)


