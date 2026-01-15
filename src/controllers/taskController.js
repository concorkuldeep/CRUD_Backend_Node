const taskService = require('../services/taskService');
const { errorResponse, successResponse } = require('../utils/responses');

const getTasks = async (req, res) => {
    try {
        const task = await taskService.getTasks({
            userId: req.user._id
        })

        if (!task) {
            return errorResponse(res, 404, 'Task Not Found')
        }

        successResponse(res, 200, 'Task Found', task)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || error
        })
    }

}

const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;
        if (!title) {
            return errorResponse(res, 400, 'Title is required')
        }
        if (!priority) {
            return errorResponse(res, 400, 'Priority is required')
        }
        const task = await taskService.createTask({
            title,
            description,
            priority,
            userId: req.user._id
        })

        return successResponse(res, 201, 'Task Added success', task)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

const deleteTaskById = async (req, res) => {
    try {
        const { taskId } = req.body;
        const task = await taskService.deleteTaskById({
            taskId: taskId,
            userId: req.user._id
        })
        if (!task) {
            return errorResponse(res, 400, 'Not Found', { taskId })
        }


        return successResponse(res, 200, 'Task Deleted Successfully', task)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const updateTaskById = async (req, res) => {
    try {
        const { taskId, title, description, priority, status, updatedAt } = req.body;
        if (!taskId) {
            return errorResponse(res, 400, 'Task id is required')

        }
        if (!title) {
            return errorResponse(res, 400, 'Title is required')

        }
        if (!priority) {
            return errorResponse(res, 400, 'Priority is required')

        }
        if (!status) {
            return errorResponse(res, 400, 'Status is required')

        }

        const task = await taskService.updateTask({
            taskId,
            userId: req.user._id,
            data: { title, description, priority, status, updatedAt }
        })

        if (!task) {
            return errorResponse(res, 404, 'Task Not Found', task)
        }
        return successResponse(res, 200, 'Task update Success', task)


    } catch (error) {
        errorResponse(res, 500, 'Internal Server Error Update task By Id Controller')
    }
}


module.exports = {
    getTasks,
    createTask,
    deleteTaskById,
    updateTaskById
}