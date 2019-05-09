const mongoose = require('mongoose');

const coordinatorSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    ContactNumber: String,
    OfficeLocation: {
        type: String,
        required: true,
    },
    Subject: String,
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const coordinatorModel = mongoose.model("coordinator", coordinatorSchema);

module.exports = { coordinatorModel };