
const express = require('express')
const {getAllTasks,getTask,createNewTask,updateTask,deleteTask} = require('../controllers/tasks')
const router = express.Router()
 
router.route('/').get(getAllTasks).post(createNewTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router