const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        status: {
            type: String,
            default: 'pending'
        },

        priority: {
            type: String,
            default: 'low'
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedAt:{
            type:Date,
            required:false,
            default:null
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Tasks', TaskSchema)