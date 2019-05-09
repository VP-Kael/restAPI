const mongoose = require('mongoose');

const supervisorCommunicationSchema = mongoose.Schema({
    Client: {
        type: String,
        required: true,
    },
    Date: {
        type: String,
        //type: Date,
        required: true,
    },
    Topic: {
        type: String,
        required: true,
    },
    SenderFlag: {
        type: Number,
        required: true,
        default: 0
    },
    SupervisorID: {
        type: String,
        required: true,
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const supervisorCommunicationModel = mongoose.model("supervisorCommunication", supervisorCommunicationSchema);

module.exports = { supervisorCommunicationModel };