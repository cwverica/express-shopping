
const express = require('express');
const app = express();
const routes = require('./routes');
const morgan = require('morgan');
const myError = require('./myError');
const items = require('./fakeDb');


app.use(express.json());
app.use(morgan('dev'));


app.use("/items", routes);


app.use(function (err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;