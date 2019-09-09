let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskAssign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeveloperCol'
    },
    taskDueDate: {
        type: Date,
        required: true,
    },
    taskStatus: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

let taskModel = mongoose.model("TaskCol", taskSchema);

module.exports = taskModel;
