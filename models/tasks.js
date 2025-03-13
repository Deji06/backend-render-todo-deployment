const mongoose = require('mongoose')
// const User = require('../models/user')
const taskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'please type in your task']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, {timestamps: true})


module.exports = mongoose.model('Note', taskSchema, "notes");