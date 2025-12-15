require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));

connect(process.env.MONGO_URI).then(()=>{
 app.listen(process.env.PORT||5000, ()=>console.log('Backend running'));
});
