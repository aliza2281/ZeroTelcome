const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(cors());

const cookies = require('express-session')

app.use(cookies({ secret: 'aliza', cookie: { maxAge: 60000 } ,
proxy: true,
resave: true,
saveUninitialized: true }))

const clientsRouter = require('./Router/clientsRouter');
const packagesRouter = require('./Router/packagesRouter');
const adminRouter = require('./Router/adminRouter');


const moongoose = require('mongoose');
const configBank = require('./Config/zeroTelcom');


moongoose.connect(configBank.mongoUrl, { useCreateIndex: true,useNewUrlParser: true }, (err) => {
    if (err) throw err;
    console.log("connection sucsess")
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/clients/', clientsRouter);
app.use('/packages/', packagesRouter);
app.use('/admins/', adminRouter);



app.listen(4500);







