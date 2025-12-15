
require('dotenv').config();
const bcrypt = require('bcrypt');
const connect = require('../config/db');
const User = require('../models/User');
(async()=>{
 await connect(process.env.MONGO_URI);
 const hash = await bcrypt.hash(process.env.ADMIN_PASS,10);
 await User.create({ email: process.env.ADMIN_EMAIL, password: hash, role:'admin' });
 console.log('Admin created');
 process.exit();
})();
