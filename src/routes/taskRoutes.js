const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

const {protect} = require('../middleware/auth');

router.post('/createTask',protect,taskController.createTask);
router.get('/getTasks',protect,taskController.getTasks);
router.post('/deleteTask',protect,taskController.deleteTaskById);
router.post('/updateTask',protect,taskController.updateTaskById)
module.exports = router;