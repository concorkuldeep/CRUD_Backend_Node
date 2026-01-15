const Task = require('../models/TaskModel');
const mongoose = require('mongoose');

const getTasksById = async ({ taskId, userId }) => {
    if (!taskId) {
        throw new Error('Task id required');
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task id')
    }

    const query = {
        _id: taskId,
        user: userId
    }

    const task = await Task.findOne(query);


    return task;

}

const deleteTaskById = async ({ taskId, userId }) => {
    try {
        if (!taskId) {
            throw new Error('Task id required');
        }
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new Error('Invalid task id')
        }
        const query = {
            _id: taskId,
            user: userId
        }

        const task = await Task.findOneAndDelete(query)
        return task

    } catch (error) {
        throw new Error('Delete Task by Id Service: ', error)
    }
}

const getTasks = async ({ userId }) => {
    if (!userId) {
        throw new Error('User id is required')
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user id')
    }

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 })
    return tasks;
}

const createTask = async ({ title, description, priority, userId }) => {
    const task = Task.create({
        title,
        description,
        priority,
        user: userId
    })

    return task;
}

const updateTask = async ({ taskId, userId, data }) => {
    const task = await Task.findOneAndUpdate(
        {
            _id: taskId, user: userId
        },
        data,
        { new: true, runValidators: true }
    )

    return task;


}

module.exports = {
    getTasks,
    createTask,
    deleteTaskById,
    updateTask
}