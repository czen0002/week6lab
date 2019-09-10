let mongoose = require('mongoose');

// create task schema, it includes three fields
let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        }
    },
    level: {
        type: String,
        required: true,
        set: function(newLevel){
            return newLevel.toUpperCase();
        }
    },
    address: {
        state: {
            type: String
        },
        suburb: {
            type: String
        },
        street: {
            type: String
        },
        unit: {
            type: String
        }
    }
})

// invoke the model constructor
// DeveloperCol is the collection and developerSchema it the refered schema
let developerModel = mongoose.model("DeveloperCol", developerSchema);
module.exports = developerModel;