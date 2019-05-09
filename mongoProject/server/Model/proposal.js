const mongoose = require('mongoose');

const proposalSchema = mongoose.Schema({
    Status: {
        type: Number,
        required: true,
        default: 0
    },
    ProjectOutline: {
        type: String,
        required: true,
    },
    ProjectBenefit: {
        type: String,
        //type: Number,
        required: true,
    },
    ProductUse: {
        type: String,
        required: true,
    },
    Beneficiaries: {
        type: String,
        required: true,
    },
    Originality: String,
    ClientID: {
        type: String,
        required: true,
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const proposalModel = mongoose.model("proposal", proposalSchema);

module.exports = { proposalModel };