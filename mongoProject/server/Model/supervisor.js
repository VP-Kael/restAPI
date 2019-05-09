const mongoose = require('mongoose');

const supervisorSchema = mongoose.Schema({
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

const supervisorModel = mongoose.model("supervisor", supervisorSchema);

module.exports = { supervisorModel };