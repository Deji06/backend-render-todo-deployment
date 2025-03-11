const express = require('express')
const customApiError = require('../errors/customError').customApiError;
const { StatusCodes } = require('http-status-codes');

const errorHandleMiddleWare = (err,req, res, next) => {
    if(err instanceof customApiError) {
        return res.status(err.statusCode).json({msg: err.message})
    }
    console.log(err);
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('something went wrong, try again later')
}

module.exports = errorHandleMiddleWare