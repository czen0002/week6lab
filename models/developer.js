let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String
        }
    },
    level: {
        type: String,
        require: true,
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

let developerModel = mongoose.model("DeveloperCol", developerSchema);

module.exports = developerModel;