const { StatusCodes } = require('http-status-codes')
const {customApiError }= require('../errors/customError')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth =  async (req, res, next) => {
    console.log("🔍 Incoming Request Headers:", req.headers);
    const authHeader = req.headers.authorization
    console.log("auth Header:", authHeader);
    
    if(!authHeader || !authHeader.startsWith('Bearer ' )) {
        console.log("❌ Missing or invalid Authorization header");
        throw new customApiError('authentication failed, try again', StatusCodes.UNAUTHORIZED)
    }
    const token = authHeader.split(' ')[1] 
    console.log("token", token);
    
    try {
        // decoded is the convention name for tokenverification
        const tokenVerification = jwt.verify(token, process.env.JWT_SECRET)
        // req.user is convention name for user details i.e id and iat(time token was generated)
        // so we can have access to token in other routes to verify specific users
        req.userDetail = tokenVerification.userId 
        next()
    } catch (error) {
        throw new customApiError('invalid token', StatusCodes.UNAUTHORIZED)
    }
} 

module.exports = auth