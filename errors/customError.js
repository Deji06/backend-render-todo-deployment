
const express = require('express')
class customApiError extends Error {
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode
    }
}


const createCustomError = (message, statusCode) => {
    return new customApiError(message, statusCode)
}



module.exports = {
    customApiError,
    createCustomError
}