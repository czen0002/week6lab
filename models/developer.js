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
        State: {
            type: String
        },
        Suburb: {
            type: String
        },
        Street: {
            type: String
        },
        Unit: {
            type: String
        }
    }
})

let developerModel = mongoose.model("DeveloperCol", developerSchema);

module.exports = developerModel;