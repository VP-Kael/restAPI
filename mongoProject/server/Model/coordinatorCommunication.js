const mongoose = require('mongoose');

const coordinatorCommunicationSchema = mongoose.Schema({
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
    CoordinatorID: {
        type: String,
        required: true,
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const coordinatorCommunicationModel = mongoose.model("coordinatorCommunication", coordinatorCommunicationSchema);

module.exports = { coordinatorCommunicationModel };