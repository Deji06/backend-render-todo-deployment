const express = require('express')
// const async_error = require('express-async-errors')
const {StatusCodes} = require('http-status-codes')
const errorHandler = require('../middleWare/errorHandler')
const {customApiError} = require('../errors/customError')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async(req, res, next)=> {
 try {
     const user = await User.create({...req.body})
     const token = user.createJwt()
    //  jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"})
    res.status(StatusCodes.CREATED).json({user:{name: user.username}, token})    
 } catch (error) {
    console.log(error);
    next(error)
 }
}

const login = async(req,res, next)=> {
    try {
        const {email, password} = req.body
        if(!email || !password){
            throw new customApiError('please provide email or password', StatusCodes.UNAUTHORIZED)
            // return next(createCustomError('please provide email or password', StatusCodes.UNAUTHORIZED))
        }
        const user = await User.findOne({email})
        // authentication
        if(!user) {
            throw new customApiError('provide valid credentials', StatusCodes.UNAUTHORIZED)
        }
        // comparing password
        const isPasswordMatch = await user.confirmPassword(password)
        if(!isPasswordMatch) {
            throw new customApiError('password does not match', StatusCodes.BAD_REQUEST)
        }
        const token = user.createJwt()
        // const token = jwt.sign({email},process.env.JWT_SECRET, {expiresIn:'30d'} )
        res.status(StatusCodes.ACCEPTED).json({user:{username:user.username}, token})
        
    } catch (error) {
        console.log(error);  
        next(error)
    }
} 

module.exports = {
    login, register
}

//  const{username, email, password} = req.body
//  if(!username || !email || !password) {
    //     throw new customApiError('please provide email, password or username', StatusCodes.BAD_REQUEST)
    //  }
    // res.status(StatusCodes.ACCEPTED).json({msg:'login user'})