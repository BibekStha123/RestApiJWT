const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routes import
const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');
const userRoute = require('./api/routes/users');

//mongodb atlas connection
//mongoose.connect('mongodb+srv://dbBibek:bibek9813@cluster0-pjd59.mongodb.net/test?retryWrites=true',{useNewUrlParser: true });



//create connection
mongoose.connect('mongodb://localhost:27017/ResfullAPI',{useNewUrlParser: true });

//on connection
mongoose.connection.on("connected", ()=>{
    console.log("connected ");
});

//logging the request
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes which handles the request
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/users', userRoute);

//handling the errors
app.use(function (req, res, next) {
    const error = new Error('Not Found');
    if (err = 404) {
        res.json({
            message: error.message
        })
    }
});

//starting the server
app.listen(3000, function (req, res) {
    console.log('server is running')
});