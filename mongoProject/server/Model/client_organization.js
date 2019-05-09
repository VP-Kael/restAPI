const mongoose = require('mongoose');

const clientOrganizationSchema = mongoose.Schema({
    OrganizationName: {
        type: String,
        required: true,
    },
    OrganizationSize: {
        type: String,
        //type: Number,
        required: true,
    },
    OrganizationDescription: String,
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const clientOrganizationModel = mongoose.model("organization", clientOrganizationSchema);

module.exports = { clientOrganizationModel };