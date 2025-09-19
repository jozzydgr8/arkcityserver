require('dotenv').config();
const express = require('express');
const  mongoose = require('mongoose');


const app = express();
//middleware
app.use(require('cors')());
app.use(express.json());
app.use('/product', require('./routes/productRoute'));
app.use('/user', require('./routes/UserRoute'));
app.use('/message', require('./routes/emailRoute'));
app.use('/order',require('./routes/orderRoute'));
app.use('/subscribe', require('./routes/subscribeRoute'));
app.use('/reading', require('./routes/readRoute'))

mongoose.connect(process.env.mongoosestring)
.then(()=>{
   app.listen(process.env.PORT, ()=>{
    console.log(`server live at ${process.env.PORT}`)
})
}).catch(error=>{
    console.error(error)
})
