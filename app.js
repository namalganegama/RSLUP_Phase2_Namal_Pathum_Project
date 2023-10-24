//IMPORT PACKAGE
const express = require('express');
const authRouter = require('./Routes/authRouter')
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')

let app = express();

app.use(express.json());

app.use(express.static('./public'))

//USING ROUTES

app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {

    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
