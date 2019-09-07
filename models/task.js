let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    taskName: {
        type: String,
        require: true
    },
    taskAssign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeveloperCol'
    },
    taskDueDate: {
        type: Date,
        require: true,
    },
    taskStatus: {
        type: String,
        require: true
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
