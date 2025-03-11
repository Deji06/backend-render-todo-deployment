const { StatusCodes } = require("http-status-codes")
const Note = require('../models/tasks');
// const notFound = require("../errors/notFound");
const { customApiError } = require("../errors/customError");
// body
const getAllTasks = async (req,res) => {
    console.log("user auth verification:", req.userDetail); // Log userDetail
    console.log("Request Headers in getAllTasks:", req.headers); // Log headers

    if (!req.userDetail) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "No user found in request" });
    }
    // console.log("user auth verification:" , req.userDetail);
    const getAll = await Note.find({createdBy: req.userDetail}).sort('createdAt')
    res.status(StatusCodes.OK).json({getAll, count:getAll.length})
}
// req.params
const getTask = async (req,res) => {
    const {userDetail, params:{id:taskId}} = req
    const getTask = await Note.findOne({_id:taskId, createdBy:userDetail })
    if(!getTask) {
        throw new customApiError('task not found', StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({getTask})
}

const createNewTask = async (req,res) => {
    req.body.createdBy= req.userDetail
    const task = await Note.create(req.body)
    res.status(StatusCodes.CREATED).json({task})
    // res.json(req.userDetail)
}

const updateTask = async (req,res) => {
    const{userDetail, params:{id:taskId, body:content}} = req
    if(content === '') {
        throw new customApiError('field cannot be empty', StatusCodes.NOT_FOUND)
    }
    const updateTask = await Note.findByIdAndUpdate({createdBy: userDetail, _id:taskId}, req.body, {new:true, runValidators: true})
    if(!updateTask) {
        throw new customApiError('no task with id:taskId found', StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({updateTask})
    // res.send('update task')
}

const deleteTask = async (req, res) => {
    const {userDetail, params:{id:taskId}} = req
    const deleteTask = await Note.findByIdAndDelete({_id:taskId, createdBy:userDetail})
    if(!deleteTask) {
        throw new customApiError('no task with id:taskId found', StatusCodes.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({msg: 'task successfully deleted'})
}

module.exports = {
    getAllTasks,
    getTask,
    createNewTask,
    updateTask,
    deleteTask
}