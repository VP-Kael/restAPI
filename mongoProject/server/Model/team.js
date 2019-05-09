const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    TeamName: {
        type: String,
        required: true
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const teamModel = mongoose.model("team", teamSchema);

module.exports = { teamModel};