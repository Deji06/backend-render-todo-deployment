const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[true, 'please provide username'],
        minLength: 3,
        maxLength:20,
    },
    password: {
        type: String,
        required:[true, 'please provide password'],
        minLength: 3,
        maxLength:8,
    },
    email: {
        type: String,
        required:[true, 'please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "plese provide valid email",
          ],
          unique: true,
    }
})

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJwt = function () {
  return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn:'30d'})
}

userSchema.methods.confirmPassword = async function (incomingPassword) {
    const isMatch = bcrypt.compare(incomingPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', userSchema)