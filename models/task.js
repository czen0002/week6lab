let mongoose = require('mongoose');

// create task schema, it includes six fields
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
        default: Date.now
    }
})

// invoke the model constructor
// TaskCol is the collection and taskSchema it the refered schema
let taskModel = mongoose.model("TaskCol", taskSchema);
module.exports = taskModel;
